import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getAllCardsFromDb({ token, page }) {
    const url = new URL('/api/OfficeAccessCard/getAllCards', BASE_API_URL);
    let status = new ApiResponse();

    if (page) {
        url.searchParams.set('page', page);
    }

    try {
        const res = await fetch(url.href, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            const result = await res.json();
            status.responseData = result;
        } else {
            status.error = true;
        }
    } catch (error) {
        status.error = true;
        status.responseData = error;
    }
    return status;
}

export async function deleteCardFromDb(token, cardBytes) {
    const url = new URL('/api/OfficeAccessCard/delete', BASE_API_URL);
    let status = new ApiResponse();

    try {
        const res = await fetch(url.href, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cardBytes })
        });
        status.error = !res.ok;
    } catch (error) {
        status.error = true;
        status.responseData = error;
    }
    return status;
}