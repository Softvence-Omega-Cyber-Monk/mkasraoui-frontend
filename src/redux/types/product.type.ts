// src/redux/types/product.type.ts
export interface ProductActivity {
  id?: string;
  title: string;
  description: string;
  productId?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  product_type: string;
  age_range: string;
  price: number;
  included: string[];
  tutorial?: string | null;
  imges: string[];
  avg_rating: number;
  total_review: number;
  createdAt: string;
  updatedAt: string;
  activities?: ProductActivity[];
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
