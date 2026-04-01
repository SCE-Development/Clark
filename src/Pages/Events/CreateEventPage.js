/* eslint-disable camelcase -- mirrors SCEvents JSON field names in state and payloads */
import React, { useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSCE } from '../../Components/context/SceContext.js';
import { createSCEvent, getSCEventsBaseUrl } from '../../APIFunctions/SCEvents.js';
import CreateEventFormQuestionBlock from './CreateEventFormQuestionBlock.js';
import { membershipState } from '../../Enums';

/** Matches SCEvents `max_attendees` when there is no cap. */
const UNLIMITED_ATTENDEES = -1;

function newQuestionTemplate() {
  return {
    id: crypto.randomUUID(),
    type: 'textbox',
    question: '',
    required: false,
    answer_details: { max_chars: 200 },
  };
}

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

function toApiRegistrationForm(questions) {
  return questions.map((q) => {
    const base = {
      id: q.id,
      type: q.type,
      question: q.question,
      required: !!q.required,
    };
    if (q.type === 'textbox' && q.answer_details?.max_chars) {
      base.answer_details = { max_chars: q.answer_details.max_chars };
    }
    if (
      (q.type === 'multiple_choice' || q.type === 'dropdown') &&
      q.answer_options &&
      q.answer_options.length
    ) {
      base.answer_options = q.answer_options;
    }
    return base;
  });
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
  const [maxAttendees, setMaxAttendees] = useState(UNLIMITED_ATTENDEES);
  const [questions, setQuestions] = useState(defaultQuestions);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOfficerOrAdmin = user?.accessLevel >= membershipState.OFFICER;

  const adminId = useMemo(() => (user?._id != null ? String(user._id) : ''), [user]);

  function addQuestion() {
    setQuestions((prev) => [...prev, newQuestionTemplate()]);
  }

  function removeQuestion(id) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateQuestion(id, field, value) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  }

  function updateQuestionType(id, newType) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const base = {
          id: q.id,
          type: newType,
          question: q.question,
          required: q.required,
        };
        if (newType === 'textbox') {
          return { ...base, answer_details: { max_chars: 200 } };
        }
        if (newType === 'multiple_choice' || newType === 'dropdown') {
          return { ...base, answer_options: ['Option 1', 'Option 2'] };
        }
        return base;
      }),
    );
  }

  function updateAnswerOption(questionId, optionIndex, value) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const next = [...(q.answer_options || [])];
        next[optionIndex] = value;
        return { ...q, answer_options: next };
      }),
    );
  }

  function addAnswerOption(questionId) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          answer_options: [...(q.answer_options || []), 'New option'],
        };
      }),
    );
  }

  function removeAnswerOption(questionId, optionIndex) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          answer_options: (q.answer_options || []).filter((_, i) => i !== optionIndex),
        };
      }),
    );
  }

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

    const payload = {
      id: eventId,
      name: eventName.trim(),
      date,
      time,
      location: location.trim(),
      description: description.trim(),
      admins: [adminId],
      registration_form: toApiRegistrationForm(questions),
      max_attendees:
        maxAttendees === UNLIMITED_ATTENDEES ? UNLIMITED_ATTENDEES : Number(maxAttendees),
      created_at: new Date().toISOString(),
      status: 'draft',
    };

    setSubmitting(true);
    const result = await createSCEvent(payload);
    setSubmitting(false);

    if (result.error) {
      const base = getSCEventsBaseUrl();
      let msg = '';
      const data = result.responseData;
      if (data && typeof data === 'object' && data.error) {
        msg = String(data.error);
      } else if (typeof data === 'string' && data.trim()) {
        msg = data.trim();
      }
      if (!msg && result.statusCode) {
        msg = `HTTP ${result.statusCode}`;
      }
      if (result.networkError) {
        msg =
          (msg || 'Network error') +
          `. SCEvents URL: ${base}. Is the API running (e.g. SCEvents docker compose on port 8002)?`;
      } else if (!msg) {
        msg = `SCEvents returned an error. URL: ${base}`;
      }
      setSubmitError(msg);
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
        <Link to="/events" className="block pb-3 text-sm link link-primary">
          ← Events
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
          <input
            type="number"
            min="1"
            className="max-w-xs input input-bordered"
            value={maxAttendees === UNLIMITED_ATTENDEES ? '' : maxAttendees}
            onChange={(e) =>
              setMaxAttendees(
                e.target.value ? parseInt(e.target.value, 10) : UNLIMITED_ATTENDEES,
              )
            }
            placeholder="No limit"
          />
        </div>
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
