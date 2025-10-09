// src/redux/types/quotes.type.ts

export type PartyType = "BIRTHDAY" | "WEDDING" | "CORPORATE" | "OTHER";

export interface QuoteRequest {
  providerId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time?: string;
  numberOfGuest?: number;
  partyTheme?: string;
  partyType?: PartyType;
  partyLocation?: string;
  description?: string;
}

export interface QuoteResponse extends QuoteRequest {
  id: string;
  userId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "BOOKED" | "CANCELLED" | string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ✅ Generic pagination wrapper (used in getMyQuotes / getProviderQuotes)
export interface PaginatedResponse<T> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: T[];
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
