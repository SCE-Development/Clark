import { Link } from 'react-router-dom';
import CreateEventFormQuestionBlock from './CreateEventFormQuestionBlock';

export default function EventEditorForm({
  meta,
  form,
  questionActions,
  adminActions,
}) {
  const {
    title,
    eventIdLabel,
    containerClassName,
    submitLabel,
    submittingLabel,
    onSubmit,
    submitting,
    submitError,
    unlimitedAttendeesValue,
    maxAttendeesMode,
  } = meta;

  const {
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
  } = form;

  const {
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    updateQuestionType,
    updateAnswerOption,
    addAnswerOption,
    removeAnswerOption,
  } = questionActions;

  return (
    <div className={containerClassName}>
      <div className="mb-8 pb-2 pt-3">
        <Link to="/events" className="btn btn-ghost mb-4 pl-0 text-base font-medium normal-case text-gray-400 hover:bg-transparent hover:text-white">
          ← Back to Events
        </Link>
        <h1 className="pb-3 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white md:text-5xl">
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Event id: {eventIdLabel}</p>
      </div>

      <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Event details</h2>
      <div className="mb-10 space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Event name *</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full text-sm sm:text-base"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event name"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Date *</span>
            </div>
            <input
              type="date"
              className="input input-bordered w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Time *</span>
            </div>
            <input
              type="time"
              className="input input-bordered w-full"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        </div>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Location</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full text-sm sm:text-base"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Description</span>
          </div>
          <textarea
            className="textarea textarea-bordered min-h-24 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </label>

        <div>
          <div className="label">
            <span className="label-text">Max attendees</span>
          </div>
          {maxAttendeesMode === 'create' ? (
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                className="input input-bordered max-w-xs"
                value={maxAttendees === unlimitedAttendeesValue ? '' : maxAttendees}
                disabled={maxAttendees === unlimitedAttendeesValue}
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
              <label className="label flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={maxAttendees === unlimitedAttendeesValue}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setMaxAttendees(unlimitedAttendeesValue);
                    } else {
                      setMaxAttendees('');
                    }
                  }}
                />
                <span className="label-text font-medium">No limit</span>
              </label>
            </div>
          ) : (
            <input
              type="number"
              min="1"
              className="input input-bordered max-w-xs"
              value={maxAttendees === unlimitedAttendeesValue ? '' : maxAttendees}
              onChange={(e) =>
                setMaxAttendees(
                  e.target.value ? parseInt(e.target.value, 10) : unlimitedAttendeesValue,
                )
              }
              placeholder="No limit"
            />
          )}
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
                  className="input input-bordered w-full"
                  value={waitlistSize}
                  onChange={(e) => setWaitlistSize(e.target.value ? parseInt(e.target.value, 10) : '')}
                  placeholder="e.g. 20"
                />
              ) : (
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value=""
                  disabled
                  placeholder="e.g. 20"
                />
              )}
            </div>

            <label className="label flex cursor-pointer items-center gap-2 text-sm">
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
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Publish status</span>
            </div>
            <select
              className="select select-bordered w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Visibility</span>
            </div>
            <select
              className="select select-bordered w-full"
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
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Minimum visible role</span>
            </div>
            <select
              className="select select-bordered w-full max-w-xs"
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

        {adminActions && (
          <div>
            {typeof adminActions.setAllOrgAdminsCanEdit === 'function' && (
              <label className="label mb-3 cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={!!adminActions.allOrgAdminsCanEdit}
                  onChange={(e) => adminActions.setAllOrgAdminsCanEdit(e.target.checked)}
                />
                <span className="label-text font-medium">
                  All officers and administrators can edit this event
                </span>
              </label>
            )}
            <div className="label">
              <span className="label-text">Event admins</span>
            </div>
            <div className={`space-y-2${adminActions.allOrgAdminsCanEdit ? ' pointer-events-none opacity-60' : ''}`}>
              {adminActions.eventAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {adminActions.userDisplayName(admin)}
                    </p>
                    {admin.email && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{admin.email}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={adminActions.isRemoveDisabledForAdmin?.(admin)}
                    onClick={() => adminActions.removeEventAdmin(admin._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className={`relative mt-4${adminActions.allOrgAdminsCanEdit ? ' pointer-events-none opacity-60' : ''}`}>
              <input
                type="text"
                className="input input-bordered w-full"
                value={adminActions.adminSearch}
                onChange={(e) => adminActions.handleAdminSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (adminActions.debounceRef.current) clearTimeout(adminActions.debounceRef.current);
                    const query = adminActions.adminSearch.trim();
                    if (query.length >= 2) adminActions.performAdminSearch(query);
                  }
                }}
                placeholder="Search admins by name or email"
              />
              {adminActions.adminSearch.trim().length >= 2 && (adminActions.adminSearching || adminActions.adminSearchResults.length > 0 || adminActions.adminSearchError) && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {adminActions.adminSearching && (
                    <div className="p-3 text-sm text-gray-500 dark:text-gray-400">Searching…</div>
                  )}
                  {!adminActions.adminSearching && adminActions.adminSearchError && (
                    <div className="p-3 text-sm text-red-600 dark:text-red-300">{adminActions.adminSearchError}</div>
                  )}
                  {!adminActions.adminSearching && adminActions.adminSearchResults.map((admin) => (
                    <button
                      key={admin._id}
                      type="button"
                      className="flex w-full items-center justify-between border-b border-gray-100 p-3 text-left last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                      onClick={() => adminActions.addEventAdmin(admin)}
                    >
                      <span>
                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                          {adminActions.userDisplayName(admin)}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          {admin.email}
                        </span>
                      </span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                        Add
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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
          className="btn btn-outline w-full border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={addQuestion}
        >
          + Add question
        </button>
      </div>

      {submitError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
          {submitError}
        </div>
      )}

      <div className="flex flex-wrap justify-start gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
        <button
          type="button"
          className="btn btn-primary"
          disabled={submitting}
          onClick={onSubmit}
        >
          {submitting ? submittingLabel : submitLabel}
        </button>
        <Link to="/events" className="btn btn-ghost">
          Cancel
        </Link>
      </div>
    </div>
  );
}
