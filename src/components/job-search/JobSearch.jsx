// Main JobSearchComponent.jsx
import React, { useState, useEffect } from 'react';
import { Search, Settings, Briefcase, TrendingUp, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import API_BASE_URL from '../../config';
import { useTranslation } from 'react-i18next';


// Import child components
import JobSearchTabs from './JobSearchTabs';
import QuickActions from './QuickActions';
import StatusBanner from './StatusBanner';
import SearchTab from './SearchTab';
import MatchesTab from './MatchesTab';
import PreferencesTab from './PreferencesTab';
import AnalyticsTab from './AnalyticsTab';
import HelpSection from './HelpSection';
import useResumeStore from '../../stores/resumeStore';

const JobSearchComponent = ({ darkMode }) => { 
  const { t, i18n } = useTranslation();
  
  // State management
  const [activeTab, setActiveTab] = useState('search');
  const [cvSource, setCvSource] = useState('database');
  const [preferences, setPreferences] = useState(null);
  const [jobMatches, setJobMatches] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [usageInfo, setUsageInfo] = useState(null);
  const [formData, setFormData] = useState({ resume_text: '' });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const token = useAuthStore(state => state.token);
  const { resumes, fetchResumes, loading: resumesLoading } = useResumeStore();

  // Manual search state
  const [manualSearch, setManualSearch] = useState({
    keywords: [''],
    location: '',
    country: '',
    max_results: 50,
    resume_id: null
  });

  // Preferences form state
  const [preferencesForm, setPreferencesForm] = useState({
    target_roles: [''],
    target_locations: [''],
    target_countries: [''],
    target_industries: [''],
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD',
    job_types: ['full-time'],
    experience_levels: ['mid'],
    notification_enabled: true,
    notification_frequency: 'weekly',
    email_notifications: true,
    search_active: true,
    resume_id: null
  });

  // Format resume to text
  const formatResumeToText = (resume) => {
  let text = '';
  
  // Personal Info
  if (resume.personal_info) {
    const info = resume.personal_info;
    if (info.full_name) text += `Name: ${info.full_name}\n`;
    if (info.email) text += `Email: ${info.email}\n`;
    if (info.mobile) text += `Phone: ${info.mobile}\n`;
    if (info.title) text += `Title: ${info.title}\n`;
    if (info.summary) text += `Summary: ${info.summary}\n`;
    text += '\n';
  }
  
  // Experience
  if (resume.experiences && resume.experiences.length > 0) {
    text += 'EXPERIENCE:\n';
    resume.experiences.forEach(exp => {
      text += `${exp.position} at ${exp.company}\n`;
      if (exp.start_date && exp.end_date) {
        text += `${exp.start_date} - ${exp.end_date}\n`;
      }
      if (exp.description) text += `${exp.description}\n`;
      text += '\n';
    });
  }
  
  // Education
  if (resume.educations && resume.educations.length > 0) {
    text += 'EDUCATION:\n';
    resume.educations.forEach(edu => {
      text += `${edu.degree} in ${edu.field_of_study} from ${edu.institution}\n`;
      if (edu.start_date && edu.end_date) {
        text += `${edu.start_date} - ${edu.end_date}\n`;
      }
      text += '\n';
    });
  }
  
  // Skills
  if (resume.skills && resume.skills.length > 0) {
    text += 'SKILLS:\n';
    const skillNames = resume.skills.map(skill => skill.name).join(', ');
    text += `${skillNames}\n\n`;
  }
  
  // Languages
  if (resume.languages && resume.languages.length > 0) {
    text += 'LANGUAGES:\n';
    resume.languages.forEach(lang => {
      text += `${lang.language} - ${lang.proficiency}\n`;
    });
    text += '\n';
  }
  
  return text.trim();
};

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadPreferences();
      loadJobMatches();
      loadAnalytics();
    }
  }, [isAuthenticated]);

  // Update resume_id in forms when selectedResumeId changes
  useEffect(() => {
    setManualSearch(prev => ({ ...prev, resume_id: selectedResumeId }));
    setPreferencesForm(prev => ({ ...prev, resume_id: selectedResumeId }));
  }, [selectedResumeId]);

  // Usage limit check
  const checkUsageLimit = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/job-search/usage-limits`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      setUsageInfo(data);
    }
  } catch (err) {
    console.error('Error checking usage limit:', err);
  }
};

  useEffect(() => {
    if (token) {
      checkUsageLimit();
    }
  }, [token]);
  
  useEffect(() => {
    console.log('🔍 JobMatching useEffect triggered');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('token:', token ? 'exists' : 'missing');
    
    if (isAuthenticated && token) {
      console.log('✅ Fetching resumes...');
      fetchResumes().then(() => {
        console.log('📋 Resumes fetched, current resumes:', resumes);
      }).catch(error => {
        console.error('❌ Error fetching resumes:', error);
      }); 
    } else {
      console.log('❌ Not authenticated or no token');
    }
  }, [fetchResumes, isAuthenticated, token]);

  // Handle resume selection from database
  const handleResumeSelect = (resumeId) => {
    console.log('Selecting resume:', resumeId);
    setSelectedResumeId(resumeId);
    
    if (resumeId) {
      const resume = resumes.find(r => r.id == resumeId);
      if (resume) {
        const resumeText = formatResumeToText(resume);
        setFormData({ ...formData, resume_text: resumeText });
        console.log('Resume text set:', resumeText.substring(0, 100) + '...');
      }
      setUploadedFile(null);
    } else {
      setFormData({ ...formData, resume_text: '' });
    }
  };

  // API helper function
  const apiCall = async (endpoint, method = 'GET', data = null) => {
    const token = useAuthStore.getState().token;

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        ...(data ? { body: JSON.stringify(data) } : {})
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.detail || `Error ${response.status}`;
        throw new Error(errorMsg);
      }

      if (response.status === 204) return null;
      return await response.json();
    } catch (err) {
      console.error("API call error:", err.message);
      throw err;
    }
  };
 
  const loadPreferences = async () => {
    try {
      const data = await apiCall('/job-search/preferences');
      setPreferences(data);
      if (data) {
        setPreferencesForm({
          target_roles: data.target_roles?.length ? data.target_roles : [''],
          target_locations: data.target_locations?.length ? data.target_locations : [''],
          target_countries: data.target_countries?.length ? data.target_countries : [''],
          target_industries: data.target_industries?.length ? data.target_industries : [''],
          salary_min: data.salary_min || '',
          salary_max: data.salary_max || '',
          salary_currency: data.salary_currency || 'USD',
          job_types: data.job_types?.length ? data.job_types : ['full-time'],
          experience_levels: data.experience_levels?.length ? data.experience_levels : ['mid'],
          notification_enabled: data.notification_enabled !== false,
          notification_frequency: data.notification_frequency || 'weekly',
          email_notifications: data.email_notifications !== false,
          search_active: data.search_active !== false,
          resume_id: data.resume_id || null
        });
        
        if (data.resume_id) {
          handleResumeSelect(data.resume_id);
        }
      }
    } catch (error) {
      console.log('No preferences found, using defaults:', error.message);
    }
  };

  const loadJobMatches = async () => {
  try {
    const data = await apiCall('/job-search/matches?limit=20');
    if (data && data.matches) {
      setJobMatches(data.matches);
    } else {
      setJobMatches([]);
    }
  } catch (error) {
    console.error('Failed to load job matches:', error);
    setJobMatches([]);
    
    // Show user-friendly error
    if (error.message.includes('404')) {
      console.log('No matches found yet');
    } else if (error.message.includes('401')) {
      alert('Please log in to view your job matches.');
    } else {
      alert('Failed to load job matches. Please try again.');
    }
  }
};

  const loadAnalytics = async () => {
    try {
      const data = await apiCall('/job-search/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const savePreferences = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save preferences.');
      return;
    }

    setLoading(true);
    try {
      const cleanedForm = {
        ...preferencesForm,
        target_roles: preferencesForm.target_roles.filter(r => r.trim()),
        target_locations: preferencesForm.target_locations.filter(l => l.trim()),
        target_countries: preferencesForm.target_countries.filter(c => c.trim()),
        target_industries: preferencesForm.target_industries.filter(i => i.trim()),
        salary_min: preferencesForm.salary_min ? parseInt(preferencesForm.salary_min) : null,
        salary_max: preferencesForm.salary_max ? parseInt(preferencesForm.salary_max) : null,
      };

      const method = preferences ? 'PUT' : 'POST';
      await apiCall('/job-search/preferences', method, cleanedForm);
      await loadPreferences();
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Save preferences error:', error);
      if (error.message.includes('Authentication')) {
        alert('Session expired. Please log in again.');
      } else {
        alert('Failed to save preferences: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const runManualSearch = async () => {
  if (!isAuthenticated) {
    alert('Please log in to search for jobs.');
    return;
  }

  if (!selectedResumeId) {
    alert('Please select a resume to use for job searching.');
    return;
  }

  setLoading(true);
  console.log('🔍 Starting manual search...');
  
  try {
    const searchData = {
      ...manualSearch,
      keywords: manualSearch.keywords.filter(k => k.trim()),
      resume_id: selectedResumeId
    };

    if (searchData.keywords.length === 0) {
      alert('Please enter at least one keyword to search.');
      setLoading(false);
      return;
    }

    console.log('📤 Sending search request:', searchData);

    const result = await apiCall('/job-search/search', 'POST', searchData);

    console.log('📥 Raw search response:', result);

    if (result.error) {
      throw new Error(result.error);
    }

    // 🔥 FIX: Handle nested structure from debug output
    // Jobs are in result.results.jobs, not result.jobs
    const processedResults = {
      ...result,
      jobs: result.results?.jobs || result.jobs || [],  // Try nested first, then top level
      jobs_discovered: result.results?.jobs_discovered || result.jobs_discovered || 0,
      jobs_after_filtering: result.results?.jobs_after_filtering || result.jobs_after_filtering || 0,
      phase: result.phase || result.results?.phase || 'completed',
      message: result.message || 'Search completed'
    };

    console.log('✅ Processed search results:', processedResults);
    console.log('🔍 Jobs found:', processedResults.jobs?.length || 0);
    console.log('📊 Discovery stats:', {
      discovered: processedResults.jobs_discovered,
      afterFiltering: processedResults.jobs_after_filtering,
      returned: processedResults.jobs?.length || 0
    });
    
    // Set the search results to state
    setSearchResults(processedResults);
    
    // Check if filtering is the issue
    if (processedResults.jobs_discovered > 0 && processedResults.jobs_after_filtering === 0) {
      console.warn('⚠️ All jobs were filtered out! Check your search preferences.');
      alert(`Found ${processedResults.jobs_discovered} jobs but all were filtered out by your preferences. Consider adjusting your search criteria.`);
    }
    
    // Also refresh matches in case any were created
    await loadJobMatches();

    console.log('🎉 Search completed successfully');

  } catch (error) {
    console.error('❌ Search error:', error);
    alert('Search failed: ' + (error.message || 'Unknown error occurred'));
  } finally {
    setLoading(false);
  }
};

// Also add this debug function 
const debugSearchResults = () => {
  console.log('🐛 Current searchResults state:', searchResults);
  console.log('🐛 Type of searchResults:', typeof searchResults);
  if (searchResults) {
    console.log('🐛 Keys in searchResults:', Object.keys(searchResults));
    console.log('🐛 searchResults.jobs:', searchResults.jobs);
    console.log('🐛 searchResults.results:', searchResults.results);
    console.log('🐛 searchResults.jobs:', searchResults.jobs);
  }
};

 

  const markJobViewed = async (matchId) => {
    try {
      await apiCall(`/job-search/matches/${matchId}/view`, 'POST');
      await loadJobMatches();
    } catch (error) {
      console.error('Failed to mark job as viewed:', error);
    }
  };

  const markJobApplied = async (matchId) => {
    try {
      await apiCall(`/job-search/matches/${matchId}/apply`, 'POST');
      await loadJobMatches();
    } catch (error) {
      console.error('Failed to mark job as applied:', error);
    }
  };

  const dismissJob = async (matchId) => {
    try {
      await apiCall(`/job-search/matches/${matchId}/dismiss`, 'POST');
      await loadJobMatches();
    } catch (error) {
      console.error('Failed to dismiss job:', error);
    }
  };

  const analyzeSelectedJobs = async (jobIds) => {
  if (!isAuthenticated) {
    alert('Please log in to analyze jobs.');
    return;
  }

  setLoading(true);
  try {
    const analysisData = {
      job_ids: jobIds,
      analysis_type: "basic"
    };

    const result = await apiCall('/job-search/analyze-jobs', 'POST', analysisData);

    if (result.error) {
      throw new Error(result.error);
    }

    // Show success message
    alert(`✅ Analysis complete! ${result.matches_created} new matches created for $${result.total_cost}`);
    
    // Refresh matches and switch to matches tab
    await loadJobMatches();
    setActiveTab('matches');

  } catch (error) {
    console.error('Job analysis error:', error);
    if (error.message.includes('AI usage limit')) {
      alert('Daily AI analysis limit reached. Try again tomorrow or upgrade your plan.');
    } else {
      alert('Analysis failed: ' + (error.message || 'Unknown error occurred'));
    }
  } finally {
    setLoading(false);
  }
};
  // Show login message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-16">
          <Briefcase size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Search</h2>
          <p className="text-gray-600 mb-6">
            Please log in to access the job search feature and find your perfect job with AI-powered matching.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Log In to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Search</h1>
        <p className="text-gray-600">
          Find your perfect job with AI-powered matching and automated discovery
        </p>
      </div>

      {/* Database Resume Selection */}
      {cvSource === 'database' && (
        <div className="mb-4">
          <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {t('jobMatching.form.selectResumeOption', 'Select from your saved resumes')}
          </label>
          
          {resumesLoading && (
            <div className={`p-3 rounded-lg border text-center ${
              darkMode ? 'bg-gray-700/30 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-600'
            }`}>
              <div className="w-4 h-4 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading your resumes...</p>
            </div>
          )}
          
          {!resumesLoading && isAuthenticated && resumes && Array.isArray(resumes) && resumes.length > 0 && (
            <div>
              <div className="flex">
                <select
                  name="resumeId"
                  value={selectedResumeId || ''}
                  onChange={(e) => handleResumeSelect(e.target.value)}
                  className={`w-full p-2.5 text-sm rounded-l border transition-all ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20' 
                      : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20'
                  }`}
                >
                  <option value="">{t('jobMatching.form.selectResumeOption', '-- Select a resume --')}</option>
                  {resumes.map(resume => (
                    <option key={resume.id} value={resume.id}>
                      {resume.title || `${t('resume.title', 'Resume')} #${resume.id}`}
                      {resume.personal_info?.full_name && ` - ${resume.personal_info.full_name}`}
                    </option>
                  ))}
                </select>
                {selectedResumeId && (
                  <button
                    type="button"
                    onClick={() => handleResumeSelect(null)}
                    className={`px-3 py-2 rounded-r border-l-0 text-sm transition-colors ${
                      darkMode 
                        ? 'bg-gray-600 text-gray-300 border-gray-600 hover:bg-gray-500' 
                        : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                    }`}
                    title={t('common.clear', 'Clear')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {selectedResumeId && (
                <div className={`mt-2 p-2 rounded text-xs flex items-center gap-2 ${
                  darkMode ? 'bg-green-900/20 border border-green-800 text-green-400' : 'bg-green-100 border border-green-300 text-green-700'
                }`}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {t('jobMatching.form.resumeSelected', 'Selected resume')}: {
                      resumes.find(r => r.id == selectedResumeId)?.title || 
                      `${t('resume.title', 'Resume')} #${selectedResumeId}`
                    }
                  </span>
                </div>
              )}
            </div>
          )}
          
          {!resumesLoading && isAuthenticated && (!resumes || !Array.isArray(resumes) || resumes.length === 0) && (
            <div className={`p-3 rounded-lg border text-center ${
              darkMode ? 'bg-gray-700/30 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-600'
            }`}>
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium mb-1">{t('jobMatching.form.noSavedResumes', 'No saved resumes found')}</p>
              <p className="text-xs opacity-75">{t('jobMatching.form.createResumeFirst', 'Create your first resume to get started')}</p>
              <button
                onClick={() => window.location.href = '/resume-builder'}
                className="mt-2 px-3 py-1 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-md transition-all"
              >
                {t('jobMatching.form.createResume', 'Create Resume')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Status Banner */}
      <StatusBanner preferences={preferences} />

      {/* Quick Actions */}
      <QuickActions 
        setActiveTab={setActiveTab}
        jobMatchesCount={jobMatches.length}
      />

      {/* Tabs */}
      <JobSearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'search' && (
  <SearchTab
    manualSearch={manualSearch}
    setManualSearch={setManualSearch}
    runManualSearch={runManualSearch}
    searchResults={searchResults}
    loading={loading}
    selectedResumeId={selectedResumeId}
    userResumes={resumes}
    onResumeSelect={handleResumeSelect}
    setActiveTab={setActiveTab}
    onAnalyzeSelectedJobs={analyzeSelectedJobs}  // Add this new prop
  />
)}
      
      {activeTab === 'matches' && (
        <MatchesTab
          jobMatches={jobMatches}
          loadJobMatches={loadJobMatches}
          markJobViewed={markJobViewed}
          markJobApplied={markJobApplied}
          dismissJob={dismissJob}
        />
      )}
      
      {activeTab === 'preferences' && (
        <PreferencesTab
          preferencesForm={preferencesForm}
          setPreferencesForm={setPreferencesForm}
          savePreferences={savePreferences}
          loading={loading}
          userResumes={resumes}
          selectedResumeId={selectedResumeId}
          onResumeSelect={handleResumeSelect}
        />
      )}
      
      {activeTab === 'analytics' && (
        <AnalyticsTab analytics={analytics} />
      )}

      {/* Help Section */}
      <HelpSection />

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <details>
            <summary className="font-medium cursor-pointer">Debug Info</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify({ 
                authenticated: isAuthenticated,
                hasToken: !!token,
                preferences: preferences ? 'loaded' : 'not loaded',
                jobMatches: jobMatches.length,
                searchResults: searchResults ? 'available' : 'none',
                analytics: analytics ? 'loaded' : 'not loaded',
                selectedResumeId,
                resumesCount: resumes?.length || 0,
                manualSearchResumeId: manualSearch.resume_id,
                preferencesResumeId: preferencesForm.resume_id
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {process.env.NODE_ENV === 'development' && searchResults && (
  <button 
    onClick={debugSearchResults}
    className="mb-4 px-4 py-2 bg-yellow-500 text-white rounded"
  >
    Debug Search Results
  </button>
)}
    </div>
  );
};

export default JobSearchComponent;