import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PartyResponse } from "@/redux/types/partyplan.type";

export const partyPlanApi = createApi({
  reducerPath: "partyPlanApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://ai.mafetefacile.fr" }),
  endpoints: (builder) => ({
    createPartyPlan: builder.mutation<PartyResponse, any>({
      query: (body) => ({
        url: "/party_generate",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreatePartyPlanMutation } = partyPlanApi;
