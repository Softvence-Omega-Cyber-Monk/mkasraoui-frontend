import { baseApi } from "@/redux/hooks/baseApi";
export interface Invitation {
  id: string;
  status: string;
  email: string;
  image: string;
  invitationToken: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  confirmation_token: string | null;
  party_id: string | null;
  guest_name: string | null;
  guest_phone: string | null;
}

export interface SendInvitationRequest {
  email: string;
  guest_name: string;
  guest_phone: string;
  party_id: string;
  imageUrl: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

// -------------------- Inject Endpoints --------------------
export const invitationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Send Invitation
    sendInvitation: builder.mutation<
      ApiResponse<Invitation>,
      SendInvitationRequest
    >({
      query: (body) => ({
        url: "/invitations/send",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Invitations"],
    }),

    // Confirm Invitation
    confirmInvitation: builder.query<ApiResponse<Invitation>, string>({
      query: (token) => `/invitations/confirm?token=${token}`,
      providesTags: ["Invitations"],
    }),

    // Cancel Invitation
    // cancelInvitation: builder.mutation<ApiResponse<Invitation>, string>({
    //   query: (token) => ({
    //     url: "/invitations/cancel",
    //     method: "POST",
    //     body: { token },
    //   }),
    //   invalidatesTags: ["Invitations"],
    // }),
    cancelInvitation: builder.mutation<ApiResponse<Invitation>, string>({
      query: (token) => ({
        url: `/invitations/cancel?token=${token}`,
        method: "POST",
        // body can be empty
      }),
      invalidatesTags: ["Invitations"],
    }),

    // Get All Invitations
    getInvitations: builder.query<Invitation[], void>({
      query: () => "/invitations",
      providesTags: ["Invitations"],
      transformResponse: (response: any) => response.data,
    }),

    // Get Invitations by User
    getInvitationsByUser: builder.query<ApiResponse<Invitation[]>, string>({
      query: (id) => `/invitations/user?id=${id}`,
      providesTags: ["Invitations"],
    }),

    // Delete Invitation
    deleteInvitation: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/invitations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invitations"],
    }),
  }),
});

// -------------------- Export Hooks --------------------
export const {
  useSendInvitationMutation,
  useConfirmInvitationQuery,
  useCancelInvitationMutation,
  useGetInvitationsQuery,
  useGetInvitationsByUserQuery,
  useDeleteInvitationMutation,
} = invitationsApi;
