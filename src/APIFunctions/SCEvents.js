import { ApiResponse } from './ApiResponses';

/*
  #2067:
  Clark should communicate with a locally running SCEvents instance.
  From SCEvents/cmd/server/main.go, local GET /events/ is exposed by Gin.
*/
const SCEVENTS_API_URL = 'http://localhost:8080';

export async function getAllSCEvents() {
  let status = new ApiResponse();

  try {
    const url = new URL('/events/', SCEVENTS_API_URL);
    const res = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }

  return status;
}
