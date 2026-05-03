/* eslint-disable camelcase -- mirrors SCEvents JSON field names in state and payloads */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSCE } from '../../Components/context/SceContext';
import { createSCEvent } from '../../APIFunctions/SCEvents';
import { getAllUsers } from '../../APIFunctions/User';
import { membershipState } from '../../Enums';
import { useEventQuestions, toApiRegistrationForm } from './useEventQuestions';
import { getApiErrorMessage } from './eventUtils';
import EventEditorForm from './EventEditorForm';

/** Matches SCEvents `max_attendees` when there is no cap. */
const UNLIMITED_ATTENDEES = -1;

function defaultQuestions() {
  return [
    {
      id: crypto.randomUUID(),
      type: 'textbox',
      question: 'Full Name',
      required: true,
      answer_details: { max_chars: 100 },
    },
    {
      id: crypto.randomUUID(),
      type: 'textbox',
      question: 'Email Address',
      required: true,
      answer_details: { max_chars: 100 },
    },
    {
      id: crypto.randomUUID(),
      type: 'multiple_choice',
      question: 'Major',
      required: false,
      answer_options: ['Computer Engineering', 'Software Engineering', 'Computer Science', 'Other'],
    },
  ];
}

function userDisplayName(admin) {
  const name = [admin.firstName, admin.lastName].filter(Boolean).join(' ').trim();
  return name || admin.email || admin._id;
}

export default function CreateEventPage() {
  const { user } = useSCE();
  const history = useHistory();

  const [eventId] = useState(() => crypto.randomUUID());
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [visibility, setVisibility] = useState('public');
  const [minimumVisibleRole, setMinimumVisibleRole] = useState('');
  const [maxAttendees, setMaxAttendees] = useState(UNLIMITED_ATTENDEES);
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);
  const [waitlistSize, setWaitlistSize] = useState(10);
  const [publishDate, setPublishDate] = useState('');
  const {
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    updateQuestionType,
    updateAnswerOption,
    addAnswerOption,
    removeAnswerOption,
  } = useEventQuestions(defaultQuestions());
  const [eventAdmins, setEventAdmins] = useState([]);
  const [allOrgAdminsCanEdit, setAllOrgAdminsCanEdit] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminSearchResults, setAdminSearchResults] = useState([]);
  const [adminSearchError, setAdminSearchError] = useState('');
  const [adminSearching, setAdminSearching] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef(null);

  const isOfficerOrAdmin = user?.accessLevel >= membershipState.OFFICER;

  const adminId = useMemo(() => (user?._id != null ? String(user._id) : ''), [user]);
  const eventAdminIds = useMemo(
    () => eventAdmins.map((admin) => String(admin._id)),
    [eventAdmins],
  );

  useEffect(() => {
    if (!adminId || allOrgAdminsCanEdit) return;
    setEventAdmins((prev) => {
      if (prev.some((admin) => String(admin._id) === adminId)) {
        return prev;
      }
      return [
        ...prev,
        {
          _id: adminId,
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          accessLevel: user?.accessLevel,
        },
      ];
    });
  }, [adminId, user, allOrgAdminsCanEdit]);

  function addEventAdmin(admin) {
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

  function removeEventAdmin(id) {
    if (String(id) === adminId) {
      return;
    }
    setEventAdmins((prev) => prev.filter((admin) => String(admin._id) !== String(id)));
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

  async function handleCreateEvent() {
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
    if (!adminId) {
      setSubmitError('Could not resolve your user id.');
      return;
    }
    if (!allOrgAdminsCanEdit && eventAdminIds.length === 0) {
      setSubmitError('Please select at least one event admin, or allow all officers and administrators to edit.');
      return;
    }
    if (visibility === 'private' && !minimumVisibleRole) {
      setSubmitError('Please select a minimum visible role for private events.');
      return;
    }
    if (maxAttendees !== UNLIMITED_ATTENDEES && (maxAttendees === '' || maxAttendees <= 0)) {
      setSubmitError('Please enter a valid max attendees, or check "No limit".');
      return;
    }
    if (waitlistEnabled && (!waitlistSize || Number(waitlistSize) <= 0)) {
      setSubmitError('Please enter a valid waitlist size.');
      return;
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
      id: eventId,
      name: eventName.trim(),
      date,
      time,
      location: location.trim(),
      description: description.trim(),
      admins: allOrgAdminsCanEdit ? [] : eventAdminIds,
      all_org_admins_can_edit: allOrgAdminsCanEdit,
      registration_form: toApiRegistrationForm(questions),
      max_attendees:
        maxAttendees === UNLIMITED_ATTENDEES ? UNLIMITED_ATTENDEES : Number(maxAttendees),
      created_at: new Date().toISOString(),
      status,
      visibility,
      minimum_visible_role: visibility === 'private' ? minimumVisibleRole : '',
      waitlist_enabled: waitlistEnabled,
      waitlist_size: waitlistEnabled ? Number(waitlistSize) : 0,
      publish_date: toPublishDateValue(status, publishDate),
    };

    setSubmitting(true);
    const token = window.localStorage.getItem('jwtToken');
    const result = await createSCEvent(token, payload);
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

  if (!isOfficerOrAdmin) {
    return (
      <div className="m-10">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
          Create event
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Only officers and administrators can create events.
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
        title: 'Create event',
        eventIdLabel: eventId,
        containerClassName: 'mx-auto mt-3 mb-6 w-full max-w-4xl px-3 sm:mt-4 sm:mb-8 sm:px-6 md:mt-5 md:mb-10',
        submitLabel: 'Create event',
        submittingLabel: 'Creating…',
        onSubmit: handleCreateEvent,
        submitting,
        submitError,
        unlimitedAttendeesValue: UNLIMITED_ATTENDEES,
        maxAttendeesMode: 'create',
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
        isRemoveDisabledForAdmin: (admin) => String(admin._id) === adminId,
        allOrgAdminsCanEdit,
        setAllOrgAdminsCanEdit: (next) => {
          setAllOrgAdminsCanEdit(next);
          if (next) {
            setEventAdmins([]);
          }
        },
      }}
    />
  );
}
