/* eslint-disable camelcase -- mirrors SCEvents JSON field names in state and payloads */
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSCE } from '../../Components/context/SceContext';
import { getEventByID, getEventAttendanceSummary, registerForSCEvent } from '../../APIFunctions/SCEvents';

function ArrowLeftIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function getRegistrationStatus(event) {
  return event?.registration_status || 'none';
}

function StatusPanel({ title, message, borderClass, textClass, onBack }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-r from-gray-800 to-gray-600 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-8rem] h-[22rem] w-[22rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
        <div className={`w-full max-w-xl rounded-2xl bg-white/5 p-8 text-center shadow-2xl backdrop-blur-md ${borderClass}`}>
          <h1 className="mb-3 text-3xl font-semibold text-white md:text-4xl">
            {title}
          </h1>
          <p className={`mb-6 text-base ${textClass}`}>
            {message}
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-sky-400 hover:to-indigo-400"
          >
            Back to Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventRegistration() {
  const { user } = useSCE();
  const { id } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const registrationStatus = getRegistrationStatus(event);
  const goBackToEvents = () => history.push('/events');

  useEffect(() => {
    async function fetchEvent() {
      setIsLoading(true);
      setHasError(false);

      const token = window.localStorage.getItem('jwtToken');
      const response = await getEventByID(id, token);

      if (!response.error && response.responseData) {
        setEvent(response.responseData);
        const initialData = {};
        (response.responseData.registration_form || []).forEach(field => { // eslint-disable-line camelcase
          initialData[field.id] = field.type === 'checkbox' ? [] : '';
        });
        setFormData(initialData);
      } else {
        setHasError(true);
      }
      setIsLoading(false);
    }
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    let isCurrent = true;
    const token = window.localStorage.getItem('jwtToken');
    if (!token) {
      return;
    }

    async function fetchAttendance() {
      setAttendanceLoading(true);
      const response = await getEventAttendanceSummary(id, token);
      if (isCurrent && !response.error && typeof response.responseData?.attendee_count === 'number') {
        setAttendeeCount(response.responseData.attendee_count);
      }
      if (isCurrent) {
        setAttendanceLoading(false);
      }
    }

    fetchAttendance();

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const handleInputChange = (fieldId, value, type) => {
    if (type === 'checkbox') {
      const currentValues = formData[fieldId] || [];
      if (currentValues.includes(value)) {
        setFormData({ ...formData, [fieldId]: currentValues.filter(v => v !== value) });
      } else {
        setFormData({ ...formData, [fieldId]: [...currentValues, value] });
      }
    } else {
      setFormData({ ...formData, [fieldId]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const token = window.localStorage.getItem('jwtToken');
    if (!token) {
      setSubmitError('You must be logged in to register for an event.');
      return;
    }

    const userId = user?._id != null ? String(user._id) : '';
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    const email = user?.email || '';

    if (!userId || !email) {
      setSubmitError('Missing user information. Please log in again.');
      return;
    }

    const payload = {
      registrant: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        user_id: String(userId),
      },
      registration_form_answers: formData,
    };

    setSubmitting(true);
    const result = await registerForSCEvent(id, token, payload);
    setSubmitting(false);

    if (result.error) {
      let msg = '';
      const data = result.responseData;

      if (data && typeof data === 'object' && data.error) {
        msg = String(data.error);
      } else if (typeof data === 'string' && data.trim()) {
        msg = data.trim();
      }

      if (msg.toLowerCase().includes('registration is closed')) {
        msg = 'This event is no longer accepting sign-ups, but more events are on the way 👀';
      }

      if (!msg && result.statusCode) {
        msg = `HTTP ${result.statusCode}`;
      }

      if (!msg) {
        msg = 'Failed to submit registration.';
      }

      setSubmitError(msg);
      return;
    }

    setSubmitSuccess('Registration submitted successfully.');

    const refreshed = await getEventByID(id, token);
    if (!refreshed.error && refreshed.responseData) {
      setEvent(refreshed.responseData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-xl animate-pulse">Loading registration form...</p>
      </div>
    );
  }

  if (hasError || !event) {
    return (
      <StatusPanel
        title="Unable to Load Event"
        message="We couldn't load this event right now."
        borderClass="border border-red-400/20"
        textClass="text-red-300"
        onBack={goBackToEvents}
      />
    );
  }

  if (registrationStatus === 'registered') {
    return (
      <StatusPanel
        title="Already Registered"
        message="You are already registered for this event."
        borderClass="border border-emerald-400/20"
        textClass="text-emerald-300"
        onBack={goBackToEvents}
      />
    );
  }

  if (registrationStatus === 'pending') {
    return (
      <StatusPanel
        title="Registration Pending"
        message="Your registration is already pending for this event."
        borderClass="border border-sky-400/20"
        textClass="text-sky-300"
        onBack={goBackToEvents}
      />
    );
  }

  if (registrationStatus === 'waitlisted') {
    return (
      <StatusPanel
        title="Already on Waitlist"
        message="You are already on the waitlist for this event."
        borderClass="border border-violet-400/20"
        textClass="text-violet-300"
        onBack={goBackToEvents}
      />
    );
  }

  if (registrationStatus === 'rejected') {
    return (
      <StatusPanel
        title="Registration Unavailable"
        message="You are not currently eligible to register for this event."
        borderClass="border border-rose-400/20"
        textClass="text-rose-300"
        onBack={goBackToEvents}
      />
    );
  }

  // Block closed events
  if (event.status === 'closed') {
    return (
      <StatusPanel
        title="Registration Closed"
        message="This event is no longer accepting sign-ups, but more events are on the way 👀"
        borderClass="border border-red-400/20"
        textClass="text-red-300"
        onBack={goBackToEvents}
      />
    );
  }

  const maxAttendees = Number(event.max_attendees);
  const hasCapacityLimit = Number.isFinite(maxAttendees) && maxAttendees > 0;
  const remainingSpots =
    hasCapacityLimit && typeof attendeeCount === 'number'
      ? Math.max(maxAttendees - attendeeCount, 0)
      : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-r from-gray-800 to-gray-600 text-white">
      {/* Background Blurs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-8rem] h-[22rem] w-[22rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <button
          onClick={goBackToEvents}
          className="mb-8 flex items-center gap-2 text-gray-300 transition-colors hover:text-white group"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            <ArrowLeftIcon />
          </span>
          <span className="font-medium">Back to Events</span>
        </button>

        <h1 className="mb-8 text-3xl font-semibold text-white md:text-4xl">
          {event.name}
        </h1>

        {hasCapacityLimit && (
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
            {typeof remainingSpots === 'number'
              ? `${remainingSpots} spot${remainingSpots !== 1 ? 's' : ''} left`
              : attendanceLoading
                ? 'Loading live spots...'
                : 'Unable to load live spots right now.'}
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            {(event.registration_form || []).map((field) => ( // eslint-disable-line camelcase
              <div key={field.id} className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200 tracking-wide">
                  {field.question}
                  {field.required && <span className="ml-1 text-red-400 font-bold">*</span>}
                </label>

                {field.type === 'textbox' && (
                  <input
                    type="text"
                    required={field.required}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-500 transition-all focus:border-sky-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    placeholder="Enter your answer"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                  />
                )}

                {field.type === 'dropdown' && (
                  <div className="relative">
                    <select
                      required={field.required}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white transition-all focus:border-sky-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    >
                      <option value="" disabled className="bg-gray-800 text-gray-400">Select an option</option>
                      {(field.answer_options || []).map(opt => ( // eslint-disable-line camelcase
                        <option key={opt} value={opt} className="bg-gray-800">{opt}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}

                {field.type === 'multiple_choice' && (
                  <div className="space-y-3 pt-1">
                    {(field.answer_options || []).map(opt => ( // eslint-disable-line camelcase
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name={field.id}
                          required={field.required}
                          className="h-5 w-5 border-white/20 bg-white/5 text-sky-500 focus:ring-offset-gray-900 focus:ring-sky-500"
                          value={opt}
                          checked={formData[field.id] === opt}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                        <span className="text-gray-300 group-hover:text-white transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {field.type === 'checkbox' && (
                  <div className="space-y-3 pt-1">
                    {(field.answer_options || []).map(opt => ( // eslint-disable-line camelcase
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-white/20 bg-white/5 text-sky-500 focus:ring-offset-gray-900 focus:ring-sky-500"
                          value={opt}
                          checked={(formData[field.id] || []).includes(opt)}
                          onChange={(e) => handleInputChange(field.id, opt, 'checkbox')}
                        />
                        <span className="text-gray-300 group-hover:text-white transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {submitError && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {submitSuccess}
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting || Boolean(submitSuccess)}
                className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.01] hover:from-sky-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting
                  ? 'Submitting...'
                  : submitSuccess
                    ? 'Registration submitted'
                    : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
