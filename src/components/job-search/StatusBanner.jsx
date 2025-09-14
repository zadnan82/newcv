import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const StatusBanner = ({ preferences }) => {
  if (!preferences) return null;

  return (
    <div className={`mb-6 p-4 rounded-lg ${
      preferences.search_active 
        ? 'bg-green-50 border border-green-200' 
        : 'bg-yellow-50 border border-yellow-200'
    }`}>
      <div className="flex items-center gap-2">
        {preferences.search_active ? (
          <>
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-green-800 font-medium">
              Job search is active - {preferences.notification_frequency} notifications enabled
            </span>
          </>
        ) : (
          <>
            <AlertCircle size={20} className="text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              Job search is paused - Enable in preferences to receive automatic job matches
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusBanner;