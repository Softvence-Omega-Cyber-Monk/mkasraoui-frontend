import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PartyRequest, PartyResponse } from "@/redux/types/partyplan.type";

export const partyPlanApi = createApi({
  reducerPath: "partyPlanApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://72.60.190.101:8000" }),
  endpoints: (builder) => ({
    createPartyPlan: builder.mutation<PartyResponse, PartyRequest>({
      query: (body) => ({
        url: "/party_generate",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreatePartyPlanMutation } = partyPlanApi;
