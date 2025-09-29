import { Check, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useGetTasksTimelineQuery, useUpdateTaskMutation } from '@/redux/features/tasks/tasksApi';

// Define types for the data structure
interface Task {
  id: string;
  name: string;
  isComplete: boolean;
  category: string;
  priority: string;
  dueDate: string;
  daysAhead: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface TimelineSection {
  id: string;
  title: string;
  color: string;
  backgroundColor: string;
  items: Task[];
}

function TimelineContent() {
  // Redux hooks
  const { data: timelineResponse, isLoading, isError, refetch } = useGetTasksTimelineQuery();
  const [updateTask] = useUpdateTaskMutation();

  // Transform API response to timeline sections
  const timelineSections: TimelineSection[] = useMemo(() => {
    if (!timelineResponse?.data) return [];

    const { today, next2Days, thisWeek, later } = timelineResponse.data;

    return [
      {
        id: 'today',
        title: 'Today',
        color: 'text-red-500',
        backgroundColor: 'bg-red-50',
        items: today || []
      },
      {
        id: 'next-2-days',
        title: 'Next 2 Days',
        color: 'text-orange-500',
        backgroundColor: 'bg-orange-50',
        items: next2Days || []
      },
      {
        id: 'this-week',
        title: 'This Week',
        color: 'text-orange-500',
        backgroundColor: 'bg-yellow-50',
        items: thisWeek || []
      },
      {
        id: 'later',
        title: 'Later',
        color: 'text-green-600',
        backgroundColor: 'bg-green-50',
        items: later || []
      }
    ];
  }, [timelineResponse]);

  const handleTaskToggle = async (taskId: string, currentStatus: boolean) => {
    try {
      await updateTask({
        id: taskId,
        body: { isComplete: !currentStatus },
      }).unwrap();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const renderCheckbox = (task: Task) => {
    const isCompleted = task.isComplete;

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
        onClick={() => handleTaskToggle(task.id, task.isComplete)}
      >
        {isCompleted && (
          <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
        )}
      </div>
    );
  };

  const formatDays = (daysAhead: number) => {
    if (daysAhead === 0) return null;
    if (daysAhead === 1) return '1 day';
    return `${daysAhead} days`;
  };

  const renderTimelineItem = (task: Task) => (
    <div
      key={task.id}
      className={`
        p-4 rounded-lg mb-3 flex items-center gap-3
        transition-all duration-200
        ${task.isComplete
          ? 'bg-green-100 opacity-75'
          : 'bg-gray-50 hover:bg-gray-100'
        }
      `}
    >
      {renderCheckbox(task)}

      <div className="flex-1 flex items-center justify-between">
        <span
          className={`
            text-gray-900 font-medium
            ${task.isComplete ? 'line-through text-gray-500' : ''}
          `}
        >
          {task.name}
        </span>

        {formatDays(task.daysAhead) && (
          <span className="text-sm text-gray-500 font-medium ml-4">
            {formatDays(task.daysAhead)}
          </span>
        )}
      </div>
    </div>
  );

  const renderTimelineSection = (section: TimelineSection) => {
    // Don't render section if it has no items
    if (section.items.length === 0) return null;

    return (
      <div key={section.id} className="mb-8">
        <h2 className={`text-xl font-bold mb-4 ${section.color}`}>
          {section.title}
        </h2>

        <div className={`${section.backgroundColor} p-4 rounded-xl`}>
          {section.items.map(task => renderTimelineItem(task))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-gray-900 font-medium">Failed to load timeline</p>
          <button
            onClick={() => refetch()}
            className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if there are any tasks at all
  const hasAnyTasks = timelineSections.some(section => section.items.length > 0);

  if (!hasAnyTasks) {
    return (
      <div className="container mx-auto px-4 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No tasks yet. Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 bg-white py-6">
      <div className="space-y-6">
        {timelineSections.map(renderTimelineSection)}
      </div>
    </div>
  );
}

export default TimelineContent;