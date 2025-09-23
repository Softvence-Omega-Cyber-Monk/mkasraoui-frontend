export interface Activity {
  id: string;
  title: string;
  description: string;
  productId: string;
}

export interface DIYProduct {
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
  activities: Activity[];
}

export interface DIYResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DIYProduct | DIYProduct[]; 
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
  activities: ActivityItem[];
};

