import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { GenerateCardRequest, GenerateCardResponse } from '@/redux/types/generateCard.type';


export const generateCardApi = createApi({
    reducerPath: 'generateCardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: "https://partyplanegenerator.onrender.com",
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        generateCard: builder.mutation<GenerateCardResponse, GenerateCardRequest>({
            query: (body) => ({
                url: '/api/v1/generate-card',
                method: 'POST',
                body,
            }),
        }),
    }),
});


export const { useGenerateCardMutation } = generateCardApi;