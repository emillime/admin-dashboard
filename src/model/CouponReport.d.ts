type CouponReport = {
    createdAt: Date;
    updatedAt: Date;
    active: true;
    code: string;
    couponType: string;
    discountAmount: number;
    fromDate: Date;
    toDate: Date;
    paddleDate: true,
    paddleDateFrom: Date;
    paddleDateTo: Date;
    allSuppliers: false,
    used: number;
    myUses: number;
    totalSpent: number;
    grossRevenue: number;
};