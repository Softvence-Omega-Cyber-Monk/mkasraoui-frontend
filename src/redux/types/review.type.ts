export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
  avatar: string;
}

export interface IProvider {
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
  website: string;
  instagram: string;
  portfolioImages: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  avg_ratting?: number;
  total_review?: number;
}

export interface IProviderReview {
  id: string;
  rating: number;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  providerId: string;
  user?: IUser;
  provider?: IProvider;

  comment?: string;
}
