import { Check } from 'lucide-react';
import { useState } from 'react';

// Define types for the data structure
interface TimelineItem {
  id: number;
  text: string;
  completed: boolean;
  days: string | null;
}

interface TimelineSection {
  id: string;
  title: string;
  color: string;
  backgroundColor: string;
  items: TimelineItem[];
}

const TIMELINE_DATA: TimelineSection[] = [
  {
    id: 'today',
    title: 'Today',
    color: 'text-red-500',
    backgroundColor: 'bg-red-50',
    items: [
      { id: 1, text: 'Set up decorations', completed: false, days: null }
    ]
  },
  {
    id: 'next-2-days',
    title: 'Next 2 Days',
    color: 'text-orange-500',
    backgroundColor: 'bg-orange-50',
    items: [
      { id: 2, text: 'Buy drinks and snacks', completed: false, days: '2 days' },
      { id: 3, text: 'Confirm guest count', completed: false, days: '2 days' },
      { id: 4, text: 'Prepare camera/photo setup', completed: false, days: '1 days' }
    ]
  },
  {
    id: 'this-week',
    title: 'This Week',
    color: 'text-orange-500',
    backgroundColor: 'bg-yellow-50',
    items: [
      { id: 5, text: 'Order birthday cake', completed: false, days: '7 days' },
      { id: 6, text: 'Buy decorations', completed: false, days: '7 days' },
      { id: 7, text: 'Prepare party favors', completed: false, days: '3 days' },
      { id: 8, text: 'Set up playlist', completed: false, days: '3 days' }
    ]
  },
  {
    id: 'later',
    title: 'Later',
    color: 'text-green-600',
    backgroundColor: 'bg-green-50',
    items: [
      { id: 9, text: 'Book party venue', completed: true, days: '30 days' },
      { id: 10, text: 'Send invitations', completed: true, days: '21 days' }
    ]
  }
];

function TimelineContent() {
  const [tasks, setTasks] = useState<TimelineSection[]>(TIMELINE_DATA);

  const handleTaskToggle = (sectionId: string, taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(section => ({
        ...section,
        items: section.id === sectionId
          ? section.items.map(item =>
              item.id === taskId
                ? { ...item, completed: !item.completed }
                : item
            )
          : section.items
      }))
    );
  };

  const renderCheckbox = (item: TimelineItem, sectionId: string) => {
    const isCompleted = item.completed;

    return (
      <div
        className={`
          w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center
          transition-all duration-200 flex-shrink-0
          ${isCompleted
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onClick={() => handleTaskToggle(sectionId, item.id)}
      >
        {isCompleted && (
          <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
        )}
      </div>
    );
  };

  const renderTimelineItem = (item: TimelineItem, sectionId: string) => (
    <div
      key={item.id}
      className={`
        p-4 rounded-lg mb-3 flex items-center gap-3
        transition-all duration-200
        ${item.completed
          ? 'bg-green-100 opacity-75'
          : 'bg-gray-50 hover:bg-gray-100'
        }
      `}
    >
      {renderCheckbox(item, sectionId)}

      <div className="flex-1 flex items-center justify-between">
        <span
          className={`
            text-gray-900 font-medium
            ${item.completed ? 'line-through text-gray-500' : ''}
          `}
        >
          {item.text}
        </span>

        {item.days && (
          <span className="text-sm text-gray-500 font-medium ml-4">
            {item.days}
          </span>
        )}
      </div>
    </div>
  );

  const renderTimelineSection = (section: TimelineSection) => (
    <div key={section.id} className="mb-8">
      <h2 className={`text-xl font-bold mb-4 ${section.color}`}>
        {section.title}
      </h2>

      <div className={`${section.backgroundColor} p-4 rounded-xl`}>
        {section.items.map(item => renderTimelineItem(item, section.id))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 bg-white">
      <div className="space-y-6">
        {tasks.map(renderTimelineSection)}
      </div>
    </div>
  );
}

export default TimelineContent;