export interface IAffiliatedProduct {
  id: string;
  title: string;
  price: number;
  avg_rating: number;
  total_review: number;
  image_url: string;
  affiliated_company: string;
  link: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AffiliatedProductPayload {
  title: string;
  price: number;
  avgRating: number;
  totalRatings: number;
  imageUrl: string;
  affiliatedCompany: string;
  link: string;
}

export interface IAffiliatedProductResponse {
  items: IAffiliatedProduct[];
  total: number;
}



// export interface IAffiliatedProduct {
//   id: string;
//   title: string;
//   price: number;
//   avg_rating: number;
//   total_review: number;
//   image_url: string;
//   affiliated_company: string;
//   link: string;
//   createdAt?: string;
//   updatedAt?: string;
//   items:string
// }
 

// export interface IAffiliatedProductResponse {
//   items: IAffiliatedProduct[];
//   total: number;
// }

// export interface AffiliatedProduct {
//   id: string;
//   title: string;
//   price: number;
//   avgRating: number;
//   totalRatings: number;
//   image_url: string;
//   affiliated_company: string;
//   link: string;
//   createdAt?: string;
//   updatedAt?: string;
//   items:string
// }
 