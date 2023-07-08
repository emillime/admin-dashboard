function filterUniqueBookings(bookings) {
  const seenBookings = /* @__PURE__ */ new Set();
  const uniqueBookings = [];
  bookings.forEach((booking) => {
    if (!seenBookings.has(booking.bookingId.orderNumber)) {
      uniqueBookings.push(booking);
      seenBookings.add(booking.bookingId.orderNumber);
    }
  });
  return uniqueBookings;
}
function percentOfPeriodDone(currentTime, start, end) {
  if (currentTime <= start) {
    return 0;
  } else if (currentTime >= end) {
    return 100;
  }
  return (currentTime - start) / (end - start) * 100;
}
export {
  filterUniqueBookings as f,
  percentOfPeriodDone as p
};
