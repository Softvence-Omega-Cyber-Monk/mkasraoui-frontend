import { useState } from "react";
interface Task {
  id: string;
  text: string;
  completed: boolean;
}
interface Section {
  title: string;
  tasks: Task[];
}
function CategoryContent() {
  const [sections, setSections] = useState<Section[]>([
    {
      title: "Planning",
      tasks: [
        { id: "1", text: "Confirm guest count", completed: false },
        { id: "2", text: "Prepare emergency contact list", completed: false },
        { id: "3", text: "Create party timeline schedule", completed: false },
        { id: "4", text: "Order helium balloons", completed: false },
        {
          id: "5",
          text: "Prepare thank you cards for guests",
          completed: false,
        },
      ],
    },
    {
      title: "Venue",
      tasks: [{ id: "6", text: "Book party venue", completed: true }],
    },
    {
      title: "Invitations",
      tasks: [{ id: "7", text: "Send invitations", completed: true }],
    },
    {
      title: "Food",
      tasks: [
        { id: "8", text: "Order birthday cake", completed: false },
        { id: "9", text: "Buy drinks and snacks", completed: false },
      ],
    },
    {
      title: "Decorations",
      tasks: [
        { id: "10", text: "Buy decorations", completed: false },
        { id: "11", text: "Set up decorations", completed: false },
      ],
    },
    {
      title: "Activities",
      tasks: [{ id: "12", text: "Prepare party favors", completed: false }],
    },
    {
      title: "Entertainment",
      tasks: [
        { id: "13", text: "Set up playlist", completed: false },
        { id: "14", text: "Prepare camera/photo setup", completed: false },
      ],
    },
  ]);
  const toggleTask = (sectionIndex: number, taskId: string) => {
    setSections((prev) =>
      prev.map((section, index) => {
        if (index === sectionIndex) {
          return {
            ...section,
            tasks: section.tasks.map((task) =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task,
            ),
          };
        }
        return section;
      }),
    );
  };

  const getCompletedCount = (tasks: Task[]) => {
    return tasks.filter((task) => task.completed).length;
  };

  return (
    <div>
      <div>
        <div className="mx-auto container px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section, sectionIndex) => {
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
                          onClick={() => toggleTask(sectionIndex, task.id)}
                          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 text-xs font-bold ${
                            task.completed
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {task.completed && "✓"}
                        </button>
                        <span
                          className={`text-sm ${task.completed ? "text-gray-400 line-through" : "text-gray-700"}`}
                        >
                          {task.text}
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
