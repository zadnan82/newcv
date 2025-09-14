import React from 'react';
import { Search, Settings, Briefcase, TrendingUp } from 'lucide-react';

const JobSearchTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'search', label: 'Job Search', icon: Search },
    { id: 'matches', label: 'My Matches', icon: Briefcase },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default JobSearchTabs;