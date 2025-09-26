export interface SubscriptionRequest {
  priceId: string;
  pland_id: string;
}

export interface SubscriptionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}   