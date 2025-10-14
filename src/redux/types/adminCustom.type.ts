// src/redux/features/admin/adminCustomOrder/adminCustom.type.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "USER" | "ADMIN";
  profile_image?: string | null;
}

export interface CustomOrder {
  id: string;
  userId: string;
  tShirtType: string;
  size: string;
  gender: string;
  color: string;
  Age: string;
  theme: string;
  name: string;
  age: string;
  optionalMessage?: string;
  quantity: number;
  shippingFee: number;
  designUrl: string;
  mockupUrl: string;
  total: number;
  paymentIntentId?: string | null;
  status: string;
  address: string;
  zipCode: string;
  state: string;
  city: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomOrderResponse {
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    orders: CustomOrder[];
  };
}

export interface CustomOrderResponse {
  id: string;
  userId: string;
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
  shippingFee: number;
  designUrl: string;
  mockupUrl: string;
  total: number;
  paymentIntentId: string | null;
  status: string;
  address: string;
  zipCode: string;
  state: string;
  city: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}
