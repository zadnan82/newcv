import React from 'react';

const HelpSection = () => {
  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">How it works</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <div className="font-medium text-gray-900 mb-1">1. Set Preferences</div>
          <div className="text-gray-600">Configure your job criteria, salary range, and notification settings</div>
        </div>
        <div>
          <div className="font-medium text-gray-900 mb-1">2. AI Matching</div>
          <div className="text-gray-600">Our AI analyzes your resume and finds the best matching jobs</div>
        </div>
        <div>
          <div className="font-medium text-gray-900 mb-1">3. Get Notified</div>
          <div className="text-gray-600">Receive email alerts with top job matches based on your schedule</div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;