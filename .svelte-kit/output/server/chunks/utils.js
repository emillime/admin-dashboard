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
export {
  filterUniqueBookings as f
};
