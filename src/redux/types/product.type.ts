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
  discounted_price?: number;
  included: string[];
  tutorial?: string | null;
  imges: string[];
  avg_rating: number;
  total_review: number;
  createdAt: string;
  updatedAt: string;
  theme: string;
  category: string;
  up_to_kids?: string | null;
  activities?: ProductActivity[];
}

export interface ProductsResponse {
  diyBoxes: Product[];
  gifts: Product[];
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

// Form data types for creating/updating products
export interface ProductFormData {
  title: string;
  description: string;
  product_type: string;
  theme: string;
  category: string;
  age_range: string;
  price: number;
  included: string[];
  activities: ProductActivity[];
}


// // src/redux/types/product.type.ts
// export interface ProductActivity {
//   id?: string;
//   title: string;
//   description: string;
//   productId?: string;
// }

// export interface Product {
//   id: string;
//   title: string;
//   description: string;
//   product_type: string;
//   age_range: string;
//   price: number;
//   included: string[];
//   tutorial?: string | null;
//   imges: string[];
//   avg_rating: number;
//   total_review: number;
//   createdAt: string;
//   updatedAt: string;
//   activities?: ProductActivity[];
// }

// export interface ApiResponse<T> {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: T;
// }
