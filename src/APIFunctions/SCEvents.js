import { ApiResponse } from './ApiResponses';

const SCEVENTS_API_URL = 'http://localhost:8002';

// ======== ORIGINAL BACKEND API REQUESTS ========
export async function getAllSCEvents() {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/`);
    const result = await res.json();
    status.responseData = result;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}

export async function getEventByID(id) {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/${id}`);
    const result = await res.json();
    status.responseData = result;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}

export async function createSCEvent(eventBody) {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventBody),
    });
    const body = await res.json();
    status.responseData = body;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}

export async function updateSCEvent(id, userId, eventUpdates) {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/${id}?user_id=${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventUpdates),
    });
    const body = await res.json();
    status.responseData = body;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}
// =================================================


// ======== MOCKED LOCAL STORAGE VERSIONS ========
// const getMockEvents = () => {
//   const data = localStorage.getItem('mockSCEvents');
//   // Initialize with empty array if null
//   return data ? JSON.parse(data) : [];
// };

// const setMockEvents = (events) => {
//   localStorage.setItem('mockSCEvents', JSON.stringify(events));
// };

// export async function getAllSCEvents() {
//   const status = new ApiResponse();
//   // Simulated network delay
//   await new Promise(resolve => setTimeout(resolve, 300));
//   status.responseData = getMockEvents();
//   status.error = false;
//   return status;
// }

// export async function getEventByID(id) {
//   const status = new ApiResponse();
//   await new Promise(resolve => setTimeout(resolve, 300));
//   const events = getMockEvents();
//   const event = events.find(e => e.id === id || e._id === id);
//   if (event) {
//     status.responseData = event;
//     status.error = false;
//   } else {
//     status.error = true;
//     status.responseData = 'Event not found in mock local storage.';
//   }
//   return status;
// }

// export async function createSCEvent(eventBody) {
//   const status = new ApiResponse();
//   await new Promise(resolve => setTimeout(resolve, 300));
//   const events = getMockEvents();
//   // Simulate backend appending the event
//   events.push(eventBody);
//   setMockEvents(events);

//   status.responseData = eventBody;
//   status.error = false;
//   return status;
// }

// export async function updateSCEvent(id, userId, eventUpdates) {
//   const status = new ApiResponse();
//   await new Promise(resolve => setTimeout(resolve, 300));
//   const events = getMockEvents();
//   const index = events.findIndex(e => e.id === id || e._id === id);
//   if (index !== -1) {
//     // Note: A real backend would verify `userId` here, but for simple mocked testing:
//     events[index] = { ...events[index], ...eventUpdates };
//     setMockEvents(events);

//     status.responseData = { message: 'Updated successfully in mock local storage' };
//     status.error = false;
//   } else {
//     status.error = true;
//     status.responseData = 'Event not found in mock local storage.';
//   }
//   return status;
// }
