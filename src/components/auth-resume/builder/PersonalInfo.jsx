import React, { useState } from 'react';
import { Sparkles, CheckCircle, XCircle, RotateCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import API_BASE_URL, { CV_AI_ENDPOINTS } from '../../../config';

const PersonalInfo = ({ darkMode, data = {}, onChange, token }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [summaryImprovement, setSummaryImprovement] = useState(null);
  const [error, setError] = useState(null);

  const RequiredLabel = ({ children }) => (
    <label className={`block text-xs font-medium mb-1 ${
      darkMode ? 'text-white' : 'text-gray-800'
    }`}>
      {children} <span className="text-red-500">*</span>
    </label>
  );

  const OptionalLabel = ({ children }) => (
    <label className={`block text-xs font-medium mb-1 ${
      darkMode ? 'text-gray-400' : 'text-gray-600'
    }`}>
      {children}
    </label>
  );

  const inputClasses = `w-full px-2 py-1.5 text-sm rounded-md border focus:ring-2 focus:ring-purple-500/50 transition-all ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300'
  }`;

  const safeData = {
    full_name: data.full_name || '',
    title: data.title || '',
    email: data.email || '',
    mobile: data.mobile || '',
    city: data.city || '',
    address: data.address || '',
    postal_code: data.postal_code || '',
    driving_license: data.driving_license || '',
    nationality: data.nationality || '',
    place_of_birth: data.place_of_birth || '',
    date_of_birth: data.date_of_birth || '',
    linkedin: data.linkedin || '',
    website: data.website || '',
    summary: data.summary || ''
  };

  const handleChange = (field, value) => {
    // Log the values being updated
    //console.log(`Updating ${field} to:`, value);
    
    // Create the updated data object
    const updatedData = {
      ...safeData,  // Include all existing fields
      [field]: value // Update just the changed field
    };
    
    // Log the complete object being sent to parent
    //console.log("Updated personal info:", updatedData);
    
    // Send the updated object to the parent component
    onChange(updatedData);
  };
 
   

const improveSummary = async () => {
  if (!safeData.summary) {
    setError(t('newresume.personal_info.summary_error', "Please add some text to your summary first"));
    return;
  }

  setIsLoading(true);
  setError(null);
  
  try {
    // Initial request to start the background task
    //Sconst response = await fetch(`${API_BASE_URL}/cv-ai/improve-section?section=summary`, {
      // Instead of direct URL, use the config:
const response = await fetch(`http://localhost:8000/cv-ai/improve-section?section=summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        current_text: safeData.summary,
        experiences: []
      })
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        // Handle rate limiting specifically
        try {
          const errorData = await response.json();
          
          if (errorData.detail && typeof errorData.detail === 'object' && errorData.detail.error_code === 'AI_LIMIT_REACHED') {
            // Handle structured error response
            const { used_today, daily_limit, hours_until_reset } = errorData.detail;
            
            setError(
              t('ai.limit_reached', 
                "You've used {{used}} of {{limit}} daily AI requests. Please try again in {{hours}} hours.", 
                { 
                  used: used_today, 
                  limit: daily_limit, 
                  hours: hours_until_reset 
                }
              )
            );
          } else {
            // Handle old format or string error
            setError(
              t('ai.limit_reached_simple', 
                "Daily AI limit reached. Please try again tomorrow."
              )
            );
          }
        } catch (parseError) {
          // If JSON parsing fails, use default message
          setError(
            t('ai.limit_reached_simple', 
              "Daily AI limit reached. Please try again tomorrow."
            )
          );
        }
      } else {
        // Handle other errors
        const errorText = await response.text();
        console.error('Server error details:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      setIsLoading(false);
      return; // Don't proceed further if there's an error
    }
    
    // Get the task ID and status URL from the response
    const taskData = await response.json();
    console.log('Task started:', taskData);
    
    // Start polling for the result
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await fetch(taskData.check_status_url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!statusResponse.ok) {
          clearInterval(pollInterval);
          throw new Error(t('newresume.personal_info.ai_error', 'Failed to check task status. Please try again.'));
        }
        
        const statusData = await statusResponse.json();
        console.log('Task status:', statusData);
        
        if (statusData.status === 'completed') {
          // Task completed successfully
          clearInterval(pollInterval);
          
          // Extract the improved text from the result
          const result = statusData.result;
          let improvedText = '';
          
          if (result.improved_text) {
            improvedText = result.improved_text;
          } else if (result.raw) {
            improvedText = result.raw;
          } else if (typeof result === 'string') {
            improvedText = result;
          } else {
            // Fallback: try to stringify the result
            improvedText = JSON.stringify(result);
          }
          
          setSummaryImprovement(improvedText);
          setIsLoading(false);
          
        } else if (statusData.status === 'failed') {
          // Task failed
          clearInterval(pollInterval);
          const errorMessage = statusData.error || t('newresume.personal_info.ai_error', 'AI processing failed. Please try again.');
          setError(errorMessage);
          setIsLoading(false);
          
        } else if (statusData.status === 'processing') {
          // Task still processing, keep polling
          console.log('Task still processing...');
        } else {
          // Unknown status
          console.warn('Unknown task status:', statusData.status);
        }
        
      } catch (pollError) {
        // Error while polling for status
        clearInterval(pollInterval);
        console.error('Error checking task status:', pollError);
        setError(pollError.message || t('newresume.personal_info.ai_error', 'Failed to get AI suggestions. Please try again.'));
        setIsLoading(false);
      }
    }, 2000); // Check every 2 seconds
    
    // Set a timeout to stop polling after 2 minutes (120 seconds)
    setTimeout(() => {
      clearInterval(pollInterval);
      if (isLoading) {
        setError(t('newresume.personal_info.timeout_error', 'Request timed out. Please try again.'));
        setIsLoading(false);
      }
    }, 120000); // 2 minutes timeout
    
  } catch (err) {
    console.error('Error getting AI suggestions:', err);
    if (!error) { // Only set error if not already set by rate limiting
      setError(err.message || t('newresume.personal_info.ai_error', 'Failed to get AI suggestions. Please try again.'));
    }
    setIsLoading(false);
  }
};
 
  const applySummaryImprovement = () => {
    if (summaryImprovement) {
      // Make sure we're applying a string
      const textToApply = typeof summaryImprovement === 'string' 
        ? summaryImprovement 
        : (summaryImprovement.raw || JSON.stringify(summaryImprovement));
        
      handleChange('summary', textToApply);
      setSummaryImprovement(null); // Reset after applying
    }
  };

  return (
    <div className={`p-4 rounded-2xl border ${
      darkMode 
        ? 'border-gray-600 bg-gray-800/50' 
        : 'border-purple-500/10 bg-purple-500/5'
    } space-y-3 transition-all duration-300 hover:shadow-lg ${
      darkMode 
        ? 'hover:shadow-purple-500/5' 
        : 'hover:shadow-purple-500/10'
    } hover:-translate-y-0.5`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-sm font-semibold ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {t('resume.personal_info.title', 'Personal Information')}
        </h3>
        <span className={`text-xs ${
          darkMode ? 'text-red-400' : 'text-red-500'
        }`}>
          {t('common.required_fields', '* Required fields')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <RequiredLabel>{t('resume.personal_info.full_name', 'Full Name')}</RequiredLabel>
          <input
            type="text"
            value={safeData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.full_name_placeholder', 'John Doe')}
            required
            maxLength={100}
          />
        </div>

        <div>
          <RequiredLabel>{t('resume.personal_info.email', 'Email')}</RequiredLabel>
          <input
            type="email"
            value={safeData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.email_placeholder', 'john@example.com')}
            required
          />
        </div>

        <div>
          <RequiredLabel>{t('resume.personal_info.mobile', 'Mobile')}</RequiredLabel>
          <input
            type="tel"
            value={safeData.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.mobile_placeholder', '+1 (123) 456-7890')}
            required
            minLength={5}
            maxLength={20}
          />
        </div>

        <div>
          <OptionalLabel>{t('resume.personal_info.title_field', 'Professional Title')}</OptionalLabel>
          <input
            type="text"
            value={safeData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.title_placeholder', 'Software Engineer')}
            maxLength={100}
          />
        </div>

        <div>
          <OptionalLabel>{t('resume.personal_info.city', 'City')}</OptionalLabel>
          <input
            type="text"
            value={safeData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.city_placeholder', 'New York')}
            maxLength={100}
          />
        </div>

        <div>
          <OptionalLabel>{t('resume.personal_info.address', 'Address')}</OptionalLabel>
          <input
            type="text"
            value={safeData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.address_placeholder', '123 Main St')}
            maxLength={200}
          />
        </div>

        <div>
          <OptionalLabel>{t('resume.personal_info.postal_code', 'Postal Code')}</OptionalLabel>
          <input
            type="text"
            value={safeData.postal_code}
            onChange={(e) => handleChange('postal_code', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.postal_code_placeholder', '12345')}
            maxLength={20}
          />
        </div>

        <div>
          <OptionalLabel>{t('resume.personal_info.nationality', 'Nationality')}</OptionalLabel>
          <input
            type="text"
            value={safeData.nationality}
            onChange={(e) => handleChange('nationality', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.nationality_placeholder', 'e.g., American')}
            maxLength={50}
          />
        </div>

        <div>
          <OptionalLabel>{t('resume.personal_info.driving_license', 'Driving License')}</OptionalLabel>
          <input
            type="text"
            value={safeData.driving_license}
            onChange={(e) => handleChange('driving_license', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.driving_license_placeholder', 'e.g., Class B')}
            maxLength={50}
          />
        </div>

        <div>
          <OptionalLabel>{t('resume.personal_info.place_of_birth', 'Place of Birth')}</OptionalLabel>
          <input
            type="text"
            value={safeData.place_of_birth}
            onChange={(e) => handleChange('place_of_birth', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.place_of_birth_placeholder', 'City, Country')}
            maxLength={100}
          />
        </div>

        <div>
          <OptionalLabel>{t('resume.personal_info.date_of_birth', 'Date of Birth')}</OptionalLabel>
          <input
            type="date"
            value={safeData.date_of_birth}
            onChange={(e) => handleChange('date_of_birth', e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <OptionalLabel>{t('resume.personal_info.linkedin', 'LinkedIn')}</OptionalLabel>
          <input
            type="url"
            value={safeData.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.linkedin_placeholder', 'linkedin.com/in/johndoe')}
            maxLength={200}
          />
        </div>

        <div>
          <OptionalLabel>{t('resume.personal_info.website', 'Website')}</OptionalLabel>
          <input
            type="url"
            value={safeData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className={inputClasses}
            placeholder={t('resume.personal_info.website_placeholder', 'yourwebsite.com')}
            maxLength={200}
          />
        </div>
      </div>

      <div className="col-span-2">
        <div className="flex justify-between items-center">
          <OptionalLabel>{t('resume.personal_info.summary', 'Professional Summary')}</OptionalLabel>
          
          {/* AI Improvement Button */}
          {safeData.summary && !summaryImprovement && !isLoading && (
            <button
              onClick={improveSummary}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105`}
              disabled={isLoading}
            >
              <Sparkles size={12} />
              {t('newresume.personal_info.improve_ai', 'Improve with AI')}
            </button>
          )}
          
          {isLoading && (
            <div className={`flex items-center gap-1 text-xs ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              <RotateCw size={12} className="animate-spin" />
              {t('newresume.personal_info.generating', 'Generating suggestions...')}
            </div>
          )}
        </div>
        
        <textarea
          value={safeData.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows="3"
          className={inputClasses}
          placeholder={t('resume.personal_info.summary_placeholder', 'Brief overview of your professional background...')}
          maxLength={2000}
        />
        <div className={`text-xs mt-0.5 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {t('common.max_chars', 'Maximum {{count}} characters', { count: 2000 })}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="text-xs text-red-500 mt-1">
            {error}
          </div>
        )}
        
        {/* AI Improvement Suggestion */}
        {summaryImprovement && (
          <div className={`mt-3 p-3 border rounded-xl ${
            darkMode 
              ? 'bg-gray-700/50 border-gray-600' 
              : 'bg-white/50 border-purple-500/10'
          } transition-all duration-300 shadow-md`}>
            <h4 className={`text-xs font-medium mb-2 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {t('newresume.personal_info.ai_suggestion', 'AI Suggested Improvement:')}
            </h4>
            <p className={`text-sm mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {typeof summaryImprovement === 'string' 
                ? summaryImprovement 
                : JSON.stringify(summaryImprovement)}
            </p>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSummaryImprovement(null)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <XCircle size={12} />
                {t('newresume.personal_info.discard', 'Discard')}
              </button>
              
              <button
                onClick={applySummaryImprovement}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:scale-105`}
              >
                <CheckCircle size={12} />
                {t('newresume.personal_info.apply_suggestion', 'Apply Suggestion')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;