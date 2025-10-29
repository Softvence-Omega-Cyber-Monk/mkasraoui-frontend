import { baseApi } from "@/redux/hooks/baseApi";

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
  scheduledDate: string; 
  sections: PartySection[];
  timelineEvents: PartyTimelineEvent[];
  suggestedGifts: SuggestedGift[];
}

export interface PartyGenerationResponse {
  totalPendingInvitaion: number;
  totalInvitationCancel: number;
  totalInvitationConfirm: number;
  totalInvitation: number;
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
    // Create new Party Plan
    savePartyPlan: builder.mutation<
      PartyGenerationResponse,
      PartyGenerationRequest
    >({
      query: (body) => ({
        url: "/part-generation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PartyPlans"], 
    }),

    // Fetch single Party Plan
    getPartyPlan: builder.query<PartyGenerationResponse, string>({
      query: (id) => `/part-generation/${id}`,
      providesTags: ["PartyPlans"],
    }),

    // Fetch all Party Plans
    getPartyPlans: builder.query<PartyGenerationResponse[], void>({
      query: () => "/part-generation",
      providesTags: ["PartyPlans"],
      transformResponse: (response: any) => response.data
    }),
    savePartyCount: builder.mutation({
      query: () => ({
        url: "/part-generation/track-generation",
        method: "POST",
      }),
      invalidatesTags: ["PartyPlans"]
    })
  }),

  overrideExisting: false,
});

export const {
  useSavePartyPlanMutation,
  useGetPartyPlanQuery,
  useGetPartyPlansQuery,
  useSavePartyCountMutation
} = partyGenerationApi;
