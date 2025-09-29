import allBgImg from "@/assets/party-al-bg.png";
import ChecklistTabs from '@/components/CheckList/CheckListTabs';
import Header from "@/components/CheckList/Header";
import StatsMetrics from "@/components/CheckList/StatsMetrics";
import type { ReactNode } from 'react';
import { Suspense, lazy, useCallback, useState } from 'react';

const ChecklistContent = lazy(() => import("@/components/CheckList/Contents/ChecklistContent"));
const TimelineContent = lazy(() => import("@/components/CheckList/Contents/TimelineContent"));
const CategoryContent = lazy(() => import("@/components/CheckList/Contents/CategoryContent"));

const TabContentSkeleton = () => (
  <div className="container min-h-screen mx-auto animate-pulse space-y-4 p-4">
    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
  </div>
);

interface TabContentErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const TabContentErrorBoundary = ({ children = <div>Something went wrong</div> }: TabContentErrorBoundaryProps) => {
  return <>{children}</>; 
};

const INITIAL_TAB = 'checklist';
type TabId = 'checklist' | 'timeline' | 'category';

function CheckList() {
  const [activeTab, setActiveTab] = useState<TabId>(INITIAL_TAB);
  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
  }, []);

  const renderTabContent = () => {
    const contentComponents: Record<TabId, ReactNode> = {
      checklist: <ChecklistContent />,
      timeline: <TimelineContent />,
      category: <CategoryContent />
    };

    const Content = contentComponents[activeTab] || contentComponents[INITIAL_TAB];

    return (
      <TabContentErrorBoundary>
        <Suspense fallback={<TabContentSkeleton />}>
          <div 
            role="tabpanel" 
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {Content}
          </div>
        </Suspense>
      </TabContentErrorBoundary>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative mt-1">
        {/* Background */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center grayscale"
          style={{ backgroundImage: `url(${allBgImg})` }}
          role="presentation"
          aria-hidden="true"
        />
        
        {/* Stats */}
        <StatsMetrics />

        {/* Tabs */}
        <section className="relative z-10" aria-label="Checklist views">
          <ChecklistTabs 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          
          {/* Tab Content */}
          <div>
            {renderTabContent()}
          </div>
        </section>
      </main>
    </div>
  );
}

CheckList.displayName = 'CheckList';

export default CheckList;