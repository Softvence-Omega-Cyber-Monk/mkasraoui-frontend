// @/redux/types/partyplan.type.ts

export interface PartyRequest {
  person_name: string;
  person_age: number;
  budget: number;
  num_guests: number;
  party_date: string;
  location: string;
  party_details: {
    theme: string;
    favorite_activities: string[];
  };
  num_product: number;
}

export interface Product {
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
  up_to_kids: null;
  reviews: Review[];
}

export interface Review {
  id: string;
  rating: number;
  description: string;
  productId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartyPlan {
  [key: string]: string[];
}

export interface SuggestGifts {
  product_ids: string[];
}

export interface AllProducts {
  diyBoxes: Product[];
  gifts: Product[];
}

export interface PartyResponse {
  party_plan: PartyPlan;
  suggest_gifts: SuggestGifts;
  all_product: AllProducts;
}