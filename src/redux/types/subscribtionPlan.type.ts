// src/redux/types/subscribtionPlan.type.ts
export type PlanDuration = "MONTHLY" | "YEARLY";

export interface Feature {
  name: string;
  limit: string;
}

export interface Plan {
  id: string;
  name: string;
  features: Feature[];
  price_id: string | null;
  price: number;
  is_active: boolean;
  plan_duration: PlanDuration;
}

// Used when creating/updating plans
export interface PlanFormData {
  name: string;
  price: number;
  plan_duration: PlanDuration;
  features: Feature[];
  is_active?: boolean;
  price_id?: string | null;
}

export interface GetPlansResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Plan[];
}

// export type Plan = {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   features: string[];
//   planType: "MONTHLY" | "YEARLY";
//   status: "ACTIVE" | "INACTIVE";
//   isPopular?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// };

// export type PlanFormData = Omit<Plan, "id" | "createdAt" | "updatedAt">;
