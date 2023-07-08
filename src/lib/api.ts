import { parseJwt } from "../utils/jwtUtils";

const BASE_URL = 'https://923vmokr87.execute-api.eu-central-1.amazonaws.com/production';
const CACHE_NAME = 'admin-cache';

async function fetchUseCache(url: string, init?: RequestInit): Promise<Response> {
  if (caches) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  const response = await fetch(url, init);

  if (caches && response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(url, response.clone());
  }

  return response;
}

export async function authorize(email: string, password: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/authorization`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to authorize');
  }

  const data = await response.json();

  if (data.msg != 'authorized') {
    throw new Error('Failed to authorize');
  }

  return data.token;
}

export async function getSlots(token: string, supplierId: string | undefined = undefined): Promise<Slot[]> {
  const tokenData = parseJwt(token);
  // TODO: Select correct supplier id
  const url = `${BASE_URL}/admin/slots/${supplierId || tokenData.supplierIds[0]}`;

  const response = await fetchUseCache(url, {
    headers: {
      'Authorization': token,
    },
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  return response.json();
}

export async function getBookings(token: string, page: number, startTime: string, endTime?: string, cancelled = 0, bookingInProgress = 0): Promise<Booking[]> {
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    startTime,
    ...(endTime && { endTime }),
    cancelled: cancelled.toString(),
    bookingInProgress: bookingInProgress.toString(),
  });

  const response = await fetch(`${BASE_URL}/admin/bookings?${queryParams.toString()}`, {
    headers: {
      'Authorization': token,
    },
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  const data = await response.json();

 
  return  data?.map((b: any) => { 
    return {
      ...b, 
      startTime: new Date(b?.startTime),
      endTime: new Date(b?.endTime),
      startTimeLocal: new Date(b?.startTimeLocal),
      endTimeLocal: new Date(b?.endTimeLocal),
    }
  });
}

export async function getAllBookings(token: string, startTime: string, endTime?: string, cancelled = 0, bookingInProgress = 0): Promise<Booking[]> {
  const maxPages = 100;
  let page = 1;
  let allBookings: Booking[] = [];

  while (page <= maxPages) {
    try {
      const bookings = await getBookings(token, page, startTime, endTime, cancelled, bookingInProgress);
      if (bookings.length === 0) {
        // No more bookings on the current page, stop iterating
        break;
      }

      allBookings = allBookings.concat(bookings);
      page++;
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      break;
    }
  }

  return allBookings;
}
