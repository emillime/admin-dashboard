import Dexie from "dexie";
class MySubClassedDexie extends Dexie {
  bookings;
  constructor() {
    super("operatorDatabase");
    this.version(1).stores({
      bookings: "_id, bookingId.orderNumber, startTime, endTime, productSlotId.slot"
      // Primary key and indexed props
    });
  }
}
const localDb = new MySubClassedDexie();
export {
  localDb as l
};
