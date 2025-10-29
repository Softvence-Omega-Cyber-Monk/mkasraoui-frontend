import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create a standalone API slice
export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://ai.mafetefacile.fr' }), 
  endpoints: (builder) => ({
    generateMessage: builder.mutation({
      query: (body) => ({
        url: 'api/v1/generate-message',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Export the hook
export const { useGenerateMessageMutation } = messageApi;
