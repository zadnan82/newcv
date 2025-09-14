import React from 'react';
import { Briefcase, Clock, MapPin, DollarSign, Eye, Send, X, Brain, Zap } from 'lucide-react';

const MatchesTab = ({ 
  jobMatches, 
  loadJobMatches, 
  markJobViewed, 
  markJobApplied, 
  dismissJob 
}) => {
  const formatSalary = (job) => {
    const { salary_min, salary_max, salary_currency = 'USD' } = job;
    const symbol = salary_currency === 'USD' ? '$' : 
                   salary_currency === 'EUR' ? '€' : 
                   salary_currency === 'GBP' ? '£' : salary_currency;
    
    if (salary_min && salary_max) {
      return `${symbol}${salary_min.toLocaleString()} - ${symbol}${salary_max.toLocaleString()}`;
    }
    if (salary_min) return `${symbol}${salary_min.toLocaleString()}+`;
    if (salary_max) return `Up to ${symbol}${salary_max.toLocaleString()}`;
    return 'Not specified';
  };

  const getMatchScoreColor = (score) => {
    // Handle both decimal (0-1) and percentage (0-100) scores
    const normalizedScore = score > 1 ? score : score * 100;
    
    if (normalizedScore >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (normalizedScore >= 60) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (normalizedScore >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getMatchScoreText = (score) => {
    const normalizedScore = score > 1 ? score : score * 100;
    return Math.round(normalizedScore);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain size={20} />
          AI-Analyzed Job Matches ({jobMatches.length})
        </h3>
        <button
          onClick={loadJobMatches}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Clock size={16} />
          Refresh
        </button>
      </div>

      {/* Two-Phase System Info */}
      {jobMatches.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-blue-600" />
            <span className="font-medium text-blue-800">AI-Powered Matches</span>
          </div>
          <p className="text-sm text-blue-700">
            These jobs have been analyzed by our AI system using your resume. Each analysis cost $0.012 - 70% less than traditional systems.
          </p>
        </div>
      )}

      {jobMatches.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Brain size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="mb-2">No AI-analyzed job matches found yet.</p>
          <div className="text-sm text-gray-400 space-y-1">
            <p>To get AI matches:</p>
            <p>1. Go to "Job Search" tab</p>
            <p>2. Run a discovery search (FREE)</p>
            <p>3. Select jobs for AI analysis ($0.012 each)</p>
            <p>4. Your matches will appear here</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {jobMatches.map((match) => {
            // Handle different data structures from backend
            const job = match.job_posting || match.job || match;
            const matchScore = match.match_score || 0;
            const isViewed = match.user_viewed || false;
            const isApplied = match.user_applied || false;
            const isDismissed = match.user_dismissed || false;
            const aiAnalysis = match.ai_analysis_data || match.match_analysis || {};
            
            // Skip dismissed jobs unless explicitly showing them
            if (isDismissed) return null;
            
            return (
              <div key={match.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                {/* Header with Title and Match Score */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{job.title || 'Unknown Title'}</h4>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Briefcase size={16} />
                      {job.company || 'Unknown Company'}
                    </p>
                    {job.location && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <MapPin size={16} />
                        {job.location}
                        {job.country && `, ${job.country}`}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getMatchScoreColor(matchScore)}`}>
                      <Brain size={12} className="inline mr-1" />
                      {getMatchScoreText(matchScore)}% AI Match
                    </span>
                    <span className="text-xs text-gray-500">
                      Analysis cost: $0.012
                    </span>
                  </div>
                </div>

                {/* Job Details */}
                {(job.salary_min || job.salary_max) && (
                  <p className="text-gray-600 flex items-center gap-2 mb-2">
                    <DollarSign size={16} />
                    {formatSalary(job)}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.job_type && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {job.job_type}
                    </span>
                  )}
                  {job.experience_level && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {job.experience_level}
                    </span>
                  )}
                  {job.industry && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {job.industry}
                    </span>
                  )}
                  {job.source && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {job.source}
                    </span>
                  )}
                </div>

                {/* AI Analysis Summary */}
                {aiAnalysis && Object.keys(aiAnalysis).length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-1">
                      <Brain size={14} />
                      AI Analysis Summary
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 && (
                        <div>
                          <span className="font-medium text-green-700">Strengths:</span>
                          <ul className="text-green-600 text-xs mt-1">
                            {aiAnalysis.strengths.slice(0, 2).map((strength, index) => (
                              <li key={index}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {aiAnalysis.gaps && aiAnalysis.gaps.length > 0 && (
                        <div>
                          <span className="font-medium text-orange-700">Areas to Address:</span>
                          <ul className="text-orange-600 text-xs mt-1">
                            {aiAnalysis.gaps.slice(0, 2).map((gap, index) => (
                              <li key={index}>• {gap}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {aiAnalysis.recommendation && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-blue-700">Recommendation:</span>
                          <p className="text-blue-600 text-xs mt-1">{aiAnalysis.recommendation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => markJobViewed(match.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Eye size={16} />
                    View Job
                  </a>
                  
                  {!isApplied && (
                    <button
                      onClick={() => markJobApplied(match.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                    >
                      <Send size={16} />
                      Mark Applied
                    </button>
                  )}
                  
                  <button
                    onClick={() => dismissJob(match.id)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
                  >
                    <X size={16} />
                    Dismiss
                  </button>
                </div>

                {/* Status Indicators */}
                <div className="mt-3 flex gap-4 text-sm text-gray-500">
                  {isViewed && (
                    <span className="flex items-center gap-1 text-blue-600">
                      <Eye size={12} /> Viewed
                    </span>
                  )}
                  {isApplied && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Send size={12} /> Applied
                    </span>
                  )}
                  <span>
                    AI Analyzed: {new Date(match.created_at || Date.now()).toLocaleDateString()}
                  </span>
                  <span>
                    Found: {new Date(job.discovered_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatchesTab;