export interface Review {
  id: string;
  rating: number;
  description: string;
  productId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DIYProduct {
  id: string;
  title: string;
  description: string;
  product_type: "DIY_BOX" | "GIFT";
  age_range: string;
  price: number;
  discounted_price: number | null;
  included: string[];
  tutorial: string | null;
  imges: string[];
  avg_rating: number;
  total_review: number;
  createdAt: string;
  updatedAt: string;
  theme: string;
  up_to_kids: string | null;
  reviews: Review[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  productId: string;
}

// Response structure matching your API
export interface ProductsData {
  diyBoxes: DIYProduct[];
  gifts: DIYProduct[];
}

export interface DIYResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ProductsData;
}

export interface SingleProductResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DIYProduct;
}

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  productId: string;
};

export type ProductItem = {
  id: string;
  title: string;
  description: string;
  product_type: "DIY_BOX" | "GIFT";
  age_range: string;
  price: number;
  discounted_price: number | null;
  included: string[];
  tutorial: string | null;
  imges: string[];
  avg_rating: number;
  total_review: number;
  createdAt: string;
  updatedAt: string;
  theme: string;
  up_to_kids: string | null;
  activities: ActivityItem[];
  reviews: Review[];
};