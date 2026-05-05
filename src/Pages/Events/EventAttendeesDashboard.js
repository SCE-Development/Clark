import { useEffect, useMemo, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { getEventByID, getEventRegistrationByRequestId, getEventRegistrations } from '../../APIFunctions/SCEvents';
import { useSCE } from '../../Components/context/SceContext';
import LinkifiedText from '../../Components/LinkifiedText/LinkifiedText';

const EVENT_REGISTRATIONS_PAGE_SIZE = 10;

function formatDateTime(dateValue) {
  if (!dateValue) return 'N/A';
  const date = new Date(dateValue);
  if (isNaN(date)) return 'N/A';
  return date.toLocaleString();
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function AnswerValue({ value }) {
  if (Array.isArray(value)) return <span><LinkifiedText>{value.join(', ') || 'N/A'}</LinkifiedText></span>;
  if (value === null || value === undefined || value === '') return <span>N/A</span>;
  if (typeof value === 'object') return <span><LinkifiedText>{JSON.stringify(value)}</LinkifiedText></span>;
  return <span><LinkifiedText>{String(value)}</LinkifiedText></span>;
}

export default function EventAttendeesDashboard() {
  const { id } = useParams();
  const { user, authenticated } = useSCE();

  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [summary, setSummary] = useState({ total: 0, accepted: 0, pending: 0, rejected: 0 });

  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [event, setEvent] = useState(null);
  const [registrationsOffset, setRegistrationsOffset] = useState(0);
  const [jumpPageDraft, setJumpPageDraft] = useState('1');

  useEffect(() => {
    if (!authenticated || !user?.token || !id) return;

    async function fetchEventDetails() {
      const response = await getEventByID(id, user.token);
      if (!response.error) {
        setEvent(response.responseData);
      }
    }

    fetchEventDetails();
  }, [authenticated, id, user?.token]);

  useEffect(() => {
    setRegistrationsOffset(0);
  }, [id, user?.token]);

  useEffect(() => {
    if (!authenticated || !user?.token || !id) {
      setIsLoadingList(false);
      return;
    }

    let active = true;
    const controller = new AbortController();

    async function fetchRegistrations() {
      setIsLoadingList(true);
      setListError('');
      const response = await getEventRegistrations(id, user.token, { limit: EVENT_REGISTRATIONS_PAGE_SIZE, offset: registrationsOffset, signal: controller.signal });
      if (!active || response.aborted) return;
      if (response.error) {
        setListError(response.responseData?.error || 'Failed to load attendees.');
        setAttendees([]);
        setSummary({ total: 0, accepted: 0, pending: 0, rejected: 0 });
      } else {
        setAttendees(Array.isArray(response.responseData?.attendees) ? response.responseData.attendees : []);
        setSummary(response.responseData?.summary || { total: 0, accepted: 0, pending: 0, rejected: 0 });
      }
      setIsLoadingList(false);
    }

    fetchRegistrations();
    return () => {
      active = false;
      controller.abort();
    };
  }, [authenticated, id, user?.token, registrationsOffset]);

  useEffect(() => {
    setJumpPageDraft(String(Math.floor(registrationsOffset / EVENT_REGISTRATIONS_PAGE_SIZE) + 1));
  }, [registrationsOffset]);

  useEffect(() => {
    if (!selectedRequestId || !user?.token || !id) {
      setIsLoadingDetail(false);
      return;
    }

    let active = true;
    const controller = new AbortController();

    async function fetchAttendeeDetail() {
      setIsLoadingDetail(true);
      setDetailError('');
      const response = await getEventRegistrationByRequestId(id, selectedRequestId, user.token, controller.signal);
      if (!active || response.aborted) return;
      if (response.error) {
        setDetailError(response.responseData?.error || 'Failed to load attendee details.');
        setSelectedAttendee(null);
      } else {
        setSelectedAttendee(response.responseData);
      }
      setIsLoadingDetail(false);
    }

    fetchAttendeeDetail();
    return () => {
      active = false;
      controller.abort();
    };
  }, [id, selectedRequestId, user?.token]);

  useEffect(() => {
    if (selectedRequestId) setIsDetailOpen(true);
  }, [selectedRequestId]);

  function handleSelectAttendee(requestId) {
    setSelectedRequestId(requestId);
    setDetailError('');
  }

  function closeDetailPanel() {
    setIsDetailOpen(false);
  }

  function handleRegistrationsPrevPage() {
    setRegistrationsOffset((prev) => Math.max(0, prev - EVENT_REGISTRATIONS_PAGE_SIZE));
  }

  function handleRegistrationsNextPage() {
    setRegistrationsOffset((prev) => prev + EVENT_REGISTRATIONS_PAGE_SIZE);
  }

  function handleJumpToRegistrationsPage(event) {
    event.preventDefault();
    const total = summary.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / EVENT_REGISTRATIONS_PAGE_SIZE));
    let page = parseInt(String(jumpPageDraft).trim(), 10);
    if (!Number.isFinite(page) || page <= 0) page = 1;
    else if (page > totalPages) page = totalPages;
    setRegistrationsOffset((page - 1) * EVENT_REGISTRATIONS_PAGE_SIZE);
    setJumpPageDraft(String(page));
  }

  const selectedAnswers = useMemo(() => {
    if (!selectedAttendee?.answers || typeof selectedAttendee.answers !== 'object') return [];

    // Create a mapping from question ID to question text (label)
    const questionMap = {};
    if (event?.registration_form && Array.isArray(event.registration_form)) {
      event.registration_form.forEach((question) => {
        if (question.id) {
          questionMap[question.id] = question.question || question.label || question.name || question.id;
        }
      });
    }

    return Object.entries(selectedAttendee.answers).map(([fieldKey, value]) => {
      const questionText = questionMap[fieldKey] || fieldKey;
      return [questionText, value];
    });
  }, [selectedAttendee, event]);

  if (!authenticated) return <Redirect to="/login" />;

  const registrationsTotal = summary.total || 0;
  const registrationsTotalPages = Math.max(1, Math.ceil(registrationsTotal / EVENT_REGISTRATIONS_PAGE_SIZE));
  const registrationsCurrentPage = Math.min(
    registrationsTotalPages,
    Math.floor(registrationsOffset / EVENT_REGISTRATIONS_PAGE_SIZE) + 1,
  );
  const canPageRegistrationsPrev = registrationsOffset > 0;
  const canPageRegistrationsNext = registrationsOffset + attendees.length < registrationsTotal;
  const showRegistrationsPagination =
    registrationsTotal > EVENT_REGISTRATIONS_PAGE_SIZE || registrationsOffset > 0;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-600 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Event Attendees Dashboard</h1>
            <p className="mt-2 text-sm text-gray-300">Event ID: {id}</p>
          </div>
          <Link to="/events" className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
            Back to Events
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <SummaryCard label="Total" value={summary.total || 0} />
          <SummaryCard label="Accepted" value={summary.accepted || 0} />
          <SummaryCard label="Pending" value={summary.pending || 0} />
          <SummaryCard label="Rejected" value={summary.rejected || 0} />
        </div>

        {isLoadingList && <p className="text-gray-300">Loading attendees...</p>}
        {!isLoadingList && listError && <p className="rounded-lg bg-red-500/20 p-4 text-red-200">{listError}</p>}

        {!isLoadingList && !listError && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Attendees</h2>
              <p className="text-xs text-gray-300">Click an attendee to open details</p>
            </div>
            {showRegistrationsPagination && (
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-1 text-xs text-gray-400">
                  <p>
                    Page {registrationsCurrentPage} of {registrationsTotalPages}
                  </p>
                  <p>
                    {attendees.length > 0
                      ? `${registrationsOffset + 1}–${registrationsOffset + attendees.length} of ${registrationsTotal}`
                      : `${registrationsTotal} total`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={isLoadingList || !canPageRegistrationsPrev}
                    onClick={handleRegistrationsPrevPage}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={isLoadingList || !canPageRegistrationsNext}
                    onClick={handleRegistrationsNextPage}
                  >
                    Next
                  </button>
                  <form className="flex items-center gap-2" onSubmit={handleJumpToRegistrationsPage}>
                    <input
                      type="text"
                      inputMode="numeric"
                      aria-label="Go to page"
                      value={jumpPageDraft}
                      onChange={(e) => setJumpPageDraft(e.target.value)}
                      className="w-14 rounded-lg border border-white/20 bg-black/20 px-2 py-1.5 text-center text-sm text-white"
                      disabled={isLoadingList}
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={isLoadingList}
                    >
                      Go
                    </button>
                  </form>
                </div>
              </div>
            )}
            {attendees.length === 0 ? (
              <p className="text-sm text-gray-300">No attendees found for this event yet.</p>
            ) : (
              <div className="space-y-2">
                {attendees.map((attendee) => (
                  <button
                    key={attendee.request_id}
                    className={[
                      'w-full rounded-lg border px-4 py-3 text-left transition',
                      selectedRequestId === attendee.request_id
                        ? 'border-sky-400 bg-sky-500/10'
                        : 'border-white/10 bg-black/10 hover:bg-white/10',
                    ].join(' ')}
                    onClick={() => handleSelectAttendee(attendee.request_id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{attendee.registrant?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-300">{attendee.registrant?.email || 'No email'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm uppercase text-gray-300">{attendee.status || 'unknown'}</p>
                        <p className="text-xs text-gray-400">{formatDateTime(attendee.created_at)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45" onClick={closeDetailPanel}>
          <div
            className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-gray-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Attendee Detail</h2>
              <button
                type="button"
                className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
                onClick={closeDetailPanel}
              >
                Close
              </button>
            </div>

            {!selectedRequestId && <p className="text-sm text-gray-300">Select an attendee to view answers.</p>}
            {isLoadingDetail && <p className="text-sm text-gray-300">Loading attendee detail...</p>}
            {!isLoadingDetail && detailError && <p className="rounded-lg bg-red-500/20 p-3 text-red-200">{detailError}</p>}
            {!isLoadingDetail && !detailError && selectedAttendee && (
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-black/10 p-3 text-sm">
                  <p><span className="text-gray-400">Name:</span> {selectedAttendee.registrant?.name || 'N/A'}</p>
                  <p><span className="text-gray-400">Email:</span> {selectedAttendee.registrant?.email || 'N/A'}</p>
                  <p><span className="text-gray-400">Status:</span> {selectedAttendee.status || 'N/A'}</p>
                  <p><span className="text-gray-400">Submitted:</span> {formatDateTime(selectedAttendee.created_at)}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-200">Registration Form Answers</h3>
                  {selectedAnswers.length === 0 ? (
                    <p className="text-sm text-gray-300">No answers submitted.</p>
                  ) : (
                    selectedAnswers.map(([fieldKey, value]) => (
                      <div key={fieldKey} className="rounded-lg border border-white/10 bg-black/10 p-3 text-sm">
                        <p className="font-medium text-white">{fieldKey}</p>
                        <p className="mt-1 text-gray-300"><AnswerValue value={value} /></p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
