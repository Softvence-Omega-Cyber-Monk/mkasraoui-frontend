// src/redux/types/property.type.ts

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isDeleted: boolean;
  role: "USER" | "ADMIN" | "PROVIDER";
  createdAt: string;
  updatedAt: string;
  parties_planed: number;
  invitation_send: number;
  confirm_inviation: number;
  confirmation_token?: string | null;
  address?: string | null;
}

export interface Review {
  id: string;
  rating: number;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  providerId: string;
}

export interface Provider {
  id: string;
  userId: string;
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
  createdAt: string;
  updatedAt: string;
  avg_ratting: number;
  total_review: number;
  user: User;
  reviews: Review[];
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

export interface ProviderResponse {
  data: Provider;
  message: string;
  success: boolean;
  statusCode: number;
}

// export interface Provider {
//   id: string;
//   bussinessName: string;
//   email: string;
//   contactName: string;
//   phone: string;
//   serviceCategory: string[];
//   serviceArea: string;
//   latitude: number;
//   longitude: number;
//   description: string;
//   priceRange: string;
//   website?: string;
//   instagram?: string;
//   portfolioImages?: string[];
//   isApproved: boolean;
//   avg_ratting: number;
//   total_review: number;

// }

// export interface ProvidersResponse {
//   data: {
//     data: Provider[];
//     total?: number;
//     page?: number;
//     limit?: number;
//   };
//   message: string;
//   success: boolean;
//   statusCode: number;
// }
