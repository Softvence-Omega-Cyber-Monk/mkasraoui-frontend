import { useState } from "react";
import { useGetBookingsQuery,useCancelBookingMutation, useUpdateStatusMutation } from "@/redux/features/booking/booking.api";
import type { Booking } from "@/redux/types/booking.type";
import toast from "react-hot-toast";

interface BookingPageProps {
  role: "PROVIDER" | "USER" | "ADMIN" ; // passed from auth/user store
}

function BookingPage({ role }: BookingPageProps) {
  const [currentView, setCurrentView] = useState<"Monthly" | "Weekly">("Monthly");

  const { data: bookings = [], isLoading, isError } = useGetBookingsQuery({ role });

  const [updateStatus] = useUpdateStatusMutation();
  const [cancelBooking] = useCancelBookingMutation();

  const currentTitle =
    currentView === "Monthly" ? "October 2024" : "This Week - Oct 21-27, 2024";

  const handleAction = async (id: string, action: "BOOKED" | "CANCELLED") => {
    try {
      if (role === "PROVIDER") {
        await updateStatus({ id, status: action }).unwrap();
      } else {
        await cancelBooking({ id }).unwrap();
      }
      toast.success(`Booking ${action.toLowerCase()} successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update booking status");
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex w-full rounded-xl bg-[#F0F2F5] p-1 shadow-sm">
            <button
              onClick={() => setCurrentView("Monthly")}
              className={`flex-1 cursor-pointer rounded-xl py-3 text-sm font-medium transition-colors ${
                currentView === "Monthly"
                  ? "bg-[#FFFFFF] text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCurrentView("Weekly")}
              className={`flex-1 cursor-pointer rounded-xl py-3 text-sm font-medium transition-colors ${
                currentView === "Weekly"
                  ? "bg-[#FFFFFF] text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">{currentTitle}</h2>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
          <div className="w-full overflow-x-auto">
            {isLoading && <p className="p-6 text-gray-600">Loading bookings...</p>}
            {isError && (
              <p className="p-6 text-red-500">Failed to load bookings. Try again.</p>
            )}
            {!isLoading && !isError && (
              <table className="w-full min-w-[700px]">
                <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 md:text-sm">
                      Client Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 md:text-sm">
                      Party Theme
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 md:text-sm">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 md:text-sm">
                      Guests
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 md:text-sm">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 md:text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking: Booking) => (
                    <tr
                      key={booking.id}
                      className="border-b-2 border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-xs font-medium whitespace-nowrap text-gray-900 md:text-sm">
                        {booking.name}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 md:text-sm">
                        {booking.partyTheme}
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap text-gray-600 md:text-sm">
                        {new Date(booking.date).toLocaleDateString()}{" "}
                        {new Date(booking.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 md:text-sm">
                        {booking.numberOfGuest}
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm">
                        <span
                          className={`inline-flex w-24 items-center justify-center rounded-xl px-6 py-1.5 font-medium ${
                            booking.status === "BOOKED"
                              ? "bg-[#B8FFC078] text-[#208D05]"
                              : booking.status === "CANCELLED"
                              ? "bg-red-200 text-red-700"
                              : "bg-[#FFD54F] text-white"
                          } text-xs md:text-sm`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm space-x-2">
                        {role === "PROVIDER" ? (
                          <>
                            <button
                              onClick={() => handleAction(booking.id, "BOOKED")}
                              className="cursor-pointer font-medium text-green-600 hover:text-green-800"
                            >
                              Book
                            </button>
                            <button
                              onClick={() => handleAction(booking.id, "CANCELLED")}
                              className="cursor-pointer font-medium text-red-600 hover:text-red-800"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleAction(booking.id, "CANCELLED")}
                            className="cursor-pointer font-medium text-red-600 hover:text-red-800"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
