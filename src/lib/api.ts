import { parseJwt } from "../utils/jwtUtils";
import { localDb } from "$lib/localDb";
import { DateTime } from "luxon";
import { getCurrentSupplierId } from "../utils/supplierHelper";
const BASE_URL =
  "https://nsf4u0aiqj.execute-api.eu-central-1.amazonaws.com/production";
const CACHE_NAME = "admin-cache";

async function fetchUseCache(
  url: string,
  init?: RequestInit
): Promise<Response> {
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

export async function authorize(
  email: string,
  password: string
): Promise<string> {
  const response = await fetch(`${BASE_URL}/authorization`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    console.error("Failed to authorize");
    throw new Error("Failed to authorize");
  }

  const data = await response.json();

  if (!data.msg.toLowerCase().includes("authorized")) {
    throw new Error("Failed to authorize");
  }

  return data.token;
}

export async function getSuppliers(token: string): Promise<Supplier[]> {
  const response = await fetch(`${BASE_URL}/admin/suppliers?names=true`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get suppliers");
  }

  const suppliers = await response.json();

  return suppliers;
}

export async function getSlots(
  token: string,
  supplierId: string | undefined = undefined
): Promise<Slot[]> {
  const url = `${BASE_URL}/admin/slots/${
    supplierId || getCurrentSupplierId()
  }`;

  const response = await fetchUseCache(url, {
    headers: {
      Authorization: token,
    },
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return response.json();
}

export async function getBookings(
  token: string,
  page: number,
  startTime: string,
  endTime?: string,
  cancelled = 0,
  bookingInProgress = 0
): Promise<Booking[]> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    startTime,
    ...(endTime && { endTime }),
    cancelled: cancelled.toString(),
    bookingInProgress: bookingInProgress.toString(),
  });

  const response = await fetch(
    `${BASE_URL}/admin/bookings?${queryParams.toString()}`,
    {
      headers: {
        Authorization: token,
      },
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  const data = await response.json();

  return data?.map((b: any) => {
    return {
      ...b,
      startTime: new Date(b?.startTime),
      endTime: new Date(b?.endTime),
      startTimeLocal: new Date(b?.startTimeLocal),
      endTimeLocal: new Date(b?.endTimeLocal),
      bookingId: {
        ...b?.bookingId,
        completedAt: new Date(b?.bookingId?.completedAt),
        createdAt: new Date(b?.bookingId?.createdAt),
        updatedAt: new Date(b?.bookingId?.updatedAt),
        modifiedAt: new Date(b?.bookingId?.modifiedAt),
        transactionLastUpdated: new Date(b?.bookingId?.transactionLastUpdated),
      },
    };
  });
}

export async function getCoupons(
  token: string,
  supplierId?: string
): Promise<Coupon[]> {
  const queryParams = new URLSearchParams({
    ...(supplierId && { supplierId })
  });

  const response = await fetch(
    `${BASE_URL}/admin/coupons?${queryParams.toString()}`,
    {
      headers: {
        Authorization: token,
      },
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch coupons");
  }

  const data = await response.json();

  const coupons: Coupon[] = data.map((c: any) => {
    return {
      ...c,
      fromDate: new Date(c.fromDate),
      toDate: new Date(c.toDate),
      paddleDateFrom: new Date(c.paddleDateFrom),
      paddleDateTo: new Date(c.paddleDateTo),
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
    };
  });

  localDb.coupons.bulkPut(coupons);
  return coupons;
}

export async function getAllBookings(
  token: string,
  startTime: string,
  endTime?: string,
  cancelled = 0,
  bookingInProgress = 0
): Promise<Booking[]> {
  const maxPages = 100;
  let page = 1;
  let allBookings: Booking[] = [];

  while (page <= maxPages) {
    try {
      const bookings = await getBookings(
        token,
        page,
        startTime,
        endTime,
        cancelled,
        bookingInProgress
      );
      if (bookings.length === 0) {
        // No more bookings on the current page, stop iterating
        break;
      }

      allBookings = allBookings.concat(bookings);
      page++;
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      break;
    }
  }

  // Store in local db
  localDb.bookings.bulkPut(allBookings);

  return allBookings;
}

export async function updateBookings(token: string, from?: string) {
  if (from == undefined) {
    from =
      localStorage.getItem("lastUpdated") ??
      DateTime.now().startOf("year").toJSDate().toISOString();
  }

  const bookings: Booking[] = await getAllBookings(token, from);
  const cancelled: Booking[] = await getAllBookings(token, from, undefined, 1);
  if (bookings.length > 0 || cancelled.length > 0) {
    localStorage.setItem(
      "lastUpdated",
      DateTime.now().startOf("day").toJSDate().toISOString()
    );
  }
}

export async function getTransactions(
  token: string,
  bookingId: string
): Promise<BookingTransaction[]> {
  const url = `${BASE_URL}/admin/booking-transactions/${bookingId}`;

  const response = await fetch(url, {
    headers: {
      Authorization: token,
    },
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}

export async function createCoupon(
  token: string,
  code: string,
  couponType: CouponType,
  discountAmount: string,
  fromDate: string,
  toDate: string,
) {
  const url = `${BASE_URL}/admin/coupons`;

  const countryId = "63072a22cbb43727095e46b2";
  const supplierIds = ["62babb55bbf1ffbdefe9eb1b"];

  const response = await fetch(url, {
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code, 
      couponType, 
      discountAmount, 
      fromDate, 
      toDate,
      countryId,
      supplierIds 
    }),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to create code");
  }

  return response.json();
}
