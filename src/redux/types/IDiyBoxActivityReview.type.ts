export interface IDiyBoxActivityReview {
  id: string;           // Unique UUID assigned by the server
  rating: number;       // Rating of the activity, e.g., 4.5
  description: string;  // Review text
  productId: string;    // UUID of the related DIY product
  createdAt: string;    // ISO date string when the review was created
  updatedAt?: string;   // ISO date string when the review was last updated (optional)
  userId?: string;      // Optional: the ID of the user who created the review
}
