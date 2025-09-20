import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  MessageCircle, 
  Award, 
  Zap, 
  BarChart2,
  Save,
  HardDrive,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useSessionStore from '../../../stores/sessionStore';
import API_BASE_URL, { CV_AI_ENDPOINTS } from '../../../config';

const CVAIEnhancement = ({ darkMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sessionToken, canSaveToCloud, saveLocally, saveToConnectedCloud } = useSessionStore();
  
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSections, setLoadingSections] = useState({});
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('initial');
  const [expandedSections, setExpandedSections] = useState({ summary: true });
  const [usageInfo, setUsageInfo] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const sections = [
    { id: 'summary', name: t('resume.personal_info.summary'), key: 'personal_info.summary' },
    { id: 'experiences', name: t('resume.experience.title'), key: 'experiences', items: true },
    { id: 'skills', name: t('resume.skills.title'), key: 'skills', items: true },
  ];
  
  const [suggestions, setSuggestions] = useState({
    summary: {},
    experiences: {},
    skills: {}
  });

  useEffect(() => {
    const loadCVData = () => {
      try {
        setIsLoading(true);
        
        let cvData = null;
        
        const aiDraft = localStorage.getItem('cv_draft_for_ai');
        if (aiDraft) {
          cvData = JSON.parse(aiDraft);
          console.log('📖 Loaded CV from AI draft');
        }
        
        if (!cvData) {
          const regularDraft = localStorage.getItem('cv_draft');
          if (regularDraft) {
            cvData = JSON.parse(regularDraft);
            console.log('📖 Loaded CV from regular draft');
          }
        }
        
        if (!cvData) {
          const customizerDraft = localStorage.getItem('cv_draft_for_customization');
          if (customizerDraft) {
            cvData = JSON.parse(customizerDraft);
            console.log('📖 Loaded CV from customizer draft');
          }
        }
        
        if (!cvData || !cvData.personal_info?.full_name) {
          setError(t('ai_enhancement.create_resume_first'));
          return;
        }
        
        setFormData(cvData);
        console.log('✅ CV loaded for AI enhancement:', cvData.title);
        
      } catch (error) {
        console.error('❌ Error loading CV data:', error);
        setError(t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCVData();
  }, [t]);

  const checkUsageLimit = async () => {
    if (!sessionToken) return;
    
    try {
      const response = await fetch(CV_AI_ENDPOINTS.USAGE_LIMIT, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
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
    if (sessionToken) {
      checkUsageLimit();
    }
  }, [sessionToken]);

  const saveEnhancedCV = async (saveToCloud = false) => {
    if (!formData) return;
    
    try {
      console.log('💾 Saving enhanced CV...');
      setIsLoading(true);
      
      const enhancedData = {
        ...formData,
        _ai_enhanced: {
          timestamp: Date.now(),
          sections_enhanced: Object.keys(suggestions).filter(key => Object.keys(suggestions[key]).length > 0)
        }
      };
      
      let result;
      
      if (saveToCloud && canSaveToCloud()) {
        result = await saveToConnectedCloud(enhancedData, 'google_drive');
      } else {
        result = await saveLocally(enhancedData);
      }
      
      if (result.success) {
        localStorage.setItem('cv_draft', JSON.stringify(enhancedData));
        localStorage.setItem('cv_draft_for_customization', JSON.stringify(enhancedData));
        localStorage.removeItem('cv_draft_for_ai');
        
        setHasUnsavedChanges(false);
        
        const successMessage = result.message || 
          (saveToCloud ? t('resume.actions.update_success') : t('resume.actions.save_success'));
        
        alert(successMessage);
        
        navigate('/my-resumes');
      } else {
        throw new Error(result.error || t('common.error'));
      }
      
    } catch (err) {
      console.error('❌ Error saving enhanced CV:', err);
      setError(`${t('common.error')}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const requestSectionEnhancement = async (sectionId) => {
    if (!formData) return;

    setLoadingSections(prev => ({ ...prev, [sectionId]: true }));

    try {
      let sectionData = {};

      if (sectionId === 'summary') {
        sectionData = {
          current_text: formData.personal_info?.summary || '',
          experiences: formData.experiences || []
        };
      } else if (sectionId === 'experiences') {
        if (formData.experiences && formData.experiences.length > 0) {
          sectionData = {
            experiences: formData.experiences.map(exp => ({
              company: exp.company || '',
              position: exp.position || '',
              description: exp.description || '',
              start_date: exp.start_date || '',
              end_date: exp.end_date || '',
              current: exp.current || false
            }))
          };
        } else {
          throw new Error(t('ai_enhancement.no_experiences'));
        }
      }

      if (!sessionToken) {
        throw new Error(t('settings.not_authenticated'));
      }

      const url = `${CV_AI_ENDPOINTS.IMPROVE_SECTION}?section=${sectionId}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify(sectionData)
      });

      if (!response.ok) {
        if (response.status === 429) {
          try {
            const errorData = await response.json();
            
            if (errorData.detail && typeof errorData.detail === 'object' && errorData.detail.error_code === 'AI_LIMIT_REACHED') {
              const { used_today, daily_limit, hours_until_reset } = errorData.detail;
              
              setError(
                t('ai.limit_reached', 
                  { 
                    used: used_today, 
                    limit: daily_limit, 
                    hours: hours_until_reset 
                  }
                )
              );
            } else {
              setError(t('ai.limit_reached_simple'));
            }
          } catch (parseError) {
            setError(t('ai.limit_reached_simple'));
          }
          setLoadingSections(prev => ({ ...prev, [sectionId]: false }));
          return;
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || t('ai_enhancement.error_message'));
        }
      }

      const taskData = await response.json();
      
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(taskData.check_status_url, {
            headers: {
              'Authorization': `Bearer ${sessionToken}`
            }
          });
          
          if (!statusResponse.ok) {
            clearInterval(pollInterval);
            throw new Error(t('ai_enhancement.error_message'));
          }
          
          const statusData = await statusResponse.json();
          
          if (statusData.status === 'completed') {
            clearInterval(pollInterval);
            
            const result = statusData.result;
            console.log(`Received suggestion for ${sectionId}:`, result);

            let processedSuggestions = {};

            if (sectionId === 'summary') {
              processedSuggestions = {
                main: extractImprovedText(result)
              };
            } else if (sectionId === 'experiences') {
              processedSuggestions = matchExperienceSuggestions(result, formData.experiences);
            }

            setSuggestions(prev => ({
              ...prev,
              [sectionId]: processedSuggestions
            }));

            setExpandedSections(prev => ({
              ...prev,
              [sectionId]: true
            }));
            
            setLoadingSections(prev => ({ ...prev, [sectionId]: false }));
          } 
          else if (statusData.status === 'failed') {
            clearInterval(pollInterval);
            throw new Error(statusData.error || t('ai_enhancement.error_message'));
          }
        } catch (error) {
          clearInterval(pollInterval);
          console.error(`Error checking section ${sectionId} status:`, error);
          setError(t('ai_enhancement.error_message'));
          setLoadingSections(prev => ({ ...prev, [sectionId]: false }));
        }
      }, 2000);
      
    } catch (error) {
      console.error(`Error enhancing section ${sectionId}:`, error);
      if (!error.message.includes('daily AI requests')) {
        setError(error.message || t('ai_enhancement.error_message'));
      }
      setLoadingSections(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const requestFullCVEnhancement = async () => {
    if (!formData) return;
    setStatus('loading');

    try {
      if (!sessionToken) {
        throw new Error(t('settings.not_authenticated'));
      }

      const response = await fetch(CV_AI_ENDPOINTS.IMPROVE_FULL_CV, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 429) {
          try {
            const errorData = await response.json();
            
            if (errorData.detail && typeof errorData.detail === 'object' && errorData.detail.error_code === 'AI_LIMIT_REACHED') {
              const { used_today, daily_limit, hours_until_reset } = errorData.detail;
              
              setError(
                t('ai.limit_reached', 
                  { 
                    used: used_today, 
                    limit: daily_limit, 
                    hours: hours_until_reset 
                  }
                )
              );
            } else {
              setError(t('ai.limit_reached_simple'));
            }
          } catch (parseError) {
            setError(t('ai.limit_reached_simple'));
          }
          setStatus('error');
          return;
        } else {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(t('ai_enhancement.error_message'));
        }
      }

      const result = await response.json();
      console.log("API response:", result);
        
      const newSuggestions = {
        summary: {},
        experiences: {},
        skills: {}
      };

      if (result.improvements?.summary?.main) {
        newSuggestions.summary = {
          main: result.improvements.summary.main
        };
      }

      if (result.improvements?.raw) {
        const experienceSuggestions = parseAIResponseAndDistributeBullets(
          result.improvements.raw,
          formData.experiences
        );

        if (Object.keys(experienceSuggestions).length > 0) {
          newSuggestions.experiences = experienceSuggestions;
        }
      } else if (result.improvements?.experiences) {
        newSuggestions.experiences = result.improvements.experiences;
      }

      if (result.improvements?.skills?.main) {
        newSuggestions.skills = {
          main: result.improvements.skills.main,
          parsed: result.improvements.skills.main.parsed
        };
      }

      console.log("Final processed suggestions:", newSuggestions);
      setSuggestions(newSuggestions);
      setStatus('success');

      const sectionsToExpand = {};
      Object.keys(newSuggestions).forEach(sectionId => {
        if (Object.keys(newSuggestions[sectionId]).length > 0) {
          sectionsToExpand[sectionId] = true;
        }
      });
      setExpandedSections(prev => ({
        ...prev,
        ...sectionsToExpand
      }));

    } catch (err) {
      console.error('Error enhancing full CV:', err);
      if (!err.message.includes('daily AI requests')) {
        setError(err.message || t('ai_enhancement.error_message'));
      }
      setStatus('error');
    }
  };

  const extractImprovedText = (result) => {
    if (result.improved_text) {
      return result.improved_text;
    } else if (result.raw) {
      return result.raw;
    } else if (typeof result === 'string') {
      return result;
    } else if (result.tasks_output && result.tasks_output.length > 0) {
      return result.tasks_output[0].raw || '';
    } else {
      try {
        return JSON.stringify(result, null, 2);
      } catch (e) {
        return t('ai_enhancement.error_message');
      }
    }
  };

  const matchExperienceSuggestions = (result, experiences) => {
    const suggestions = {};
    console.log("Matching experience suggestions:", result);

    if (result.experiences && Array.isArray(result.experiences)) {
      result.experiences.forEach((exp, index) => {
        if (index < experiences.length) {
          suggestions[`item_${index}`] = {
            original: experiences[index].description,
            improved: exp.improved_description || exp.description || '',
            position: experiences[index].position,
            company: experiences[index].company
          };
        }
      });

      if (Object.keys(suggestions).length > 0) {
        return suggestions;
      }
    }

    return suggestions;
  };

  const parseAIResponseAndDistributeBullets = (rawText, experiences) => {
    const suggestions = {};
    
    if (!rawText || experiences.length === 0) {
      return suggestions;
    }
    
    return suggestions;
  };

  const applySuggestion = (sectionId, itemKey = 'main') => {
    if (!formData || !suggestions[sectionId] || !suggestions[sectionId][itemKey]) return;

    const updatedFormData = JSON.parse(JSON.stringify(formData));

    if (!updatedFormData.personal_info) {
      updatedFormData.personal_info = {};
    }

    try {
      if (sectionId === 'summary' && itemKey === 'main') {
        updatedFormData.personal_info.summary = suggestions[sectionId][itemKey];
        setHasUnsavedChanges(true);
      } else if (sectionId === 'experiences') {
        const index = parseInt(itemKey.split('_')[1]);
        if (updatedFormData.experiences && updatedFormData.experiences[index]) {
          const actualBulletPoints = [];
          
          suggestions[sectionId][itemKey].improved.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('-') && 
                !trimmed.includes('**') && 
                !trimmed.includes('*') && 
                !trimmed.includes('(20')) {
              actualBulletPoints.push(trimmed.substring(trimmed.indexOf('-') + 1).trim());
            }
          });
          
          updatedFormData.experiences[index].description = actualBulletPoints.join('\n');
          setHasUnsavedChanges(true);
        }
      } 
      else if (sectionId === 'skills' && itemKey === 'main') {
        if (suggestions[sectionId][itemKey].parsed?.categories) {
          const groupedSkills = [];
          const MAX_SKILL_LENGTH = 50;
          
          Object.entries(suggestions[sectionId][itemKey].parsed.categories).forEach(([category, skills]) => {
            if (skills.length > 0) {
              let currentChunk = "";
              
              skills.forEach(skill => {
                const trimmedSkill = skill.trim();
                if (!trimmedSkill) return;
                
                const safeSkill = trimmedSkill.length > MAX_SKILL_LENGTH 
                  ? trimmedSkill.substring(0, MAX_SKILL_LENGTH - 3) + "..." 
                  : trimmedSkill;
                  
                if (currentChunk && (currentChunk.length + safeSkill.length + 2) > MAX_SKILL_LENGTH) {
                  groupedSkills.push({
                    name: currentChunk,
                    level: "Intermediate"
                  });
                  currentChunk = safeSkill;
                }
                else {
                  currentChunk = currentChunk 
                    ? currentChunk + ", " + safeSkill 
                    : safeSkill;
                }
              });
              
              if (currentChunk) {
                groupedSkills.push({
                  name: currentChunk,
                  level: "Intermediate"
                });
              }
            }
          });
          
          updatedFormData.skills = groupedSkills;
          setHasUnsavedChanges(true);
        }
      }

      setFormData(updatedFormData);
      
      setSuggestions(prev => {
        const updated = { ...prev };
        if (updated[sectionId]) {
          const updatedSection = { ...updated[sectionId] };
          delete updatedSection[itemKey];
          updated[sectionId] = updatedSection;
        }
        return updated;
      });
      
    } catch (error) {
      console.error("Error applying suggestion:", error);
    }
  };

  const rejectSuggestion = (sectionId, itemKey = 'main') => {
    setSuggestions(prev => {
      const updated = { ...prev };
      if (updated[sectionId]) {
        const updatedSection = { ...updated[sectionId] };
        delete updatedSection[itemKey];

        if (Object.keys(updatedSection).length === 0) {
          delete updated[sectionId];
        } else {
          updated[sectionId] = updatedSection;
        }
      }
      return updated;
    });
  };

  const toggleSectionExpansion = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleBackToBuilder = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        t('cloud.unsaved_changes_save_before_leaving', 'You have unsaved changes. Do you want to save before leaving?')
      );
      if (confirmLeave) {
        saveEnhancedCV(false);
        return;
      }
    }
    navigate('/new-resume');
  };

  const handleContinueToCustomizer = () => {
    if (formData) {
      localStorage.setItem('cv_draft_for_customization', JSON.stringify(formData));
    }
    navigate('/resume-customizer');
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen pt-14 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('ai_enhancement.loading', 'Loading CV for AI enhancement...')}
          </p>
        </div>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className={`flex items-center justify-center h-screen pt-14 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
        <div className={`text-center max-w-md p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm'}`}>
          <div className={`mx-auto mb-4 flex items-center justify-center w-12 h-12 rounded-full ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-red-500' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold mb-2">{t('common.error')}</h2>
          <p className="mb-4 text-sm">{error}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => navigate('/new-resume')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {t('resumeDashboard.buttons.createNew', 'Create New CV')}
            </button>
            <button
              onClick={() => navigate('/my-resumes')}
              className="px-4 py-2 rounded-full bg-gray-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {t('navigation.myResumes', 'My CVs')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-5xl mx-auto pt-14 px-4 pb-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 text-gray-800'}`}>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-24 w-48 h-48 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-24 left-24 w-48 h-48 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={handleBackToBuilder}
              className={`p-2 mr-3 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('ai_enhancement.title')}
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('ai_enhancement.enhancing', 'Enhancing')}: {formData?.personal_info?.full_name || formData?.title || t('cloud.your_cv', 'Your CV')}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {hasUnsavedChanges && (
              <div className={`flex items-center text-xs px-2 py-1 rounded ${
                darkMode ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
              }`}>
                <AlertCircle className="w-3 h-3 mr-1" />
                {t('cloud.unsaved_changes', 'Unsaved changes')}
              </div>
            )}
            
            <button
              onClick={() => saveEnhancedCV(false)}
              disabled={!formData}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-300 ${
                !formData
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                  : darkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/20 text-white'
              }`}
            >
              <HardDrive className="w-4 h-4 mr-2" />
              {t('cloud.save_locally', 'Save Locally')}
            </button>
            
            {canSaveToCloud() && (
              <button
                onClick={() => saveEnhancedCV(true)}
                disabled={!formData}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-300 ${
                  !formData
                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                    : darkMode
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg text-white'
                    : 'bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg hover:shadow-green-500/20 text-white'
                }`}
              >
                <Save className="w-4 h-4 mr-2" />
                {t('cloud.save_to_drive', 'Save to Drive')}
              </button>
            )}
          </div>
        </div>

        {usageInfo && (
          <div className={`mb-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('ai.limit_info', 'AI requests remaining: {{remaining}} of {{limit}}', {
              remaining: usageInfo.remaining,
              limit: usageInfo.limit
            })}
          </div>
        )}

        {error && (
          <div className={`mb-4 p-3 ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'} rounded-md text-sm`}>
            {error}
            <button
              onClick={() => setError(null)}
              className={`ml-2 ${darkMode ? 'text-red-200 hover:text-red-100' : 'text-red-800 hover:text-red-900'}`}
            >
              {t('common.dismiss')}
            </button>
          </div>
        )}

        <div className="mb-6 text-center">
          <button
            onClick={requestFullCVEnhancement} 
            disabled={status === 'loading'}
            className={`px-6 py-3 rounded-lg text-white flex items-center justify-center mx-auto gap-2 text-sm font-medium ${
              status === 'loading'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300'
            }`}
          >
            {status === 'loading' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                {t('common.enhancing')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t('ai_enhancement.enhance_all')}
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`border rounded-lg overflow-hidden ${
                darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200/50 bg-white/50 backdrop-blur-sm'
              }`}
            >
              <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50/50'}`}>
                <div className="flex items-center">
                  <h2 className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {section.name}
                  </h2>
                  {suggestions[section.id] && Object.keys(suggestions[section.id]).length > 0 && (
                    <span className={`ml-3 px-2 py-1 text-xs ${darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'} rounded-full`}>
                      {Object.keys(suggestions[section.id]).length} {t('common.ai_suggestions')}
                    </span>
                  )}
                  <button
                    onClick={() => toggleSectionExpansion(section.id)}
                    className={`ml-2 p-1 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    {expandedSections[section.id] ?
                      <ChevronUp className="w-4 h-4" /> :
                      <ChevronDown className="w-4 h-4" />
                    }
                  </button>
                </div>
                
                {!suggestions[section.id] && !loadingSections[section.id] && (
                  <button
                    onClick={() => requestSectionEnhancement(section.id)}
                    className="px-3 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-3 h-3" />
                    {t('common.enhance')}
                  </button>
                )}
                
                {loadingSections[section.id] && (
                  <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <RefreshCw className="w-3 h-3 animate-spin mr-2" />
                    {t('common.enhancing')}
                  </div>
                )}
              </div>

              {expandedSections[section.id] && (
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('ai_enhancement.current_content')}
                    </h3>

                    {section.id === 'summary' && (
                      <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {formData?.personal_info?.summary ? (
                          <p className="text-sm">{formData.personal_info.summary}</p>
                        ) : (
                          <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {t('common.no_summary')}
                          </p>
                        )}
                      </div>
                    )}

                    {section.id === 'experiences' && (
                      <div className={`rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {formData?.experiences?.length > 0 ? (
                          <div className="space-y-3 p-3">
                            {formData.experiences.map((exp, index) => {
                              const hasSuggestion = suggestions?.experiences && suggestions.experiences[`item_${index}`];

                              return (
                                <div key={index} className={`p-3 border rounded ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                                  <div className="text-sm font-medium">{exp.position} {t('common.at')} {exp.company}</div>
                                  <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {exp.start_date} - {exp.current ? t('common.tonow') : exp.end_date}
                                  </div>
                                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {exp.description || t('common.notSpecified')}
                                  </p>

                                  {hasSuggestion && (
                                    <div className={`mt-3 p-3 rounded ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-indigo-50 border-indigo-100'} border`}>
                                      <h4 className={`text-xs font-medium mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                                        {t('common.ai_suggestions')}
                                      </h4>

                                      <div className="text-sm mb-3">
                                        {suggestions.experiences[`item_${index}`].improved
                                          .split('\n')
                                          .filter(line => {
                                            const trimmed = line.trim();
                                            return trimmed.startsWith('-') && 
                                                  !trimmed.includes('**') && 
                                                  !trimmed.includes('*') && 
                                                  !trimmed.includes('(20');
                                          })
                                          .map((line, i) => {
                                            const content = line.substring(line.indexOf('-') + 1).trim();
                                            return (
                                              <div key={i} className="flex items-start mb-1">
                                                <span className="text-indigo-500 mr-2">•</span>
                                                <span>{content}</span>
                                              </div>
                                            );
                                          })
                                        }
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => applySuggestion('experiences', `item_${index}`)}
                                          className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded flex items-center"
                                        >
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          {t('common.apply')}
                                        </button>
                                        <button
                                          onClick={() => rejectSuggestion('experiences', `item_${index}`)}
                                          className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded flex items-center"
                                        >
                                          <XCircle className="w-3 h-3 mr-1" />
                                          {t('common.reject')}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className={`text-sm p-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {t('ai_enhancement.no_experiences')}
                          </p>
                        )}
                      </div>
                    )}

                    {section.id === 'skills' && (
                      <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {formData?.skills?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                              <div
                                key={index}
                                className={`text-sm px-3 py-1 rounded ${
                                  darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {skill.name}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {t('ai_enhancement.no_skills', 'No skills added yet')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {(section.id === 'summary' || section.id === 'skills') && suggestions[section.id]?.main && (
                    <div className="space-y-3">
                      <h3 className={`text-sm font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-500'} flex items-center`}>
                        <Sparkles className="w-3 h-3 mr-1" />
                        {t('common.ai_suggestions')}
                      </h3>

                      <div className={`border rounded-md p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-200'}`}>
                        <div className={`text-sm ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} p-3 rounded border ${darkMode ? 'border-gray-600' : 'border-indigo-100'}`}>
                          {section.id === 'skills' && suggestions[section.id].main.parsed?.categories ? (
                            <div className="space-y-2">
                              {Object.entries(suggestions[section.id].main.parsed.categories).map(([category, skills]) => (
                                <div key={category}>
                                  <h4 className="text-sm font-medium mb-1">{category}</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {skills.map((skill, idx) => (
                                      <span 
                                        key={idx} 
                                        className={`text-xs px-2 py-1 rounded ${
                                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                        }`}
                                      >
                                        {skill.trim()}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p>{suggestions[section.id].main}</p>
                          )}
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => applySuggestion(section.id, 'main')}
                            className="px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors flex items-center"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {t('common.apply')}
                          </button>
                          <button
                            onClick={() => rejectSuggestion(section.id, 'main')}
                            className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            {t('common.reject')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleBackToBuilder}
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 hover:shadow-lg' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800 hover:shadow-md'
            }`}
          >
            {t('common.back_to_editor')}
          </button>
          
          <div className="flex gap-3">
            {hasUnsavedChanges && (
              <button
                onClick={() => saveEnhancedCV(false)}
                className="px-4 py-2 text-sm rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {t('resume.actions.save_changes')}
              </button>
            )}
            
            <button
              onClick={handleContinueToCustomizer}
              className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
            >
              {t('common.choose_your_templates')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVAIEnhancement;