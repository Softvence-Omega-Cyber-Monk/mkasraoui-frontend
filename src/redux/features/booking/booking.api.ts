// src/redux/features/booking/bookingApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import type { Booking, BookingResponse } from "@/redux/types/booking.type";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query<Booking[], { role: "PROVIDER" | "USER" }>({
            query: () => ({
                url: "/quotes/my",
                method: "GET",
            }),
            transformResponse: (response: { data: BookingResponse }) =>
                response.data.data, // returns Booking[]
        }),
        updateStatus: builder.mutation<
            Booking,
            { id: string; status: "BOOKED" | "CANCELLED" }>({
            query: ({ id, status }) => ({
                url: `/quotes/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Bookings"],
        }),

        cancelBooking: builder.mutation<Booking, { id: string }>({
            query: ({ id }) => ({
                url: `/quotes/${id}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["Bookings"],
        }),
    }),
});

export const { useGetBookingsQuery,useUpdateStatusMutation, useCancelBookingMutation } = bookingApi;
