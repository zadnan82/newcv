import React, { useState } from 'react';
import { Search, X, Briefcase, MapPin, DollarSign, Brain, Globe, Filter, Zap } from 'lucide-react';

const SearchTab = ({ 
  manualSearch, 
  setManualSearch, 
  runManualSearch, 
  searchResults, 
  loading,
  selectedResumeId,
  userResumes,
  setActiveTab,
  onAnalyzeSelectedJobs,
  onFilterJobs,
  usageLimits
}) => {
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [analyzingJobs, setAnalyzingJobs] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    salary_min: '',
    salary_max: '',
    experience_levels: [],
    industries: [],
    remote_only: false,
    posted_since: '',
    visa_sponsorship: null
  });

  // Countries list matching your backend exactly
  const SUPPORTED_COUNTRIES = [
    { code: '', name: 'Global Search', flag: '🌍' },
    { code: 'USA', name: 'United States', flag: '🇺🇸' },
    { code: 'Canada', name: 'Canada', flag: '🇨🇦' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'Germany', name: 'Germany', flag: '🇩🇪' },
    { code: 'Australia', name: 'Australia', flag: '🇦🇺' },
    { code: 'Singapore', name: 'Singapore', flag: '🇸🇬' },
    { code: 'France', name: 'France', flag: '🇫🇷' },
    { code: 'Netherlands', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'Sweden', name: 'Sweden', flag: '🇸🇪' },
    { code: 'Norway', name: 'Norway', flag: '🇳🇴' },
    { code: 'Denmark', name: 'Denmark', flag: '🇩🇰' },
    { code: 'Switzerland', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'Austria', name: 'Austria', flag: '🇦🇹' },
    { code: 'Belgium', name: 'Belgium', flag: '🇧🇪' },
    { code: 'New Zealand', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'Saudi Arabia', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'Qatar', name: 'Qatar', flag: '🇶🇦' },
    { code: 'Malaysia', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'Thailand', name: 'Thailand', flag: '🇹🇭' },
    { code: 'Philippines', name: 'Philippines', flag: '🇵🇭' },
    { code: 'Indonesia', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'Vietnam', name: 'Vietnam', flag: '🇻🇳' },
    { code: 'Spain', name: 'Spain', flag: '🇪🇸' },
    { code: 'Italy', name: 'Italy', flag: '🇮🇹' },
    { code: 'Poland', name: 'Poland', flag: '🇵🇱' },
    { code: 'Brazil', name: 'Brazil', flag: '🇧🇷' },
    { code: 'Mexico', name: 'Mexico', flag: '🇲🇽' },
    { code: 'India', name: 'India', flag: '🇮🇳' },
    { code: 'Japan', name: 'Japan', flag: '🇯🇵' },
    { code: 'Remote', name: 'Remote Only', flag: '💻' },
  ];

  // Helper functions for keywords management
  const addKeyword = () => {
    setManualSearch(prev => ({
      ...prev,
      keywords: [...prev.keywords, '']
    }));
  };

  const updateKeyword = (index, value) => {
    setManualSearch(prev => ({
      ...prev,
      keywords: prev.keywords.map((item, i) => i === index ? value : item)
    }));
  };

  const removeKeyword = (index) => {
    setManualSearch(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const getSelectedResumeName = () => {
    const resume = userResumes?.find(r => r.id === selectedResumeId);
    return resume ? (resume.title || `Resume ${resume.id}`) : 'No resume selected';
  };

  const getCountryInfo = (countryCode) => {
    return SUPPORTED_COUNTRIES.find(c => c.code === countryCode) || SUPPORTED_COUNTRIES[0];
  };

  // Phase 2: Job Selection for AI Analysis
  const toggleJobSelection = (jobId) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const selectAllJobs = () => {
    if (searchResults?.jobs) {
      setSelectedJobs(new Set(searchResults.jobs.map(job => job.job_id || job.id)));
    }
  };

  const clearSelection = () => {
    setSelectedJobs(new Set());
  };

  const handleAnalyzeSelected = async () => {
    if (selectedJobs.size === 0) return;
    
    setAnalyzingJobs(true);
    try {
      await onAnalyzeSelectedJobs(Array.from(selectedJobs));
      setSelectedJobs(new Set());
      setActiveTab('matches');
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzingJobs(false);
    }
  };

  // Phase 2: Filter Jobs
  const handleApplyFilters = async () => {
    if (!searchResults?.jobs) return;
    
    const jobIds = searchResults.jobs.map(job => job.job_id || job.id);
    const filterData = {
      job_ids: jobIds,
      ...filters,
      experience_levels: filters.experience_levels.length > 0 ? filters.experience_levels : null,
      industries: filters.industries.length > 0 ? filters.industries : null,
      salary_min: filters.salary_min ? parseInt(filters.salary_min) : null,
      salary_max: filters.salary_max ? parseInt(filters.salary_max) : null,
      visa_sponsorship: filters.visa_sponsorship === '' ? null : filters.visa_sponsorship
    };

    try {
      await onFilterJobs(filterData);
    } catch (error) {
      console.error('Filtering failed:', error);
    }
  };

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

  const selectedCountryInfo = getCountryInfo(manualSearch.country);
  const totalAnalysisCost = selectedJobs.size * 0.012;

  return (
    <div className="space-y-6">
      {/* Two-Phase System Explanation */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe size={24} className="text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Pure Two-Phase Search System</h3>
            <p className="text-blue-600">Search uses only 4 core parameters. Then filter and analyze results.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/70 p-4 rounded-lg">
            <div className="text-lg font-bold text-green-600">Phase 1: Discovery</div>
            <div className="text-sm text-gray-700">Keywords + Location + Country + Max Results</div>
            <div className="text-xs text-green-600">Always FREE - No preferences interference</div>
          </div>
          <div className="bg-white/70 p-4 rounded-lg">
            <div className="text-lg font-bold text-blue-600">Phase 2: Filter</div>
            <div className="text-sm text-gray-700">Salary, Experience, Industry, etc.</div>
            <div className="text-xs text-blue-600">FREE - Apply after discovery</div>
          </div>
          <div className="bg-white/70 p-4 rounded-lg">
            <div className="text-lg font-bold text-purple-600">Phase 3: AI Analysis</div>
            <div className="text-sm text-gray-700">Select best jobs for AI matching</div>
            <div className="text-xs text-purple-600">$0.012 per job</div>
          </div>
        </div>
      </div>

      {/* Phase 1: Pure Discovery Form - Only 4 Parameters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search size={20} />
          Phase 1: Job Discovery (4 Core Parameters Only)
        </h3>

        {/* Resume Selection */}
        {selectedResumeId && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Using Resume:</strong> {getSelectedResumeName()}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parameter 1: Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. Keywords * (Required)
            </label>
            {manualSearch.keywords.map((keyword, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => updateKeyword(index, e.target.value)}
                  placeholder="e.g., Software Engineer, Python Developer"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {manualSearch.keywords.length > 1 && (
                  <button
                    onClick={() => removeKeyword(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addKeyword}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add keyword
            </button>
          </div>

          {/* Parameter 2: Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. Location (Optional)
            </label>
            <input
              type="text"
              value={manualSearch.location}
              onChange={(e) => setManualSearch(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Dubai, London, Remote"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Parameter 3: Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. Target Country
            </label>
            <select
              value={manualSearch.country}
              onChange={(e) => setManualSearch(prev => ({ ...prev, country: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {SUPPORTED_COUNTRIES.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Parameter 4: Max Results */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4. Max Results
            </label>
            <input
              type="number"
              value={manualSearch.max_results}
              onChange={(e) => setManualSearch(prev => ({ ...prev, max_results: parseInt(e.target.value) }))}
              min="10"
              max="200"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Pure Discovery:</strong> This search uses ONLY the 4 parameters above. 
            No preferences, no salary filters, no experience filters. 
            You'll get ALL jobs matching your keywords in {selectedCountryInfo.name}. 
            Then you can filter and analyze.
          </p>
        </div>

        <button
          onClick={runManualSearch}
          disabled={loading || !selectedResumeId || manualSearch.keywords.some(k => !k.trim())}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Search size={16} />
          )}
          {loading ? 'Discovering Jobs...' : `🌍 Start Pure Discovery (FREE)`}
        </button>

        {!selectedResumeId && (
          <p className="mt-2 text-sm text-red-600">
            Please select a resume to enable job searching.
          </p>
        )}
      </div>

      {/* Phase 2 & 3: Results with Filtering and Analysis */}
      {searchResults && (
        <div className="space-y-4">
          {/* Discovery Success */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Zap className="text-green-600 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-green-800">Discovery Complete!</h4>
                <p className="text-sm text-green-700 mt-1">
                  ✅ Found {searchResults.final_jobs_count || searchResults.jobs?.length || 0} jobs from {selectedCountryInfo.name}<br/>
                  🔧 Now you can filter results or select jobs for AI analysis
                </p>
              </div>
            </div>
          </div>

          {/* Phase 2: Filtering Controls */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Filter size={20} />
                Phase 2: Filter Results (FREE)
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Filter size={16} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                {/* Salary Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.salary_min}
                      onChange={(e) => setFilters(prev => ({ ...prev, salary_min: e.target.value }))}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.salary_max}
                      onChange={(e) => setFilters(prev => ({ ...prev, salary_max: e.target.value }))}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    multiple
                    value={filters.experience_levels}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      experience_levels: Array.from(e.target.selectedOptions, option => option.value)
                    }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead/Principal</option>
                  </select>
                </div>

                {/* Posted Since Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posted Since</label>
                  <select
                    value={filters.posted_since}
                    onChange={(e) => setFilters(prev => ({ ...prev, posted_since: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Any time</option>
                    <option value="last_week">Last week</option>
                    <option value="last_month">Last month</option>
                    <option value="last_3_months">Last 3 months</option>
                  </select>
                </div>

                {/* Remote Only Filter */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.remote_only}
                      onChange={(e) => setFilters(prev => ({ ...prev, remote_only: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remote only</span>
                  </label>
                </div>

                {/* Apply Filters Button */}
                <div className="md:col-span-2 lg:col-span-3">
                  <button
                    onClick={handleApplyFilters}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Filter size={16} />
                    Apply Filters (FREE)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Phase 3: Job Selection for AI Analysis */}
          {searchResults.jobs?.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Brain size={20} />
                  Phase 3: Select Jobs for AI Analysis
                </h3>
                <div className="flex gap-2">
                  <button onClick={selectAllJobs} className="text-blue-600 hover:text-blue-800 text-sm">
                    Select All
                  </button>
                  <button onClick={clearSelection} className="text-gray-600 hover:text-gray-800 text-sm">
                    Clear
                  </button>
                </div>
              </div>

              {/* AI Analysis Cost Summary */}
              {selectedJobs.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-blue-800">
                        {selectedJobs.size} jobs selected for AI analysis
                      </p>
                      <p className="text-sm text-blue-600">
                        Total cost: ${totalAnalysisCost.toFixed(3)} • 
                        Remaining credits: {usageLimits?.ai_analysis_limits?.remaining || 0}
                      </p>
                    </div>
                    <button
                      onClick={handleAnalyzeSelected}
                      disabled={analyzingJobs || selectedJobs.size > (usageLimits?.ai_analysis_limits?.remaining || 0)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {analyzingJobs ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Brain size={16} />
                      )}
                      {analyzingJobs ? 'Analyzing...' : 'Run AI Analysis'}
                    </button>
                  </div>
                </div>
              )}

              {/* Jobs List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.jobs.map((job) => {
                  const jobId = job.job_id || job.id;
                  const isSelected = selectedJobs.has(jobId);

                  return (
                    <div 
                      key={jobId} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleJobSelection(jobId)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleJobSelection(jobId)}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{job.title}</h4>
                              <p className="text-gray-600 flex items-center gap-2">
                                <Briefcase size={14} />
                                {job.company}
                              </p>
                              {job.location && (
                                <p className="text-gray-600 flex items-center gap-2">
                                  <MapPin size={14} />
                                  {job.location}
                                  {job.country && `, ${job.country}`}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {job.discovery_score && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                  {Math.round(job.discovery_score)}% Match
                                </span>
                              )}
                              <span className="text-xs text-blue-600">
                                AI Cost: $0.012
                              </span>
                            </div>
                          </div>

                          {(job.salary_min || job.salary_max) && (
                            <p className="text-gray-600 flex items-center gap-2 mb-2">
                              <DollarSign size={14} />
                              {formatSalary(job)}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 mb-2">
                            {job.job_type && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {job.job_type}
                              </span>
                            )}
                            {job.industry && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {job.industry}
                              </span>
                            )}
                            {job.source && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {job.source}
                              </span>
                            )}
                          </div>

                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Original →
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchTab;