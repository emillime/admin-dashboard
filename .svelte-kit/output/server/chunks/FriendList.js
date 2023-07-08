import { c as create_ssr_component, b as subscribe, f as escape, e as each, n as noop } from "./ssr.js";
import { liveQuery } from "dexie";
import { l as localDb } from "./localDb.js";
import { f as filterUniqueBookings } from "./utils.js";
const FriendList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let bookings;
  let $bookings, $$unsubscribe_bookings = noop, $$subscribe_bookings = () => ($$unsubscribe_bookings(), $$unsubscribe_bookings = subscribe(bookings, ($$value) => $bookings = $$value), bookings);
  $$subscribe_bookings(bookings = liveQuery(async () => {
    const bookings2 = await localDb.bookings.toArray();
    return filterUniqueBookings(bookings2);
  }));
  $$unsubscribe_bookings();
  return `  <ul>${$bookings ? `Total: ${escape($bookings.length)} ${each($bookings, (booking) => {
    return `<li>${escape(booking.bookingId.customerInfo.firstName)}, ${escape(booking.bookingId.customerInfo.mobile)}</li>`;
  })}` : ``}</ul>`;
});
export {
  FriendList as F
};
