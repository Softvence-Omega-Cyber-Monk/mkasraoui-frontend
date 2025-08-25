import { Calendar, FileText, MessageSquare, Star } from 'lucide-react';
import React from 'react';


import type { ActivityItem } from './types/ActivityItem';

const ActivityItemComponent: React.FC<{ item: ActivityItem }> = ({ item }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5 text-secondary" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-secondary" />;
      case 'review':
        return <Star className="h-5 w-5 text-secondary" />;
      default:
        return <FileText className="h-5 w-5 text-secondary" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className="bg-blue-50 rounded-full p-2">
        {getIcon(item.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{item.title}</p>
        <p className="text-sm text-gray-500">{item.description}</p>
      </div>
      <div className="text-xs text-gray-400 whitespace-nowrap">{item.time}</div>
    </div>
  );
};

export default ActivityItemComponent;
