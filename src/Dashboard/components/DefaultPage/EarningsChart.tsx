import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';

interface EarningsData {
  month: string;
  earnings: number;
}

const EarningsChart: React.FC<{ data: EarningsData[] }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
        <select className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white">
          <option>Last 6 Months</option>
        </select>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              tickFormatter={(value: number) => `$${(value / 1000)}k`} 
            />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorEarnings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsChart;
