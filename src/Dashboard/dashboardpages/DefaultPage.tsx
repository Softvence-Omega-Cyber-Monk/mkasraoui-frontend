
import {
  Calendar,
  CreditCard,
  FileText,
  MessageSquare,
  Plus,
  Star
} from 'lucide-react';
import React from 'react';

import type { ActivityItem } from '../components/DefaultPage/types/ActivityItem';

import ActionButton from '../components/DefaultPage/ActionButton';
import ActivityItemComponent from '../components/DefaultPage/ActivityItem';
import BookingsOverview from '../components/DefaultPage/BookingsOverview';
import EarningsChart from '../components/DefaultPage/EarningsChart';
import StatCard from '../components/DefaultPage/StatCard';

// Mock data
const mockData = {
  stats: {
    totalBookings: { value: 47, change: 12, period: 'last month' },
    monthlyEarnings: { value: 12450, change: 18, period: 'last month' },
    averageRating: { value: 47, change: 12, period: 'last month' },
    newInquiries: { value: 47, change: 12, period: 'last month' }
  },
  earningsData: [
    { month: 'Jan', earnings: 5000 },
    { month: 'Feb', earnings: 8500 },
    { month: 'Mar', earnings: 12000 },
    { month: 'Apr', earnings: 15500 },
    { month: 'May', earnings: 13000 },
    { month: 'June', earnings: 17500 }
  ],
  bookingsData: [
    { month: 'April', bookings: 22, change: 5 },
    { month: 'May', bookings: 24, change: 8 },
    { month: 'June', bookings: 28, change: 15 }
  ],
  recentActivity: [
    {
      id: 1,
      type: 'booking',
      title: 'New Booking Request',
      description: 'Emma Wilson requested a wedding photography session',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      description: 'Michael Brown sent you a message about pricing',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'review',
      title: 'New Review',
      description: 'Sophie Taylor left a 5-star review',
      time: '6 hours ago'
    }
  ] as ActivityItem[],
};
const  DefaultPage: React.FC = () => {


  return (
     <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Sarah Miller!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your business today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={mockData.stats.totalBookings.value}
            change={mockData.stats.totalBookings.change}
            period={mockData.stats.totalBookings.period}
            icon={<Calendar className="h-7 w-7" />}
          />
          <StatCard
            title="Monthly Earnings"
            value={mockData.stats.monthlyEarnings.value}
            change={mockData.stats.monthlyEarnings.change}
            period={mockData.stats.monthlyEarnings.period}
            icon={<CreditCard className="h-7 w-7" />}
            format="currency"
          />
          <StatCard
            title="Average Rating"
            value={mockData.stats.averageRating.value}
            change={mockData.stats.averageRating.change}
            period={mockData.stats.averageRating.period}
            icon={<Star className="h-7 w-7" />}
          />
          <StatCard
            title="New Inquiries"
            value={mockData.stats.newInquiries.value}
            change={mockData.stats.newInquiries.change}
            period={mockData.stats.newInquiries.period}
            icon={<FileText className="h-7 w-7" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <EarningsChart data={mockData.earningsData} />
          </div>
          <div>
            <BookingsOverview data={mockData.bookingsData} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ActionButton icon={<Plus className="h-5 w-5" />} label="Add New Service" />
          <ActionButton icon={<Calendar className="h-5 w-5" />} label="View Upcoming Bookings" />
          <ActionButton icon={<MessageSquare className="h-5 w-5" />} label="Respond to Messages" />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-secondary text-sm font-medium hover:text-secondary/80 cursor-pointer">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {mockData.recentActivity.map((item) => (
              <ActivityItemComponent key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefaultPage