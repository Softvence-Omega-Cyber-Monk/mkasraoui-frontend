import {
  AlertCircle,
  Calendar,
  ChevronDown,
  Download,
  Share2,
  Trash,
} from "lucide-react";
import React, { useState } from "react";

// Define types for the data structures
interface Task {
  id: number;
  title: string;
  category: string;
  priority: string;
  daysAhead: number;
  completed: boolean;
}

interface Priority {
  value: string;
  label: string;
  color: string;
}

interface NewTask {
  title: string;
  category: string;
  priority: string;
  daysAhead: string;
}

// Mock data for tasks
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Book party venue",
    category: "Venue",
    priority: "high",
    daysAhead: 30,
    completed: true,
  },
  {
    id: 2,
    title: "Send invitations",
    category: "Invitations",
    priority: "high",
    daysAhead: 21,
    completed: true,
  },
  {
    id: 3,
    title: "Order birthday cake",
    category: "Food",
    priority: "high",
    daysAhead: 7,
    completed: false,
  },
  {
    id: 4,
    title: "Buy decorations",
    category: "Decorations",
    priority: "medium",
    daysAhead: 7,
    completed: false,
  },
  {
    id: 5,
    title: "Prepare party favors",
    category: "Activities",
    priority: "medium",
    daysAhead: 3,
    completed: false,
  },
  {
    id: 6,
    title: "Set up playlist",
    category: "Entertainment",
    priority: "low",
    daysAhead: 3,
    completed: false,
  },
  {
    id: 7,
    title: "Buy drinks and snacks",
    category: "Food",
    priority: "high",
    daysAhead: 2,
    completed: false,
  },
  {
    id: 8,
    title: "Confirm guest count",
    category: "Planning",
    priority: "medium",
    daysAhead: 2,
    completed: false,
  },
  {
    id: 9,
    title: "Prepare camera/photo setup",
    category: "Entertainment",
    priority: "low",
    daysAhead: 1,
    completed: false,
  },
  {
    id: 10,
    title: "Set up decorations",
    category: "Decorations",
    priority: "high",
    daysAhead: 0,
    completed: false,
  },
];

const categories: string[] = [
  "Planning",
  "Venue",
  "Invitations",
  "Food",
  "Decorations",
  "Activities",
  "Entertainment",
];

const priorities: Priority[] = [
  { value: "high", label: "High", color: "bg-red-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "low", label: "Low", color: "bg-blue-400" },
];

const daysAheadOptions: string[] = [
  "Today",
  "1 day",
  "2 days",
  "3 days",
  "1 week",
  "2 weeks",
  "3 weeks",
];

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const priorityConfig = priorities.find((p) => p.value === priority);
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-medium text-white sm:px-3 ${priorityConfig?.color}`}
    >
      {priorityConfig?.label}
    </span>
  );
};

// Task Item Component
const TaskItem = ({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: number) => void;
}) => {
  const isUrgent = task.daysAhead <= 2 && !task.completed;

  const formatDaysAhead = (days: number) => {
    if (days === 0) return "Today";
    if (days === 1) return "1 day ahead";
    return `${days} days ahead`;
  };

  return (
    <div
      className={`mb-3 rounded-lg border p-3 sm:p-4 ${
        task.completed
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white"
      } ${task.completed ? "opacity-75" : ""}`}
    >
      <div className="flex items-center gap-3">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="peer sr-only"
          />
          <div
            className={`h-5 w-5 rounded-sm border-2 ${task.completed ? "border-green-500 bg-green-500" : "border-gray-300"} flex items-center justify-center transition duration-200 peer-checked:border-green-500 peer-checked:bg-green-500`}
          >
            {task.completed && (
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </label>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start gap-2 sm:gap-3">
            <h3
              className={`flex-1 font-medium ${task.completed ? "text-gray-500 line-through" : "text-gray-900"}`}
            >
              {task.title}
            </h3>
            {isUrgent && (
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-md border border-[#ADADAD] px-2 py-0.5 text-xs text-[#ADADAD]">
                {task.category}
              </span>
              <PriorityBadge priority={task.priority} />
            </div>
            <span className="text-xs text-gray-600 sm:text-sm">
              {formatDaysAhead(task.daysAhead)}
            </span>
          </div>
        </div>
        <div>
          <button className="cursor-pointer">
            <Trash color="#FC6168" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Dropdown Component
const Dropdown = ({
  value,
  options,
  onChange,
  placeholder,
  renderOption,
}: {
  value: string;
  options: string[];
  onChange: (option: string) => void;
  placeholder: string;
  renderOption?: (option: string) => React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:px-4 sm:py-3"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none sm:px-4"
              >
                {renderOption ? renderOption(option) : option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Add Task Form Component
const AddTaskForm = ({ onAdd }: { onAdd: (task: Task) => void }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    category: "Planning",
    priority: "medium",
    daysAhead: "1 week",
  });

  const handleSubmit = () => {
    if (newTask.title.trim()) {
      const daysMap: { [key: string]: number } = {
        Today: 0,
        "1 day": 1,
        "2 days": 2,
        "3 days": 3,
        "1 week": 7,
        "2 weeks": 14,
        "3 weeks": 21,
      };

      onAdd({
        ...newTask,
        daysAhead: daysMap[newTask.daysAhead] || 7,
        completed: false,
        id: Date.now(),
      });

      setNewTask({
        title: "",
        category: "Planning",
        priority: "medium",
        daysAhead: "1 week",
      });
      setShowForm(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="mb-4 sm:mb-6">
      <div className="rounded-md border border-gray-300 bg-white">
        <div className="flex gap-2 overflow-hidden p-3 sm:gap-4 sm:p-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className="flex-1 rounded-md border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:p-4 sm:text-base"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="cursor-pointer rounded-md border border-gray-300 px-3 py-3 transition-colors hover:bg-gray-100 focus:ring-0 focus:outline-none sm:px-4 sm:py-4"
          >
            <ChevronDown
              className={`h-4 w-4 text-gray-600 transition-transform sm:h-5 sm:w-5 ${showForm ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>
              <Dropdown
                value={newTask.category}
                options={categories}
                onChange={(category) => setNewTask({ ...newTask, category })}
                placeholder="Select category"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Priority
              </label>
              <Dropdown
                value={newTask.priority}
                options={priorities.map((p) => p.value)}
                onChange={(priority) => setNewTask({ ...newTask, priority })}
                placeholder="Select priority"
                renderOption={(option) => {
                  const config = priorities.find((p) => p.value === option);
                  return (
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${config?.color}`}
                      ></div>
                      {config?.label}
                    </div>
                  );
                }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Days Ahead
              </label>
              <Dropdown
                value={newTask.daysAhead}
                options={daysAheadOptions}
                onChange={(daysAhead) => setNewTask({ ...newTask, daysAhead })}
                placeholder="Select timeframe"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 focus:ring-0 focus:outline-none sm:px-6"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="cursor-pointer rounded-lg bg-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-400 focus:ring-0 focus:outline-none sm:px-6"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
function ChecklistContent() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleToggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const urgentTasks = tasks.filter(
    (task) => task.daysAhead <= 2 && !task.completed,
  );
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="order-2 lg:order-1 lg:col-span-2">
            <AddTaskForm onAdd={handleAddTask} />

            <div className="rounded-lg border border-gray-300 bg-white p-3 sm:p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
                All Tasks
              </h2>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 space-y-4 sm:space-y-6 lg:order-2">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 sm:p-6">
              <h3 className="mb-3 text-base font-bold text-red-800 sm:mb-4 sm:text-lg">
                Urgent Tasks
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {urgentTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center text-sm text-red-700"
                  >
                    <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                    <span className="break-words">{task.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-gray-300 bg-white p-4 sm:p-6">
              <h3 className="mb-3 text-base font-bold text-gray-900 sm:mb-4 sm:text-lg">
                Quick Actions
              </h3>

              <div className="space-y-2 sm:space-y-3">
                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm text-white hover:bg-blue-700 focus:ring-0 focus:outline-none sm:py-3">
                  <Calendar className="h-4 w-4" />
                  Sync to Calendar
                </button>

                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none sm:py-3">
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>

                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:outline-none sm:py-3">
                  <Share2 className="h-4 w-4" />
                  Share Checklist
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-300 bg-white p-4 sm:p-6">
              <div className="text-center">
                <div className="relative inline-flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                  <svg
                    className="h-20 w-20 -rotate-90 transform sm:h-24 sm:w-24"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${completionPercentage * 2.51} 251`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900 sm:text-2xl">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-600 sm:mt-4">
                  {completedCount} of {totalTasks} tasks complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChecklistContent;
