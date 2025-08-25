// src/types.ts or src/types/ActivityItem.ts
export interface ActivityItem {
  id: number;
  type: 'booking' | 'message' | 'review';
  title: string;
  description: string;
  time: string;
}
