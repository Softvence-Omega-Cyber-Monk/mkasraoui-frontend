export interface TshirtOrderRequest {
    tShirtType: string;
    size: string;
    gender: string;
    color: string;
    Age: string;
    theme: string;
    name: string;
    age: string;
    optionalMessage: string;
    quantity: number;
    designUrl: string;
    mockupUrl: string;
    shippingFee: number;
    total: number;
    address: string;
    zipCode: string;
    city: string;
    state: string;
    contactName: string;
    contactPhone: string;
}

export interface TshirtOrderResponse {
  orderId: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PAID" | "UNPAID";
  createdAt: string;
  updatedAt: string;
  details: TshirtOrderRequest;
}
