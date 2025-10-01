// src/redux/types/quotes.type.ts

export type PartyType = "BIRTHDAY" | "WEDDING" | "CORPORATE" | "OTHER";

export interface QuoteRequest {
  providerId: string;
  name: string;
  email: string;
  phone: string;
  date: string; // ISO date string (e.g. 2025-10-15T00:00:00Z)
  time?: string; // ISO time or date-time string (optional)
  numberOfGuest?: number;
  partyTheme?: string;
  partyType?: PartyType;
  partyLocation?: string;
  description?: string;
  budgetRange?: string;
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
