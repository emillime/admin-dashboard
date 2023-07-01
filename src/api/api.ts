const BASE_URL = 'https://923vmokr87.execute-api.eu-central-1.amazonaws.com/production';

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

export async function getBookings(token: string, page: number, startTime: string, endTime?: string, cancelled: number = 0, bookingInProgress: number = 0): Promise<Booking[]> {
  
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
  return data;
}

export async function getAllBookings(token: string, startTime: string, endTime?: string, cancelled: number = 0, bookingInProgress: number = 0): Promise<Booking[]> {
  let page = 1;
  let allBookings: any[] = [];

  while (true) {
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

