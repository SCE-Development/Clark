/* eslint-disable camelcase -- mirrors SCEvents JSON field names in state and payloads */
import { useMemo, useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useSCE } from '../../Components/context/SceContext';
import { getEventByID, updateSCEvent } from '../../APIFunctions/SCEvents';
import { membershipState } from '../../Enums';
import { toApiRegistrationForm, useEventQuestions } from './useEventQuestions';
import { getApiErrorMessage } from './eventUtils';
import EventEditorForm from './EventEditorForm';

/** Matches SCEvents `max_attendees` when there is no cap. */
const UNLIMITED_ATTENDEES = -1;

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
  const {
    questions,
    setQuestions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    updateQuestionType,
    updateAnswerOption,
    addAnswerOption,
    removeAnswerOption
  } = useEventQuestions([]);

  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOfficerOrAdmin = user?.accessLevel >= membershipState.OFFICER;
  const userId = useMemo(() => (user?._id != null ? String(user._id) : ''), [user]);

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
      setQuestions(evt.registration_form || []);
      setEventAdmins(evt.admins || []);
    }

    loadEvent();
  }, [id]);

  async function handleUpdateEvent() {
    setSubmitError('');
    if (!eventName.trim()) {
      setSubmitError('Please enter an event name.');
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

  if (!isOfficerOrAdmin) {
    return (
      <div className="m-10">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white">
          Edit event
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Only officers and administrators can edit events.
        </p>
        <Link to="/events" className="mt-4 btn btn-primary">
          Back to events
        </Link>
      </div>
    );
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

  // Edit access: only users listed in event.admins can update an event
  const isEventAdmin = eventAdmins.includes(userId);
  if (!isEventAdmin) {
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
        containerClassName: 'mx-auto my-10 max-w-4xl px-4 sm:px-6',
        submitLabel: 'Save changes',
        submittingLabel: 'Updating…',
        onSubmit: handleUpdateEvent,
        submitting,
        submitError,
        unlimitedAttendeesValue: UNLIMITED_ATTENDEES,
        maxAttendeesMode: 'edit',
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
    />
  );
}
