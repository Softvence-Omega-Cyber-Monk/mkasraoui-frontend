import { memo } from 'react';

const TabButton = memo(({ label, isActive, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 px-6 py-3 text-sm font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-secondary/60 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isActive 
          ? 'bg-secondary text-white shadow-lg' 
          : 'bg-gray-300 text-gray-600 hover:bg-gray-400 hover:text-gray-700 cursor-pointer'
        }
        first:rounded-l-lg last:rounded-r-lg
      `}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${label.toLowerCase().replace(/\s+/g, '-')}`}
      {...props}
    >
      {label}
    </button>
  );
});

TabButton.displayName = 'TabButton';

const TABS = [
  { id: 'checklist', label: 'My Checklist' },
  { id: 'timeline', label: 'Timeline View' },
  { id: 'category', label: 'By Category' }
];

const ChecklistTabs = ({ 
  activeTab = 'checklist', 
  onTabChange, 
  className = '',
  disabled = false 
}) => {
  const handleTabClick = (tabId) => {
    if (disabled || activeTab === tabId) return;
    onTabChange?.(tabId);
  };

  const handleKeyDown = (event, tabId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabClick(tabId);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 mb-6 ${className}`}>
      <div 
        className="flex bg-transparent rounded-lg overflow-hidden shadow-sm"
        role="tablist"
        aria-label="Checklist view options"
      >
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            disabled={disabled}
            tabIndex={activeTab === tab.id ? 0 : -1}
          />
        ))}
      </div>
    </div>
  );
};

ChecklistTabs.displayName = 'ChecklistTabs';

export default memo(ChecklistTabs);