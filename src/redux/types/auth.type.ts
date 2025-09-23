export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PROVIDER" | "USER";
  address?: string;
  phone?: string;
};

export type LoginResponse = {
  token: string;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: User;
};

export type TAuth = {
  user: User | null;
  token: string | null;
};

export type RegisterRequest = {
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};
