import React from "react";
import type { ActivityItem } from "../components/DefaultPage/types/ActivityItem";
import ActivityItemComponent from "../components/DefaultPage/ActivityItem";
import ProviderCard from "@/components/Provider/ProviderCard";
import { useGetMeQuery } from "@/redux/features/user/userApi";

// Mock data
const mockData = {
  stats: {
    totalBookings: { value: 47, change: 12, period: "last month" },
    monthlyEarnings: { value: 12450, change: 18, period: "last month" },
    averageRating: { value: 47, change: 12, period: "last month" },
    newInquiries: { value: 47, change: 12, period: "last month" },
  },
  earningsData: [
    { month: "Jan", earnings: 5000 },
    { month: "Feb", earnings: 8500 },
    { month: "Mar", earnings: 12000 },
    { month: "Apr", earnings: 15500 },
    { month: "May", earnings: 13000 },
    { month: "June", earnings: 17500 },
  ],
  bookingsData: [
    { month: "April", bookings: 22, change: 5 },
    { month: "May", bookings: 24, change: 8 },
    { month: "June", bookings: 28, change: 15 },
  ],
  recentActivity: [
    {
      id: 1,
      type: "booking",
      title: "New Booking Request",
      description: "Emma Wilson requested a wedding photography session",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      description: "Michael Brown sent you a message about pricing",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "review",
      title: "New Review",
      description: "Sophie Taylor left a 5-star review",
      time: "6 hours ago",
    },
  ] as ActivityItem[],
};
const DefaultPage: React.FC = () => {
  const { data: me } = useGetMeQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {me?.name}
          </h1>
          <p className="mt-1 text-gray-600">
            Here's what's happening with your business today.
          </p>
        </div>

        <div>
          <ProviderCard />
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <EarningsChart data={mockData.earningsData} />
          </div>
          <div>
            <BookingsOverview data={mockData.bookingsData} />
          </div>
        </div> */}

        {/* <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <ActionButton
            icon={<Plus className="h-5 w-5" />}
            label="Add New Service"
          />
          <ActionButton
            icon={<Calendar className="h-5 w-5" />}
            label="View Upcoming Bookings"
          />
          <ActionButton
            icon={<MessageSquare className="h-5 w-5" />}
            label="Respond to Messages"
          />
        </div> */}

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <button className="text-secondary hover:text-secondary/80 cursor-pointer text-sm font-medium">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {mockData.recentActivity.map((item) => (
              <ActivityItemComponent key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultPage;
