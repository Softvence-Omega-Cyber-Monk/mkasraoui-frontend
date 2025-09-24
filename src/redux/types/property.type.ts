export interface Provider {
  id: string;
  bussinessName: string;
  email: string;
  contactName: string;
  phone: string;
  serviceCategory: string[];
  serviceArea: string;
  latitude: number;
  longitude: number;
  description: string;
  priceRange: string;
  website?: string;
  instagram?: string;
  portfolioImages?: string[];
  isApproved: boolean;
  avg_ratting: number;
  total_review: number;
 
}

export interface ProvidersResponse {
  data: {
    data: Provider[];
    total?: number;
    page?: number;
    limit?: number;
  };
  message: string;
  success: boolean;
  statusCode: number;
}
