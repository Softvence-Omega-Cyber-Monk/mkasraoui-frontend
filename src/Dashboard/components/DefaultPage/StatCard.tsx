import { TrendingUp } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  period: string;
  icon: React.ReactNode;
  format?: 'number' | 'currency';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  period,
  icon,
  format = 'number',
}) => {
  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return `$${val.toLocaleString()}`;
    }
    return val.toString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-gray-900">{formatValue(value)}</p>
          <div className="text-gray-400">{icon}</div>
        </div>
        <div className="flex items-center text-sm">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">+{change}%</span>
          <span className="text-gray-500 ml-1">from {period}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
