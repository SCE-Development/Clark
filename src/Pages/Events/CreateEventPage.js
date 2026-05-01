/* eslint-disable camelcase -- mirrors SCEvents JSON field names in state and payloads */
import { useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSCE } from '../../Components/context/SceContext';
import { createSCEvent } from '../../APIFunctions/SCEvents';
import CreateEventFormQuestionBlock from './CreateEventFormQuestionBlock';
import { membershipState } from '../../Enums';
import { useEventQuestions, toApiRegistrationForm } from './useEventQuestions';
import { getApiErrorMessage } from './eventUtils';

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
    <div className="m-10 max-w-4xl px-4 sm:px-6">
      <div className="mb-8 pt-8 pb-2">
        <Link to="/events" className="btn btn-ghost normal-case text-base pl-0 mb-4 font-medium text-gray-400 hover:text-white hover:bg-transparent">
          ← Back to Events
        </Link>
        <h1 className="pb-3 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl dark:text-white">
          Create event
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Event id: {eventId}</p>
      </div>

      <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Event details</h2>
      <div className="p-6 mb-10 space-y-4 border border-gray-200 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
        <label className="w-full form-control">
          <div className="label">
            <span className="label-text">Event name *</span>
          </div>
          <input
            type="text"
            className="w-full text-sm input input-bordered sm:text-base"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event name"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text">Date *</span>
            </div>
            <input
              type="date"
              className="w-full input input-bordered"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text">Time *</span>
            </div>
            <input
              type="time"
              className="w-full input input-bordered"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        </div>

        <label className="w-full form-control">
          <div className="label">
            <span className="label-text">Location</span>
          </div>
          <input
            type="text"
            className="w-full text-sm input input-bordered sm:text-base"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
        </label>

        <label className="w-full form-control">
          <div className="label">
            <span className="label-text">Description</span>
          </div>
          <textarea
            className="w-full min-h-24 textarea textarea-bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </label>

        <div>
          <div className="label">
            <span className="label-text">Max attendees</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              className="max-w-xs input input-bordered"
              value={maxAttendees === UNLIMITED_ATTENDEES ? '' : maxAttendees}
              disabled={maxAttendees === UNLIMITED_ATTENDEES}
              onChange={(e) => {
                if (!e.target.value) {
                  setMaxAttendees('');
                  return;
                }
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) setMaxAttendees(val);
              }}
              placeholder="e.g. 50"
            />
            <label className="flex gap-2 items-center text-sm cursor-pointer label">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={maxAttendees === UNLIMITED_ATTENDEES}
                onChange={(e) => {
                  if (e.target.checked) {
                    setMaxAttendees(UNLIMITED_ATTENDEES);
                  } else {
                    setMaxAttendees('');
                  }
                }}
              />
              <span className="label-text font-medium">No limit</span>
            </label>
          </div>
        </div>

        <div>
          <div className="label">
            <span className="label-text">Waitlist</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="max-w-xs">
              {waitlistEnabled ? (
                <input
                  type="number"
                  min="1"
                  className="w-full input input-bordered"
                  value={waitlistSize}
                  onChange={(e) => setWaitlistSize(e.target.value ? parseInt(e.target.value, 10) : '')}
                  placeholder="e.g. 20"
                />
              ) : (
                <input
                  type="text"
                  className="w-full input input-bordered"
                  value=""
                  disabled
                  placeholder="e.g. 20"
                />
              )}
            </div>

            <label className="flex gap-2 items-center text-sm cursor-pointer label">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={waitlistEnabled}
                onChange={(e) => setWaitlistEnabled(e.target.checked)}
              />
              <span className="label-text font-medium">Enable waitlist</span>
            </label>
          </div>

          {waitlistEnabled && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Maximum number of users allowed on the waitlist.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text">Publish status</span>
            </div>
            <select
              className="w-full select select-bordered"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </label>

          <label className="w-full form-control">
            <div className="label">
              <span className="label-text">Visibility</span>
            </div>
            <select
              className="w-full select select-bordered"
              value={visibility}
              onChange={(e) => {
                const nextVisibility = e.target.value;
                setVisibility(nextVisibility);
                if (nextVisibility !== 'private') {
                  setMinimumVisibleRole('');
                }
              }}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>
        </div>

        {visibility === 'private' && (
          <label className="w-full form-control">
            <div className="label">
              <span className="label-text">Minimum visible role</span>
            </div>
            <select
              className="w-full max-w-xs select select-bordered"
              value={minimumVisibleRole}
              onChange={(e) => setMinimumVisibleRole(e.target.value)}
            >
              <option value="">Select role</option>
              <option value="member">Member</option>
              <option value="officer">Officer</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        )}
      </div>

      <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Registration questions
      </h2>
      <div className="mb-6 space-y-3">
        {questions.map((q, index) => (
          <CreateEventFormQuestionBlock
            key={q.id}
            question={q}
            index={index}
            onUpdateField={updateQuestion}
            onChangeType={updateQuestionType}
            onRemove={removeQuestion}
            onUpdateAnswerOption={updateAnswerOption}
            onAddAnswerOption={addAnswerOption}
            onRemoveAnswerOption={removeAnswerOption}
          />
        ))}
        <button
          type="button"
          className="w-full border-2 border-dashed btn btn-outline border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={addQuestion}
        >
          + Add question
        </button>
      </div>

      {submitError && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg dark:bg-red-900/30 dark:text-red-200">
          {submitError}
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-start pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="btn btn-primary"
          disabled={submitting}
          onClick={handleCreateEvent}
        >
          {submitting ? 'Creating…' : 'Create event'}
        </button>
        <Link to="/events" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </div>
  );
}
