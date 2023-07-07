export function filterUniqueBookings(bookings: Booking[]): Booking[] {
    const seenBookings = new Set<string>();
    const uniqueBookings: Booking[] = [];
    bookings.forEach((booking) => {
        if (!seenBookings.has(booking.bookingId.orderNumber)) {
            uniqueBookings.push(booking);
            seenBookings.add(booking.bookingId.orderNumber);
        }
    });
    return uniqueBookings;
}