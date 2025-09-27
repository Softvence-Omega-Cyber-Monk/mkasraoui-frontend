// src/types/tShirtTypes.ts

export interface TShirtRequest {
  t_shirt_type: string; // "child" | "adult"
  t_shirt_size: string; // "S" | "M" | "L" | "XL" | etc
  gender: string;       // "male" | "female" | "unisex"
  t_shirt_color: string;
  age: number;
  t_shirt_theme: string;
  optional_description?: string;
  img_file?: File | null;
}

export interface TShirtResponse {
  image_url: string; // backend returns generated image link
}
