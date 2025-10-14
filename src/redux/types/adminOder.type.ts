// src/redux/types/order.type.ts
export interface Product {
  id: string;
  title: string;
  description: string;
  product_type: string;
  age_range: string;
  price: number;
  discounted_price: number;
  included: string[];
  tutorial: string | null;
  imges: string[];
  avg_rating: number;
  total_review: number;
  createdAt: string;
  updatedAt: string;
  theme: string;
  up_to_kids: number | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  stripe_customer_id: string;
  profile_image: string | null;
}

export interface OrderResponse {
  id: string;
  userId: string;
  total: number;
  status: string;
  address: string;
  zipCode: string;
  state: string;
  city: string;
  contactName: string;
  contactPhone: string;
  additionalNotes: string;
  shippingFee: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user: User;
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
