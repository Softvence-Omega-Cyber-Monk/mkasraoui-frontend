export type Activity = {
  id: string;
  title: string;
  description?: string;
  date: string;       // ISO string or timestamp
  location?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};



export type ApiResponse<T> = {
  success: boolean;    // indicates if the request was successful
  message?: string;    // optional message from the API
  data: T;             // payload of type T
  errors?: Record<string, any>; // optional errors, e.g., validation errors
};