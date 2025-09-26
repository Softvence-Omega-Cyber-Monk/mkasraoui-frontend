export interface Feature {
  name: string;
  limit: string;
}

export type PlanDuration = "MONTHLY" | "YEARLY";

export interface Plan {
  id: string;
  name: string;
  features: Feature[];
  price_id: string | null;
  price: number;
  is_active: boolean;
  plan_duration: PlanDuration;
}

export interface PlansResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Plan[];
}
