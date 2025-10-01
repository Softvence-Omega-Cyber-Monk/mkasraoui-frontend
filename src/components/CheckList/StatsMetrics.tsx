import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { useGetTasksQuery } from "@/redux/features/tasks/tasksApi";

export default function StatsMetrics() {
  // Redux hooks
  const { data: tasksResponse, isLoading, isError, refetch } = useGetTasksQuery();

  const tasks = tasksResponse?.data || [];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.isComplete).length;
    const urgentTasks = tasks.filter((task) => task.daysAhead <= 2 && !task.isComplete).length;
    const remainingTasks = totalTasks - completedTasks;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return [
      { number: `${completionPercentage}%`, label: "Complete" },
      { number: completedTasks.toString(), label: "Tasks Done" },
      { number: urgentTasks.toString(), label: "Urgent" },
      { number: remainingTasks.toString(), label: "Remaining" },
    ];
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading stats...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="mt-4 text-gray-900 font-medium">Failed to load stats</p>
            <button
              onClick={() => refetch()}
              className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg bg-[#E6EFFF] p-6 text-center sm:p-8 transition-transform hover:scale-105"
          >
            <div className="text-secondary font-fredoka mb-2 text-4xl font-bold sm:text-5xl">
              {stat.number}
            </div>
            <div className="text-secondary text-base font-semibold sm:text-lg">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}