// types/wishlist.types.ts

export interface Product {
  id: string;
  title: string;
  description: string;
  product_type: string;
  age_range: string;
  price: number;
  included: string[];
  tutorial: string | null;
  imges: string[];
  avg_rating: number;
  total_review: number;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  createdAt: string;
  updatedAt: string;
  prodcut: Product; // note: API typo is "prodcut", not "product"
}

export interface WishlistResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Favorite[];
}
