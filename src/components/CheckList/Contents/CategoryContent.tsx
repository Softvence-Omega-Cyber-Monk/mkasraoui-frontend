import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { useGetTasksByCategoryQuery, useUpdateTaskMutation } from "@/redux/features/tasks/tasksApi";

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

interface Section {
  title: string;
  tasks: Task[];
}

function CategoryContent() {
  // Redux hooks
  const { data: categoriesResponse, isLoading, isError, refetch } = useGetTasksByCategoryQuery();
  const [updateTask] = useUpdateTaskMutation();

  // Transform API response to sections array
  const sections: Section[] = useMemo(() => {
    if (!categoriesResponse?.data) return [];

    const categoryData = categoriesResponse.data;
    
    // Define the order of categories
    const categoryOrder = [
      "PLANNING",
      "VENUE",
      "INVITATIONS",
      "FOOD",
      "DECORATIONS",
      "ACTIVITIES",
      "ENTERTAINMENT",
    ];

    return categoryOrder
      .map(category => ({
        title: category,
        tasks: categoryData[category] || []
      }))
      .filter(section => section.tasks.length > 0); // Only show categories with tasks
  }, [categoriesResponse]);

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      await updateTask({
        id: taskId,
        body: { isComplete: !currentStatus },
      }).unwrap();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const getCompletedCount = (tasks: Task[]) => {
    return tasks.filter((task) => task.isComplete).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-gray-900 font-medium">Failed to load categories</p>
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

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No tasks yet. Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="mx-auto container px-4 py-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => {
              const completedCount = getCompletedCount(section.tasks);
              const totalCount = section.tasks.length;

              return (
                <div
                  key={section.title}
                  className="rounded-lg border border-gray-300 bg-white p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h2>
                    <span className="rounded-xl bg-[#F3F4F6] px-2 py-1 text-sm text-gray-500">
                      {completedCount}/{totalCount}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {section.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTask(task.id, task.isComplete)}
                          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 text-xs font-bold ${
                            task.isComplete
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {task.isComplete && "✓"}
                        </button>
                        <span
                          className={`text-sm ${task.isComplete ? "text-gray-400 line-through" : "text-gray-700"}`}
                        >
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryContent;