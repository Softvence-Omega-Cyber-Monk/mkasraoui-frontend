export interface Newsletter {
  id: string;
  email: string;
  createdAt: string;
}

export interface NewsletterResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Newsletter | Newsletter[];
}

export interface SubscribePayload {
  email: string;
}

export interface PromotionalMailPayload {
  subject: string;
  message: string;
}


export interface PromotionalMailResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}