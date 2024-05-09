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

export function bookingToBookingReport(booking: Booking): BookingReport {

    let refundAmount = calculateRefundAmount(booking);
    let creditedAmount = calculateExtraAmount(booking);
    let finalPaymentAmount = booking.bookingId.paidAmount - refundAmount + creditedAmount
    
    let report: BookingReport = {
        orderNumber: booking.bookingId.orderNumber,
        completedAt: booking.bookingId.completedAt.toLocaleDateString(),
        customerName: booking.bookingId.customerInfo.name,
        totalAmount: formatNumber(booking.bookingId.totalAmount),
        paidAmount: formatNumber(booking.bookingId.paidAmount),
        paidTax: formatNumber(booking.bookingId.taxAmount),
        refundAmount: formatNumber(refundAmount),
        refundTax: formatNumber(refundAmount * 0.2),
        extraAmount: formatNumber(creditedAmount),
        extraTax: formatNumber(creditedAmount * 0.2),
        couponAmount: formatNumber(booking.bookingId.couponAmount),
        coupon: booking.bookingId.priceObject.couponCode,
        finalPaymentAmount: formatNumber(finalPaymentAmount),
        finalTaxAmount: formatNumber(finalPaymentAmount * 0.2),
        estimadedFee: formatNumber(booking.bookingId.paidAmount * 0.015)
    }

    return report;
}

export function calculateRefundAmount(booking: Booking): number {
    return booking.bookingId.transactions?.reduce((sum, transaction) => { 
        if (transaction.status.toLowerCase().includes("refund")) {
            return sum + transaction.amount/100;
        }
        return sum;
    }, 0) ?? 0;
}

export function calculateExtraAmount(booking: Booking): number {
    return booking.bookingId.transactions?.reduce((sum, transaction) => { 
        if (transaction.status.toLowerCase().includes("charge")) {
            return sum + transaction.amount/100;
        }
        return sum;
    }, 0) ?? 0;
}

export function formatNumber(num: number, decimalPlaces = 2, hideZero = true): string {
    let rounded = Number(Math.round(parseFloat(num + 'e' + decimalPlaces)) + 'e-' + decimalPlaces)

    if (hideZero && rounded === 0) {
        return "-";
    }

    return rounded.toFixed(decimalPlaces);
}
export function percentOfPeriodDone(currentTime: number, start: number, end: number): number {
    if (currentTime <= start) {
        return 0;
    } else if (currentTime >= end) {
        return 100;
    }
    return ((currentTime - start) / (end - start)) * 100;
}

export function hasNewTransactions(booking: Booking): boolean {
    // Sometimes the transactionLastUpdated could be a fe milliseconds later than the completedAt date, so we need to check if the difference is more than 1 second.
    let diff = Math.abs(booking.bookingId.transactionLastUpdated.getTime() - booking.bookingId.completedAt.getTime()) / 1000;
    return diff > 1;
}