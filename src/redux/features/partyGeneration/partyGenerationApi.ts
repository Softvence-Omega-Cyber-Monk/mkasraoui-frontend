import { baseApi } from "@/redux/hooks/baseApi";

// Define request & response types
export interface PartySectionItem {
  description: string;
  sortOrder: number;
}

export interface PartySection {
  name: string;
  items: PartySectionItem[];
}

export interface PartyTimelineEvent {
  time: string;
  description: string;
  sortOrder: number;
}

export interface SuggestedGift {
  productId: string;
}

export interface PartyGenerationRequest {
  title: string;
  scheduledDate: string; // ISO string
  sections: PartySection[];
  timelineEvents: PartyTimelineEvent[];
  suggestedGifts: SuggestedGift[];
}

export interface PartyGenerationResponse {
  id: string;
  title: string;
  scheduledDate: string;
  sections: PartySection[];
  timelineEvents: PartyTimelineEvent[];
  suggestedGifts: SuggestedGift[];
  createdAt: string;
  updatedAt: string;
}

export const partyGenerationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPartyPlan: builder.mutation<
      PartyGenerationResponse,
      PartyGenerationRequest
    >({
      query: (body) => ({
        url: "/part-generation",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreatePartyPlanMutation } = partyGenerationApi;
