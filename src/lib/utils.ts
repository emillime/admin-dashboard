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

export function percentOfPeriodDone(currentTime: number, start: number, end: number): number {
    if (currentTime <= start) {
        return 0;
    } else if (currentTime >= end) {
        return 100;
    }
    return ((currentTime - start) / (end - start)) * 100;
}