export interface Plan {
  id: string;
  name: string;
  features: string[]; // ✅ string array
  price_id: string | null;
  price: number;
  is_active: boolean;
  plan_duration: "MONTHLY" | "YEARLY";
}

export interface PlanFormData {
  name: string;
  price: number;
  plan_duration: "MONTHLY" | "YEARLY";
  features: string[]; // ✅ string array
  is_active?: boolean;
  price_id?: string | null;
}

// Response for fetching all plans
export interface GetPlansResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Plan[];
}

// // Plan duration type
// export type PlanDuration = "MONTHLY" | "YEARLY";

// // Single feature type
// export interface Feature {
//   name: string;
//   limit: string;
// }

// // Plan type
// export interface Plan {
//   id: string;
//   name: string;
//   features: Feature[];
//   price_id: string | null;
//   price: number;
//   is_active: boolean;
//   plan_duration: PlanDuration;
// }

// // Used for creating/updating plans
// export interface PlanFormData {
//   name: string;
//   price: number;
//   plan_duration: PlanDuration;
//   features: Feature[];
//   is_active?: boolean;
//   price_id?: string | null;
// }

// // Response for fetching all plans
// export interface GetPlansResponse {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: Plan[];
// }
