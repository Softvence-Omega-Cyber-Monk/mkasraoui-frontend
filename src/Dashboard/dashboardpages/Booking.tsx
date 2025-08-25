import { useState } from "react";

function Booking() {
  const [currentView, setCurrentView] = useState<"Monthly" | "Weekly">(
    "Monthly",
  );

  const monthlyBookings = [
    {
      clientName: "Sophia Clark",
      eventType: "Photography Session",
      dateTime: "Oct 1, 2024, 10:00 AM",
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    },
    {
      clientName: "Ethan Carter",
      eventType: "Consultation",
      dateTime: "Oct 5, 2024, 2:00 PM",
      paymentStatus: "Pending",
      bookingStatus: "Pending",
    },
    {
      clientName: "Olivia Bennett",
      eventType: "Workshop",
      dateTime: "Oct 12, 2024, 11:00 AM",
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    },
    {
      clientName: "Liam Foster",
      eventType: "Photography Session",
      dateTime: "Oct 15, 2024, 3:00 PM",
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    },
    {
      clientName: "Ava Harper",
      eventType: "Consultation",
      dateTime: "Oct 20, 2024, 9:00 AM",
      paymentStatus: "Pending",
      bookingStatus: "Pending",
    },
  ];

  const weeklyBookings = [
    {
      clientName: "Emma Wilson",
      eventType: "Photography Session",
      dateTime: "This Week, Mon 2:00 PM",
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    },
    {
      clientName: "James Rodriguez",
      eventType: "Consultation",
      dateTime: "This Week, Wed 10:00 AM",
      paymentStatus: "Pending",
      bookingStatus: "Pending",
    },
    {
      clientName: "Sarah Johnson",
      eventType: "Workshop",
      dateTime: "This Week, Fri 3:00 PM",
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    },
    {
      clientName: "Michael Brown",
      eventType: "Photography Session",
      dateTime: "Next Week, Tue 11:00 AM",
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    },
  ];

  const currentBookings =
    currentView === "Monthly" ? monthlyBookings : weeklyBookings;
  const currentTitle =
    currentView === "Monthly" ? "October 2024" : "This Week - Oct 21-27, 2024";

  return (
    <div>
      <div className="bg-gray-50">
        <div className="mx-auto w-full">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <button className="cursor-pointer rounded-xl bg-[#F0F2F5] px-6 py-2 font-medium text-black transition-colors hover:bg-gray-800 hover:text-white">
              New Booking
            </button>
          </div>

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

          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            {currentTitle}
          </h2>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-[#DBE0E5] bg-white">
            {/* Make table scrollable on small screens */}
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="border-b-2 border-[#DBE0E5] bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 md:text-sm">
                      Client Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 md:text-sm">
                      Event Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 md:text-sm">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium whitespace-nowrap text-gray-700 md:text-sm">
                      Payment Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 md:text-sm">
                      Booking Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 md:text-sm">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((booking, index) => (
                    <tr
                      key={index}
                      className="border-b-2 border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-xs font-medium whitespace-nowrap text-gray-900 md:text-sm">
                        {booking.clientName}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 md:text-sm">
                        {booking.eventType}
                      </td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap text-gray-600 md:text-sm">
                        {booking.dateTime}
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm">
                        <span
                          className={`inline-flex w-20 items-center justify-center rounded-xl px-6 py-1.5 font-medium ${
                            booking.paymentStatus === "Paid"
                              ? "bg-[#B8FFC078] text-[#208D05]"
                              : "bg-[#FFD54F] text-white"
                          } text-xs md:text-sm`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm">
                        <span
                          className={`inline-flex w-24 items-center justify-center rounded-xl px-6 py-1.5 font-medium ${
                            booking.bookingStatus === "Confirmed"
                              ? "bg-[#B8FFC078] text-[#208D05]"
                              : "bg-[#FFD54F] text-white"
                          } text-xs md:text-sm`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs md:text-sm">
                        <button className="cursor-pointer font-medium text-[#61758A] hover:text-gray-900">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
