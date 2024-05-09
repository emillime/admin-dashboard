import Dexie, { type Table } from "dexie";
import { getTokenFromCookie } from "../utils/jwtUtils";
import { getAllBookings } from "$lib/api";
import { DateTime } from "luxon";

export class MySubClassedDexie extends Dexie {
  bookings!: Table<Booking>;

  constructor() {
    super("operatorDatabase");
    this.version(1).stores({
      bookings:
        "_id, bookingId.orderNumber, bookingId.completedAt, startTime, endTime, productSlotId.slot, cancelled", // Primary key and indexed props
    });
  }
}

export const localDb = new MySubClassedDexie();

localDb.on("populate", async () => {
  let token = getTokenFromCookie();

  if (token == null || token.length === 0) {
    console.error("No token found");
    return;
  }
  if (token && token.length > 0) {
    const bookings: Booking[] = await getAllBookings(
      token,
      new Date("2022-03-25").toISOString(),
    );
    const cancelledBookings: Booking[] = await getAllBookings(
      token,
      new Date("2022-03-25").toISOString(),
      undefined,
      1,
    );
  }
});
