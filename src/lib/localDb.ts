import Dexie, { type Table } from 'dexie';

export class MySubClassedDexie extends Dexie {
	bookings!: Table<Booking>;

	constructor() {
		super('operatorDatabase');
		this.version(1).stores({
			bookings: '_id, bookingId.orderNumber, startTime, endTime, productSlotId.slot' // Primary key and indexed props
		});
	}
}

export const localDb = new MySubClassedDexie();
