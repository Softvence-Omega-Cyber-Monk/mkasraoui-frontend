import { AlertTriangle, Calendar, Download, Share2 } from 'lucide-react';
import { useState } from 'react';

function ChecklistContent() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Book party venue', category: 'Venue', priority: 'high', daysAhead: 30, completed: true },
    { id: 2, title: 'Send invitations', category: 'Invitations', priority: 'high', daysAhead: 21, completed: true },
    { id: 3, title: 'Order birthday cake', category: 'Food', priority: 'high', daysAhead: 7, completed: false },
    { id: 4, title: 'Buy decorations', category: 'Decorations', priority: 'medium', daysAhead: 7, completed: false },
    { id: 5, title: 'Prepare party favors', category: 'Activities', priority: 'medium', daysAhead: 3, completed: false },
    { id: 6, title: 'Set up playlist', category: 'Entertainment', priority: 'low', daysAhead: 3, completed: false },
    { id: 7, title: 'Buy drinks and snacks', category: 'Food', priority: 'high', daysAhead: 2, completed: false },
    { id: 8, title: 'Confirm guest count', category: 'Planning', priority: 'medium', daysAhead: 2, completed: false },
    { id: 9, title: 'Prepare camera/photo setup', category: 'Entertainment', priority: 'low', daysAhead: 1, completed: false },
    { id: 10, title: 'Set up decorations', category: 'Decorations', priority: 'high', daysAhead: 0, completed: false }
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Venue': 'bg-purple-100 text-purple-800 border-purple-200',
      'Invitations': 'bg-green-100 text-green-800 border-green-200',
      'Food': 'bg-orange-100 text-orange-800 border-orange-200',
      'Decorations': 'bg-pink-100 text-pink-800 border-pink-200',
      'Activities': 'bg-teal-100 text-teal-800 border-teal-200',
      'Entertainment': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Planning': 'bg-cyan-100 text-cyan-800 border-cyan-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDaysText = (days) => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 days ahead';
    return `${days} days ahead`;
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const urgentTasks = tasks.filter(t => !t.completed && t.daysAhead <= 2);

  const isUrgent = (task) => !task.completed && task.daysAhead <= 2;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">




        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tasks Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Tasks</h2>
              
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      task.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <h3 className={`font-medium mb-2 ${
                          task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getCategoryColor(task.category)}`}>
                            {task.category}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getDaysText(task.daysAhead)}
                          </span>
                        </div>
                      </div>
                      
                      {isUrgent(task) && (
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Urgent Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Urgent Tasks</h3>
              <ul className="space-y-2">
                {urgentTasks.map((task) => (
                  <li key={task.id} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    {task.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Sync to Calendar
                </button>
                <button className="w-full bg-white text-gray-600 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="w-full bg-white text-gray-600 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Checklist
                </button>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${progressPercentage * 2.51} 251`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{progressPercentage}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {completedCount} of {totalCount} tasks complete
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChecklistContent;