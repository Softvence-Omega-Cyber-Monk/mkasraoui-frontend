import { baseApi } from "@/redux/hooks/baseApi";

interface PrintOrderRequest {
  imageUrl: string;
  packQuantity: number;
  total: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  addressLine1: string;
  addressLine2?: string;
  postCode: string;
  city: string;
  state: string;
  country: string;
}

interface PrintOrderResponse {
  data: any;
  id: string;
  checkoutUrl: string;
  sessionId: string;
}

interface PrintOrder {
  id: string;
  imageUrl: string;
  packQuantity: number;
  total: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  addressLine1: string;
  addressLine2?: string;
  postCode: string;
  city: string;
  state: string;
  country: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface VerifySessionResponse {
  success: boolean;
  order?: PrintOrder;
}

export const printOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPrintOrder: builder.mutation<PrintOrderResponse, PrintOrderRequest>({
      query: (body) => ({
        url: '/print-orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PrintOrders'],
    }),

    getAllPrintOrders: builder.query<PaginatedResponse<PrintOrder>, { limit?: number; page?: number }>({
      query: ({ limit = 10, page = 1 } = {}) => ({
        url: '/print-orders',
        params: { limit, page },
      }),
      providesTags: ['PrintOrders'],
    }),

    verifyPrintOrderSession: builder.query<VerifySessionResponse, string>({
      query: (sessionId) => `/print-orders/verify/${sessionId}`,
      providesTags: (_result, _error, sessionId) => [{ type: 'PrintOrders', id: sessionId }],
    }),

    getMyPrintOrders: builder.query<PaginatedResponse<PrintOrder>, { limit?: number; page?: number }>({
      query: ({ limit = 10, page = 1 } = {}) => ({
        url: '/print-orders/my-orders',
        params: { limit, page },
      }),
      providesTags: ['PrintOrders'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePrintOrderMutation,
  useGetAllPrintOrdersQuery,
  useVerifyPrintOrderSessionQuery,
  useGetMyPrintOrdersQuery,
} = printOrdersApi;