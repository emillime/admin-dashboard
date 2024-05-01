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
        "_id, bookingId.orderNumber, startTime, endTime, productSlotId.slot", // Primary key and indexed props
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
      DateTime.now().startOf("year").toJSDate().toISOString(),
    );
    const cancelledBookings: Booking[] = await getAllBookings(
      token,
      DateTime.now().startOf("year").toJSDate().toISOString(),
      undefined,
      1,
    );
    /*try {
      const id = await localDb.bookings.bulkPut(bookings);
      await localDb.bookings.bulkPut(cancelledBookings);
    } catch (error) {
      console.error(`Failed to add bookings: ${error}`);
    }*/
  }
});
