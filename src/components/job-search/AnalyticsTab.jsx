import React from 'react';
import { TrendingUp, DollarSign, Zap, Target, Globe, Search } from 'lucide-react';

const AnalyticsTab = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">No analytics data available yet.</p>
        <p className="text-sm text-gray-400">Analytics will appear after you start searching for jobs.</p>
      </div>
    )
  };

  return (
    <div className="space-y-6">
      {/* Two-Phase System Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
          <Globe size={20} />
          Two-Phase System Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics.two_phase_analytics?.discovery_phase?.total_searches || 0}
            </div>
            <div className="text-sm text-gray-600">Discovery Searches</div>
            <div className="text-xs text-green-600">Always FREE</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.two_phase_analytics?.discovery_phase?.total_jobs_discovered || 0}
            </div>
            <div className="text-sm text-gray-600">Jobs Discovered</div>
            <div className="text-xs text-blue-600">$0.00 Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analytics.two_phase_analytics?.ai_analysis_phase?.total_analyses || 0}
            </div>
            <div className="text-sm text-gray-600">AI Analyses</div>
            <div className="text-xs text-purple-600">$0.012 each</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analytics.efficiency_metrics?.cost_efficiency || '70% savings'}
            </div>
            <div className="text-sm text-gray-600">Cost Optimization</div>
            <div className="text-xs text-orange-600">vs old approach</div>
          </div>
        </div>
      </div>

      {/* Cost Efficiency Analysis */}
      {analytics.two_phase_analytics && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign size={20} />
            Cost Efficiency Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border">
              <h4 className="font-medium text-green-800 mb-2">Discovery Phase</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Searches:</span>
                  <span className="font-medium">{analytics.two_phase_analytics.discovery_phase?.total_searches || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Jobs Found:</span>
                  <span className="font-medium">{analytics.two_phase_analytics.discovery_phase?.total_jobs_discovered || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cost:</span>
                  <span className="font-medium text-green-600">{analytics.two_phase_analytics.discovery_phase?.cost || '$0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Efficiency:</span>
                  <span className="font-medium">{analytics.two_phase_analytics.discovery_phase?.discovery_efficiency || '0%'}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border">
              <h4 className="font-medium text-blue-800 mb-2">AI Analysis Phase</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Analyses:</span>
                  <span className="font-medium">{analytics.two_phase_analytics.ai_analysis_phase?.total_analyses || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Match Score:</span>
                  <span className="font-medium">{analytics.two_phase_analytics.ai_analysis_phase?.average_match_score || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Cost:</span>
                  <span className="font-medium text-blue-600">{analytics.two_phase_analytics.ai_analysis_phase?.total_cost || '$0.000'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Per Analysis:</span>
                  <span className="font-medium">{analytics.two_phase_analytics.ai_analysis_phase?.cost_per_analysis || '$0.012'}</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border">
              <h4 className="font-medium text-purple-800 mb-2">Efficiency Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Jobs per Discovery:</span>
                  <span className="font-medium">{analytics.efficiency_metrics?.avg_jobs_per_discovery || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Analysis Ratio:</span>
                  <span className="font-medium">{analytics.efficiency_metrics?.discovery_to_analysis_ratio || '1:0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cost Efficiency:</span>
                  <span className="font-medium text-purple-600">{analytics.efficiency_metrics?.cost_efficiency || '70% savings'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Engagement Metrics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target size={20} />
          User Engagement & Match Quality
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.user_engagement?.total_matches_created || 0}
            </div>
            <div className="text-sm text-gray-600">Total Matches</div>
            <div className="text-xs text-blue-500">AI Generated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics.user_engagement?.view_rate || 0}%
            </div>
            <div className="text-sm text-gray-600">View Rate</div>
            <div className="text-xs text-green-500">Quality Indicator</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analytics.user_engagement?.application_rate || 0}%
            </div>
            <div className="text-sm text-gray-600">Application Rate</div>
            <div className="text-xs text-purple-500">Success Metric</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((analytics.match_statistics?.average_match_score || 0) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Avg Match Score</div>
            <div className="text-xs text-orange-500">AI Accuracy</div>
          </div>
        </div>
      </div>

      {/* Daily Usage Tracking */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search size={20} />
          Today's Usage & Limits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">
              {analytics.usage_limits?.job_search_limits?.daily_used || 0}/
              {analytics.usage_limits?.job_search_limits?.daily_limit || 20}
            </div>
            <div className="text-sm text-gray-600">Discovery Searches</div>
            <div className="text-xs text-blue-600 font-medium">FREE</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">
              {analytics.usage_limits?.ai_analysis_limits?.daily_used || 0}/
              {analytics.usage_limits?.ai_analysis_limits?.daily_limit || 6}
            </div>
            <div className="text-sm text-gray-600">AI Analyses</div>
            <div className="text-xs text-green-600 font-medium">$0.012 each</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-lg font-bold text-purple-600">
              ${((analytics.usage_limits?.ai_analysis_limits?.daily_used || 0) * 0.012).toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">Today's AI Cost</div>
            <div className="text-xs text-purple-600 font-medium">70% Optimized</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded">
            <div className="text-lg font-bold text-orange-600">
              {analytics.usage_limits?.ai_analysis_limits?.remaining || 0}
            </div>
            <div className="text-sm text-gray-600">AI Credits Left</div>
            <div className="text-xs text-orange-600 font-medium">Resets Daily</div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Search Performance</h3>
          {analytics.search_statistics ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Searches</span>
                <span className="text-blue-600 font-medium">{analytics.search_statistics.total_searches || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Avg Execution Time</span>
                <span className="text-blue-600 font-medium">{Math.round(analytics.search_statistics.avg_execution_time_ms || 0)}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Jobs Discovered</span>
                <span className="text-blue-600 font-medium">{analytics.search_statistics.total_jobs_discovered || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Matches Created</span>
                <span className="text-blue-600 font-medium">{analytics.search_statistics.total_matches_found || 0}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No search data available yet.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">System Insights</h3>
          {analytics.insights ? (
            <div className="space-y-3">
              {analytics.insights.top_industries?.length > 0 ? (
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">Top Industries</h5>
                  <div className="space-y-1">
                    {analytics.insights.top_industries.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700 capitalize text-sm">{item.industry || 'Technology'}</span>
                        <span className="text-blue-600 font-medium text-sm">{item.count || item.matches || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              
              {analytics.insights.top_locations?.length > 0 ? (
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">Top Locations</h5>
                  <div className="space-y-1">
                    {analytics.insights.top_locations.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm">{item.location || 'Remote'}</span>
                        <span className="text-blue-600 font-medium text-sm">{item.count || item.matches || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-gray-500">No insights available yet.</p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {analytics.recommendations && analytics.recommendations.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
          <div className="space-y-3">
            {analytics.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two-Phase System Explanation */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">How Two-Phase Search Works</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Phase 1 - FREE Discovery</p>
              <p className="text-sm text-gray-600">Cast a wide net across global job sources. Find ALL opportunities without hidden filtering.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Phase 2 - AI Analysis ($0.012/job)</p>
              <p className="text-sm text-gray-600">You choose which jobs get expensive AI analysis. 70% cost savings vs traditional systems.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium text-gray-900">Smart Strategy</p>
              <p className="text-sm text-gray-600">Discover broadly (FREE) → Filter precisely (FREE) → Analyze selectively (PAID)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;