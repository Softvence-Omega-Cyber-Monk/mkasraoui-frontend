// src/types/cart.ts

export interface CartItem {
  imges: any;
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
