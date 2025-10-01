// FILE: src/redux/types/user.type.ts

export type UserRole = "ADMIN" | "USER" | "PROVIDER";

export interface User {
  id: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  role: UserRole;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  parties_planed?: number;
  invitation_send?: number;
  confirm_inviation?: number;
  confirmation_token?: string | null;
  address?: string | null;
  stripe_customer_id?: string | null;
  profile_image?: string | null; // ✅ Added
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscription?: any[];
}

export interface CreateUserRequest {
  name?: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  id: string;
  data: Partial<Omit<CreateUserRequest, "password">>;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
