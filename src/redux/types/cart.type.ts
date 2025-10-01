// src/types/cart.ts

export interface CartItem {
  id: string | number;
  title: string;
  price: number;
  discounted_price: number;
  quantity: number;
  image?: string;
  rating?: number;
}

export interface CartState {
  items: CartItem[];
}
