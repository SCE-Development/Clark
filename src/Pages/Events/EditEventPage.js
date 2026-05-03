/* eslint-disable camelcase -- mirrors SCEvents JSON field names in state and payloads */
import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useSCE } from '../../Components/context/SceContext';
import { deleteSCEvent, getEventByID, updateSCEvent } from '../../APIFunctions/SCEvents';
import { getAllUsers, validateEventAdmins } from '../../APIFunctions/User';
import { membershipState } from '../../Enums';
import { toApiRegistrationForm, useEventQuestions } from './useEventQuestions';
import { getApiErrorMessage } from './eventUtils';
import EventEditorForm from './EventEditorForm';

/** Matches SCEvents `max_attendees` when there is no cap. */
const UNLIMITED_ATTENDEES = -1;

function userDisplayName(admin) {
  const name = [admin.firstName, admin.lastName].filter(Boolean).join(' ').trim();
  return name || admin.email || admin._id;
}

export default function EditEventPage() {
  const { id } = useParams();
  const { user } = useSCE();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [visibility, setVisibility] = useState('public');
  const [minimumVisibleRole, setMinimumVisibleRole] = useState('');
  const [maxAttendees, setMaxAttendees] = useState(UNLIMITED_ATTENDEES);
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);
  const [waitlistSize, setWaitlistSize] = useState(10);
  const [eventAdmins, setEventAdmins] = useState([]);
  const [allOrgAdminsCanEdit, setAllOrgAdminsCanEdit] = useState(false);
  const [publishDate, setPublishDate] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [adminSearchResults, setAdminSearchResults] = useState([]);
  const [adminSearchError, setAdminSearchError] = useState('');
  const [adminSearching, setAdminSearching] = useState(false);
  const {
    questions,
    setQuestions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    updateQuestionType,
    updateAnswerOption,
    addAnswerOption,
    removeAnswerOption,
  } = useEventQuestions([]);

  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const userId = useMemo(() => (user?._id != null ? String(user._id) : ''), [user]);
  const eventAdminIds = useMemo(
    () => eventAdmins.map((admin) => String(admin._id)),
    [eventAdmins],
  );

  const canEditThisEvent = useMemo(() => {
    if (!userId) return false;
    if (allOrgAdminsCanEdit && (user?.accessLevel ?? 0) >= membershipState.OFFICER) {
      return true;
    }
    return eventAdminIds.includes(userId);
  }, [allOrgAdminsCanEdit, user, userId, eventAdminIds]);

  useEffect(() => {
    async function loadEvent() {
      setIsLoading(true);

      const token = window.localStorage.getItem('jwtToken');
      const result = await getEventByID(id, token);

      setIsLoading(false);

      if (result.error) {
        setFetchError('Failed to load event details.');
        return;
      }

      const evt = result.responseData;
      setEventName(evt.name || '');
      setDate(evt.date || '');
      setTime(evt.time || '');
      setLocation(evt.location || '');
      setDescription(evt.description || '');
      setStatus(evt.status || 'draft');
      setVisibility(evt.visibility || 'public');
      setMinimumVisibleRole(evt.minimum_visible_role || '');
      setMaxAttendees(
        typeof evt.max_attendees === 'number' ? evt.max_attendees : UNLIMITED_ATTENDEES,
      );
      setWaitlistEnabled(!!evt.waitlist_enabled);
      setWaitlistSize(
        typeof evt.waitlist_size === 'number' && evt.waitlist_size > 0 ? evt.waitlist_size : 10,
      );
      setPublishDate(evt.publish_date ? evt.publish_date.slice(0, 16) : '');
      setQuestions(evt.registration_form || []);
      const adminIds = Array.isArray(evt.admins) ? evt.admins.map(String) : [];
      setAllOrgAdminsCanEdit(!!evt.all_org_admins_can_edit);
      setEventAdmins(adminIds.map((adminId) => ({ _id: adminId })));

      const adminResult = await validateEventAdmins(token, adminIds);
      if (!adminResult.error) {
        const validAdmins = Array.isArray(adminResult.responseData?.validAdmins)
          ? adminResult.responseData.validAdmins
          : [];
        const validAdminIds = validAdmins.map((admin) => String(admin._id));
        setEventAdmins(validAdmins);
      }
    }

    loadEvent();
  }, [id, userId]);

  function addEventAdmin(admin) {
    if (allOrgAdminsCanEdit) return;
    setEventAdmins((prev) => {
      if (prev.some((selected) => String(selected._id) === String(admin._id))) {
        return prev;
      }
      return [...prev, admin];
    });
    setAdminSearchResults((prev) => (
      prev.filter((candidate) => String(candidate._id) !== String(admin._id))
    ));
  }

  function removeEventAdmin(adminId) {
    if (allOrgAdminsCanEdit) return;
    if (eventAdminIds.length <= 1) {
      window.alert('An event must have at least one admin.');
      return;
    }
    setEventAdmins((prev) => prev.filter((admin) => String(admin._id) !== String(adminId)));
  }

  async function performAdminSearch(query) {
    setAdminSearching(true);
    const token = window.localStorage.getItem('jwtToken');
    const result = await getAllUsers({ token, query, minRole: membershipState.OFFICER });
    setAdminSearching(false);
    if (result.error) {
      setAdminSearchError('Failed to search admins.');
      return;
    }
    const users = Array.isArray(result.responseData?.items) ? result.responseData.items : [];
    setAdminSearchResults(
      users.filter((candidate) => (
        !eventAdminIds.includes(String(candidate._id))
      )),
    );
  }

  function handleAdminSearchChange(value) {
    setAdminSearch(value);
    setAdminSearchError('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const query = value.trim();
    if (query.length < 2) {
      setAdminSearchResults([]);
      setAdminSearching(false);
      return;
    }
    setAdminSearching(true);
    debounceRef.current = setTimeout(() => performAdminSearch(query), 300);
  }

  function toPublishDateValue(status, publishDate) {
    if (status === 'closed') return null;
    if (!publishDate) return null;
    return new Date(publishDate).toISOString();
  }

  async function handleUpdateEvent() {
    setSubmitError('');
    if (!eventName.trim()) {
      setSubmitError('Please enter an event name.');
      return;
    }

    if (!date) {
      setSubmitError('Please select an event date.');
      return;
    }

    if (!time) {
      setSubmitError('Please select an event time.');
      return;
    }

    if (!location.trim()) {
      setSubmitError('Please enter an event location.');
      return;
    }

    if (visibility === 'private' && !minimumVisibleRole) {
      setSubmitError('Please select a minimum visible role for private events.');
      return;
    }

    if (waitlistEnabled && (!waitlistSize || Number(waitlistSize) <= 0)) {
      setSubmitError('Please enter a valid waitlist size.');
      return;
    }

    if (!allOrgAdminsCanEdit && eventAdminIds.length === 0) {
      setSubmitError('Please select at least one event admin, or allow all officers and administrators to edit.');
      return;
    }

    if (!allOrgAdminsCanEdit && !eventAdminIds.includes(userId)) {
      const confirmed = window.confirm('You will lose edit access to this event after saving.');
      if (!confirmed) {
        return;
      }
    }

    if (status === 'closed' && publishDate) {
      setSubmitError('Closed events cannot have a publish date.');
      return;
    }

    if (status === 'published' && publishDate) {
      const confirmed = window.confirm(
        'This event is marked published and also has a publish date. It may publish immediately if that date is in the past. Continue?'
      );
      if (!confirmed) return;
    }

    const hasBlankQuestion = questions.some((q) => !String(q.question || '').trim());

    if (hasBlankQuestion) {
      setSubmitError('Please fill out all registration question text fields.');
      return;
    }

    const hasBlankAnswerOption = questions.some((q) =>
      ['multiple_choice', 'dropdown', 'checkbox'].includes(q.type) &&
      (!Array.isArray(q.answer_options) ||
        q.answer_options.length === 0 ||
        q.answer_options.some((opt) => !String(opt || '').trim()))
    );

    if (hasBlankAnswerOption) {
      setSubmitError('Please fill out all answer options for choice questions.');
      return;
    }

    const payload = {
      name: eventName.trim(),
      date,
      time,
      location: location.trim(),
      description: description.trim(),
      registration_form: toApiRegistrationForm(questions),
      max_attendees:
        maxAttendees === UNLIMITED_ATTENDEES ? UNLIMITED_ATTENDEES : Number(maxAttendees),
      status,
      visibility,
      minimum_visible_role: visibility === 'private' ? minimumVisibleRole : '',
      waitlist_enabled: waitlistEnabled,
      waitlist_size: waitlistEnabled ? Number(waitlistSize) : 0,
      admins: allOrgAdminsCanEdit ? [] : eventAdminIds,
      all_org_admins_can_edit: allOrgAdminsCanEdit,
      publish_date: toPublishDateValue(status, publishDate),
    };

    setSubmitting(true);
    const token = window.localStorage.getItem('jwtToken');
    const result = await updateSCEvent(id, token, payload);
    setSubmitting(false);

    if (result.error) {
      setSubmitError(getApiErrorMessage(result, {
        fallback: 'SCEvents returned an error.',
        networkHint: 'Is the SCEvents API running (e.g. Docker on port 8002)?',
      }));
      return;
    }

    history.push('/events');
  }

  async function handleConfirmDelete() {
    setDeleteError('');
    setDeleteSubmitting(true);
    const token = window.localStorage.getItem('jwtToken');
    const result = await deleteSCEvent(id, token);
    setDeleteSubmitting(false);
    if (result.error) {
      setDeleteError(getApiErrorMessage(result, {
        fallback: 'SCEvents returned an error.',
        networkHint: 'Is the SCEvents API running (e.g. Docker on port 8002)?',
      }));
      return false;
    }
    history.push('/events');
    return true;
  }

  if (isLoading) {
    return <div className="p-10 text-center text-lg">Loading event details...</div>;
  }

  if (fetchError) {
    return (
      <div className="p-10 text-center text-lg text-red-500">
        {fetchError}
        <br />
        <Link to="/events" className="mt-4 btn btn-primary">
          Back to events
        </Link>
      </div>
    );
  }

  if (!canEditThisEvent) {
    return (
      <div className="m-10">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
          Edit event
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          You are not an admin of this event.
        </p>
        <Link to="/events" className="mt-4 btn btn-primary">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <EventEditorForm
      meta={{
        title: 'Edit event',
        eventIdLabel: id,
        containerClassName: 'mx-auto mt-3 mb-6 w-full max-w-4xl px-3 sm:mt-4 sm:mb-8 sm:px-6 md:mt-5 md:mb-10',
        submitLabel: 'Save changes',
        submittingLabel: 'Updating…',
        onSubmit: handleUpdateEvent,
        submitting,
        submitError,
        unlimitedAttendeesValue: UNLIMITED_ATTENDEES,
        maxAttendeesMode: 'edit',
        eventDelete: {
          show: true,
          deleteSubmitting,
          deleteError,
          clearDeleteError: () => setDeleteError(''),
          onConfirmDelete: handleConfirmDelete,
        },
      }}
      form={{
        eventName,
        setEventName,
        date,
        setDate,
        time,
        setTime,
        location,
        setLocation,
        description,
        setDescription,
        status,
        setStatus,
        visibility,
        setVisibility,
        minimumVisibleRole,
        setMinimumVisibleRole,
        maxAttendees,
        setMaxAttendees,
        waitlistEnabled,
        setWaitlistEnabled,
        waitlistSize,
        setWaitlistSize,
        publishDate,
        setPublishDate,
      }}
      questionActions={{
        questions,
        addQuestion,
        removeQuestion,
        updateQuestion,
        updateQuestionType,
        updateAnswerOption,
        addAnswerOption,
        removeAnswerOption,
      }}
      adminActions={{
        eventAdmins,
        userDisplayName,
        adminSearch,
        adminSearchResults,
        adminSearchError,
        adminSearching,
        debounceRef,
        handleAdminSearchChange,
        performAdminSearch,
        addEventAdmin,
        removeEventAdmin,
        allOrgAdminsCanEdit,
        setAllOrgAdminsCanEdit: (next) => {
          setAllOrgAdminsCanEdit(next);
          if (next) {
            setEventAdmins([]);
          } else if (user) {
            setEventAdmins((prev) => {
              if (prev.some((a) => String(a._id) === userId)) return prev;
              return [
                ...prev,
                {
                  _id: userId,
                  firstName: user.firstName || '',
                  lastName: user.lastName || '',
                  email: user.email || '',
                  accessLevel: user.accessLevel,
                },
              ];
            });
          }
        },
      }}
    />
  );
}
