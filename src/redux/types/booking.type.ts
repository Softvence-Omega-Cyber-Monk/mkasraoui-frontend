// src/types/bookingTypes.ts

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
  price: string;
  website: string;
  instagram: string;
  portfolioImages: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  avg_ratting: number;
  total_review: number;
}

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  name: string;
  email: string;
  phone: string;
  date: string; // ISO string
  time: string; // ISO string
  numberOfGuest: number;
  partyTheme: string;
  partyLocation: string;
  description: string;
  budgetRange: string;
  status: "BOOKED" | "CANCELLED";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  provider: Provider;
}

export interface BookingResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Booking[];
}
