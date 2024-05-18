interface CustomerReport extends BookingCustomerInfo {
    totalBookings: number;
    totalPaid: number;
    firstBooking: Date;
}