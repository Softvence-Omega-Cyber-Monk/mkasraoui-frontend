import type { DIYProduct } from "./diy.types";

export interface CartItem {
  productId: string;
  title?: string;    
  quantity: number;
  price?: number;
  image?: string;
  product?: DIYProduct
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartRequest {
  productId: string;
  quantity: number;
}

export interface RemoveCartRequest {
  productId: string;
}
