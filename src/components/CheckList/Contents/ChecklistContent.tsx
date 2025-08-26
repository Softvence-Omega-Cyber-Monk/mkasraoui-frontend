import { AlertCircle, Calendar, ChevronDown, Download, Share2 } from 'lucide-react';
import { useState } from 'react';

// Mock data for tasks
const initialTasks = [
  {
    id: 1,
    title: 'Book party venue',
    category: 'Venue',
    priority: 'high',
    daysAhead: 30,
    completed: true
  },
  {
    id: 2,
    title: 'Send invitations',
    category: 'Invitations',
    priority: 'high',
    daysAhead: 21,
    completed: true
  },
  {
    id: 3,
    title: 'Order birthday cake',
    category: 'Food',
    priority: 'high',
    daysAhead: 7,
    completed: false
  },
  {
    id: 4,
    title: 'Buy decorations',
    category: 'Decorations',
    priority: 'medium',
    daysAhead: 7,
    completed: false
  },
  {
    id: 5,
    title: 'Prepare party favors',
    category: 'Activities',
    priority: 'medium',
    daysAhead: 3,
    completed: false
  },
  {
    id: 6,
    title: 'Set up playlist',
    category: 'Entertainment',
    priority: 'low',
    daysAhead: 3,
    completed: false
  },
  {
    id: 7,
    title: 'Buy drinks and snacks',
    category: 'Food',
    priority: 'high',
    daysAhead: 2,
    completed: false
  },
  {
    id: 8,
    title: 'Confirm guest count',
    category: 'Planning',
    priority: 'medium',
    daysAhead: 2,
    completed: false
  },
  {
    id: 9,
    title: 'Prepare camera/photo setup',
    category: 'Entertainment',
    priority: 'low',
    daysAhead: 1,
    completed: false
  },
  {
    id: 10,
    title: 'Set up decorations',
    category: 'Decorations',
    priority: 'high',
    daysAhead: 0,
    completed: false
  }
];

const categories = [
  'Planning', 'Venue', 'Invitations', 'Food', 'Decorations', 'Activities', 'Entertainment'
];

const priorities = [
  { value: 'high', label: 'High', color: 'bg-red-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'low', label: 'Low', color: 'bg-blue-400' }
];

const daysAheadOptions = [
  'Today', '1 day', '2 days', '3 days', '1 week', '2 weeks', '3 weeks'
];

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const priorityConfig = priorities.find(p => p.value === priority);
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${priorityConfig?.color}`}>
      {priorityConfig?.label}
    </span>
  );
};

// Task Item Component
const TaskItem = ({ task, onToggle }) => {
  const isUrgent = task.daysAhead <= 2 && !task.completed;
  
  const formatDaysAhead = (days) => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ahead';
    return `${days} days ahead`;
  };

  return (
    <div className={`p-4 rounded-lg border mb-3 ${
      task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
    } ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {isUrgent && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded border">
              {task.category}
            </span>
            <PriorityBadge priority={task.priority} />
            <span className="text-gray-600">
              {formatDaysAhead(task.daysAhead)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dropdown Component
const Dropdown = ({ value, options, onChange, placeholder, renderOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
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
const AddTaskForm = ({ onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Planning',
    priority: 'medium',
    daysAhead: '1 week'
  });

  const handleSubmit = () => {
    if (newTask.title.trim()) {
      const daysMap = {
        'Today': 0, '1 day': 1, '2 days': 2, '3 days': 3,
        '1 week': 7, '2 weeks': 14, '3 weeks': 21
      };
      
      onAdd({
        ...newTask,
        daysAhead: daysMap[newTask.daysAhead] || 7,
        completed: false,
        id: Date.now()
      });
      
      setNewTask({ title: '', category: 'Planning', priority: 'medium', daysAhead: '1 week' });
      setShowForm(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="mb-6">
      {/* Task Input with Dropdown Trigger */}
      <div className="flex gap-4  overflow-hidden">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="p-4 flex-1/2 text-gray-900 placeholder-gray-500 border-1 focus:outline-none focus:ring-0"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-4 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-0 transition-colors"
        >
          <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showForm ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded Form */}
      {showForm && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Dropdown
                value={newTask.category}
                options={categories}
                onChange={(category) => setNewTask({ ...newTask, category })}
                placeholder="Select category"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <Dropdown
                value={newTask.priority}
                options={priorities.map(p => p.value)}
                onChange={(priority) => setNewTask({ ...newTask, priority })}
                placeholder="Select priority"
                renderOption={(option) => {
                  const config = priorities.find(p => p.value === option);
                  return (
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${config?.color}`}></div>
                      {config?.label}
                    </div>
                  );
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Days Ahead</label>
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
  const [tasks, setTasks] = useState(initialTasks);

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const urgentTasks = tasks.filter(task => task.daysAhead <= 2 && !task.completed);
  const completedCount = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tasks Section */}
          <div className="lg:col-span-2">
            <AddTaskForm onAdd={handleAddTask} />
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Tasks</h2>
              
              <div className="space-y-2">
                {tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Urgent Tasks */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-800 mb-4">Urgent Tasks</h3>
              <ul className="space-y-3">
                {urgentTasks.map(task => (
                  <li key={task.id} className="flex items-center text-red-700">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    {task.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Sync to Calendar
                </button>
                
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Checklist
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
                    <span className="text-2xl font-bold text-gray-900">{completionPercentage}%</span>
                  </div>
                </div>
                
                <p className="mt-4 text-gray-600">
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