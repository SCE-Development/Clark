/* eslint-disable camelcase -- mirrors SCEvents JSON field names in state and payloads */
import { useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSCE } from '../../Components/context/SceContext';
import { createSCEvent } from '../../APIFunctions/SCEvents';
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

  const {
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    updateQuestionType,
    updateAnswerOption,
    addAnswerOption,
    removeAnswerOption
  } = useEventQuestions(defaultQuestions());

  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOfficerOrAdmin = user?.accessLevel >= membershipState.OFFICER;

  const adminId = useMemo(() => (user?._id != null ? String(user._id) : ''), [user]);

  async function handleCreateEvent() {
    setSubmitError('');
    if (!eventName.trim()) {
      setSubmitError('Please enter an event name.');
      return;
    }
    if (!adminId) {
      setSubmitError('Could not resolve your user id.');
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

    const payload = {
      id: eventId,
      name: eventName.trim(),
      date,
      time,
      location: location.trim(),
      description: description.trim(),
      admins: [adminId],  // The event creator becomes the initial event admin in SCEvents
      registration_form: toApiRegistrationForm(questions),
      max_attendees:
        maxAttendees === UNLIMITED_ATTENDEES ? UNLIMITED_ATTENDEES : Number(maxAttendees),
      created_at: new Date().toISOString(),
      status,
      visibility,
      minimum_visible_role: visibility === 'private' ? minimumVisibleRole : '',
      waitlist_enabled: waitlistEnabled,
      waitlist_size: waitlistEnabled ? Number(waitlistSize) : 0,
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
        containerClassName: 'm-10 max-w-4xl px-4 sm:px-6',
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
