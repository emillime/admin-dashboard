type Coupon = {
    _id: string;
    active: true;
    code: string;
    couponType: string;
    discountAmount: number,
    fromDate: Date;
    toDate: Date;
    paddleDate: true,
    paddleDateFrom: Date;
    paddleDateTo: Date;
    countryId: string;
    allSuppliers: false,
    supplierIds: string[];
    createdByUserType: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    used: number;
    id: string;
}

type CouponType = 'giftCard' | 'discount'