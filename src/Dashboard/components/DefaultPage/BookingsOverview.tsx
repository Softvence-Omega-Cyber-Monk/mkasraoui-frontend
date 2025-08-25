import React from 'react';

interface BookingData {
  month: string;
  bookings: number;
  change: number;
}

const BookingsOverview: React.FC<{ data: BookingData[] }> = ({ data }) => {
  return (
    <div className="bg-white h-full rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Bookings Overview</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-600">{item.month}</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{item.bookings} bookings</span>
              <span className="text-green-600 text-sm font-medium">+{item.change}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsOverview;
