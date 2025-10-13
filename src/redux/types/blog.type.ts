export interface Blog {
  id: string;
  title: string;
  description: string;
  conclusion: string;
  badge: string;
  tag: string[];
  createdAt: string;
  updatedAt: string;
  images?: string[];
  user_id?: string;
}

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}


