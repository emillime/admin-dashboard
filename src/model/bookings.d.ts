
type BookingCustomerInfo = {
    mobile: string;
    email: string;
    marketingNewsletter: boolean;
    marketingPersonalTerms: boolean;
    marketingSms: boolean;
    approvedTerms: string;
    preferredLanguage: string;
    firstName: string;
    lastName: string;
    name: string;
    countryCode: string;
    postCode: string;
    stripeCustomerId: string;
  };
  
  type BookingPriceObject = {
    coupon: boolean;
    couponCode: string;
    products: {
      [productId: string]: {
        quantity: number;
        paid: number;
        discount: number;
        productName: string;
        productType: string;
      };
    };
    tax: number;
    total: number;
    totalDiscount: number;
    totalWithDiscount: number;
    totalWithoutTax: number;
  };
  
  type BookingDetailsPaymentObject = {
    paymentType: string;
    paymentStatus: string;
    reservationNumber: string;
    description: string;
    message: string;
    paymentNumber: string;
    transactionId: string;
    transactionDate: string;
    amountPaid: number;
    currency: string;
  };
  
  type Booking = {
    bookingInProgress: boolean;
    _id: string;
    cancelled: boolean;
    bookingId: {
      customerInfo: BookingCustomerInfo;
      priceObject: BookingPriceObject;
      refunded: boolean;
      _id: string;
      orderNumber: string;
      status: string;
      customerBookingEmail: boolean;
      operatorBookingEmail: boolean;
      supplierId: string;
      modifiedAt: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      couponAmount: number;
      currency: string;
      detailsPaymentObject: BookingDetailsPaymentObject;
      paidAmount: number;
      taxAmount: number;
      totalAmount: number;
      totalCurrency: string;
      totalTaxWithoutCoupon: number;
      completedAt: string;
      customerId: string;
      stripeCustomerId: string;
      stripePaymentMethod: string;
      stripePaymentNumber: string;
      transactionLastUpdated: string;
    };
    productId: {
      _id: string;
      rezdyProductCode: string;
      name: string;
      description: string;
      supplierId: string;
      price: number;
      currency: string;
      __v: number;
      productType: string;
      rezdyWidget: string;
      minRentalTime: string;
      priceRateId: string;
    };
    supplierId: {
      text: {
        information: {
          sv: string;
          en: string;
        };
      };
      contact: {
        name: string;
        phone: string;
        email: string;
        companyName: string;
        orgnr: string;
        address: string;
        phoneInvoice: string;
        emailInvoice: string;
      };
      openHours: {
        open24: boolean;
      };
      _id: string;
      name: string;
      address: string;
      postCode: string;
      lat: string;
      lng: string;
      city: string;
      country: string;
      rezdyApiKey: string;
      rezdySupplierId: string;
      iglooDepartmentId: string;
      active: boolean;
      __v: number;
      countryId: string;
      inactiveBooking: boolean;
      openDates: {
        from: string;
        to: string;
        _id: string;
      }[];
      overrideCountryTaxRate: boolean;
      stationNumber: number;
      timezone: string;
      bookingSystem: string;
      googleReviewUrl: string;
    };
    productSlotId: {
      _id: string;
      supplierId: string;
      productId: string;
      slot: string;
      lockId: string;
      quantity: number;
      available: number;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    startTime: Date;
    startTimeLocal: Date;
    endTime: Date;
    endTimeLocal: Date;
    codeSent: boolean;
    reminderSent: boolean;
    slotError: boolean;
    quantities: unknown[];
    commentToCustomer: unknown[];
    __v: number;
    code: string;
  };

  type Slot = {
      _id: string,
      supplierId: string,
      productId: string,
      slot: string,
      lockId: string,
      active: boolean,
      __v: number,
      productResourceId: string
    }