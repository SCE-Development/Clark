import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getEventByID } from '../../APIFunctions/SCEvents';

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

export default function EventRegistration() {
  const { id } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      setIsLoading(true);
      const response = await getEventByID(id);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a more "useful" alert with a summary
    const summary = (event.registration_form || []).map(field => { // eslint-disable-line camelcase
      const answer = formData[field.id];
      const displayAnswer = Array.isArray(answer) ? answer.join(', ') : answer;
      return `- ${field.question}: ${displayAnswer || 'N/A'}`;
    }).join('\n');

    const message = `Registration Successful for: ${event.name}!\n\nSummary of your responses:\n${summary}\n\nNote: Backend storage will be added in a future update.`;

    alert(message);
    history.push('/events');
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
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="mb-4 text-xl text-red-400 font-semibold">Failed to load event details.</p>
          <button
            onClick={() => history.push('/events')}
            className="text-sky-400 hover:text-sky-300 transition-colors underline underline-offset-4"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-r from-gray-800 to-gray-600 text-white">
      {/* Background Blurs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-8rem] h-[22rem] w-[22rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <button
          onClick={() => history.push('/events')}
          className="mb-8 flex items-center gap-2 text-gray-300 transition-colors hover:text-white group"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            <ArrowLeftIcon />
          </span>
          <span className="font-medium">Back to Events</span>
        </button>

        <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
          Register for {event.name}
        </h1>
        <div className="mb-8 h-[2px] w-28 rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400" />

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

            <div className="pt-6">
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.01] hover:from-sky-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-[0.99]"
              >
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
