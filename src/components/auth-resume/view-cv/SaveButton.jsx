import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../../stores/authStore';
import API_BASE_URL from '../../../config';
import { Save } from 'lucide-react';

const SaveButton = ({
  formData,
  darkMode = false,
  isSaving,
  setIsSaving,
  showToast,
  isLocalDraft = false,
  forceCreate = false,
  userIsAuthenticated = false,
  onLoginRequired = () => {}
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hasExistingResume, setHasExistingResume] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState(null);

  // Check if the resume exists or if we're creating a new one
  useEffect(() => {
    const checkExistingResume = async () => {
      try {
        setIsLoading(true);
        const token = useAuthStore.getState().token;
        
        if (!token || forceCreate) {
          setHasExistingResume(false);
          setIsLoading(false);
          return;
        }
        
        // Check if the form data already has an ID (means we're editing)
        if (formData && formData.id) {
          setHasExistingResume(true);
          setResumeId(formData.id);
        } else {
          setHasExistingResume(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking for existing resume:', error);
        setHasExistingResume(false);
        setIsLoading(false);
      }
    };
    
    checkExistingResume();
  }, [formData, forceCreate]);

  // ======== Helper Functions ========

  // Check if the user has entered real data (not sample data)
  const hasUserEnteredData = (data) => {
    if (!data || !data.personal_info) return false;
    
    const personalInfo = data.personal_info;
    
    // Check if we're viewing the default sample data
    const isSampleData = 
      personalInfo.full_name === "John Smith" && 
      personalInfo.email === "john.smith@example.com" &&
      personalInfo.mobile === "+1 (123) 456-7890";
    
    if (isSampleData) return false;
    
    // Check if essential fields have been filled
    if (personalInfo.full_name && personalInfo.full_name.trim() !== '') return true;
    if (personalInfo.email && personalInfo.email.trim() !== '') return true;
    if (personalInfo.mobile && personalInfo.mobile.trim() !== '') return true;
    
    // Check other sections
    if (data.experiences?.some(exp => exp?.company && exp.company.trim() !== '')) return true;
    if (data.educations?.some(edu => edu?.institution && edu.institution.trim() !== '')) return true;
    if (data.skills?.some(skill => skill?.name && skill.name.trim() !== '')) return true;
    
    return false;
  };

  // Format dates properly
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    
    // Handle YYYY-MM format
    if (typeof dateStr === 'string' && /^\d{4}-\d{2}$/.test(dateStr)) {
      return `${dateStr}-01`;
    }
    
    // Handle YYYY-MM-DD format
    if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    } catch (e) {
      console.error('Error formatting date:', e);
      return null;
    }
  };

  // Format dates in arrays
  const formatDatesInArray = (array, dateFields) => {
    if (!array || !Array.isArray(array)) return [];
    
    return array.map(item => {
      const newItem = { ...item };
      
      dateFields.forEach(field => {
        if (newItem[field]) {
          if (typeof newItem[field] === 'string' && /^\d{4}-\d{2}$/.test(newItem[field])) {
            newItem[field] = `${newItem[field]}-01`;
          } else if (typeof newItem[field] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(newItem[field])) {
            // Already formatted correctly
          } else {
            try {
              const date = new Date(newItem[field]);
              newItem[field] = !isNaN(date.getTime()) ? 
                date.toISOString().split('T')[0] : null;
            } catch (e) {
              newItem[field] = null;
            }
          }
        } else {
          newItem[field] = null;
        }
      });
      
      return newItem;
    });
  };

  // Validate required fields
  const validateRequiredFields = (data) => {
    const errors = [];
    const personalInfo = data.personal_info || {};
    
    // Check personal info
    if (!personalInfo.full_name || personalInfo.full_name.trim() === '') {
      errors.push("Full name is required");
    }
    
    if (!personalInfo.email || personalInfo.email.trim() === '') {
      errors.push("Email address is required");
    } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      errors.push("Please enter a valid email address");
    }
    
    if (!personalInfo.mobile || personalInfo.mobile.trim().length < 5) {
      errors.push("Mobile number is required (min 5 characters)");
    }
    
    return errors.length > 0 ? errors : null;
  };

  // Check if sections are partially filled
  const validateArraySections = (data) => {
    const errors = [];
    
    // Check references
    if (data.referrals && Array.isArray(data.referrals)) {
      data.referrals.forEach((ref, index) => {
        // If the user has started filling this reference
        if (ref && Object.values(ref).some(val => val && typeof val === 'string' && val.trim() !== '')) {
          if (!ref.name || ref.name.trim() === '') {
            errors.push(`Reference #${index + 1}: Name is required`);
          }
          if (!ref.relation || ref.relation.trim() === '') {
            errors.push(`Reference #${index + 1}: Relation is required`);
          }
          if (ref.email && ref.email.trim() !== '' && !/\S+@\S+\.\S+/.test(ref.email)) {
            errors.push(`Reference #${index + 1}: Invalid email format`);
          }
        }
      });
    }
    
    // Check experiences
    if (data.experiences && Array.isArray(data.experiences)) {
      data.experiences.forEach((exp, index) => {
        if (exp && Object.values(exp).some(val => val && typeof val === 'string' && val.trim() !== '')) {
          if (!exp.company || exp.company.trim() === '') {
            errors.push(`Experience #${index + 1}: Company name is required`);
          }
          if (!exp.position || exp.position.trim() === '') {
            errors.push(`Experience #${index + 1}: Position is required`);
          }
          if (!exp.start_date) {
            errors.push(`Experience #${index + 1}: Start date is required`);
          }
        }
      });
    }
    
    // Check education
    if (data.educations && Array.isArray(data.educations)) {
      data.educations.forEach((edu, index) => {
        if (edu && Object.values(edu).some(val => val && typeof val === 'string' && val.trim() !== '')) {
          if (!edu.institution || edu.institution.trim() === '') {
            errors.push(`Education #${index + 1}: Institution name is required`);
          }
          if (!edu.degree || edu.degree.trim() === '') {
            errors.push(`Education #${index + 1}: Degree is required`);
          }
          if (!edu.field_of_study || edu.field_of_study.trim() === '') {
            errors.push(`Education #${index + 1}: Field of study is required`);
          }
          if (!edu.start_date) {
            errors.push(`Education #${index + 1}: Start date is required`);
          }
        }
      });
    }
    
    // Check languages
    if (data.languages && Array.isArray(data.languages)) {
      data.languages.forEach((lang, index) => {
        if (lang && Object.values(lang).some(val => val && typeof val === 'string' && val.trim() !== '')) {
          const hasName = (lang.language && lang.language.trim() !== '') || 
                         (lang.name && lang.name.trim() !== '');
          const hasLevel = (lang.proficiency && lang.proficiency.trim() !== '') || 
                          (lang.level && lang.level.trim() !== '');
          
          if (!hasName) {
            errors.push(`Language #${index + 1}: Language name is required`);
          }
          if (!hasLevel) {
            errors.push(`Language #${index + 1}: Proficiency level is required`);
          }
        }
      });
    }
    
    // Check internships
    if (data.internships && Array.isArray(data.internships)) {
      data.internships.forEach((internship, index) => {
        if (internship && Object.values(internship).some(val => val && typeof val === 'string' && val.trim() !== '')) {
          if (!internship.company || internship.company.trim() === '') {
            errors.push(`Internship #${index + 1}: Company name is required`);
          }
          if (!internship.position || internship.position.trim() === '') {
            errors.push(`Internship #${index + 1}: Position is required`);
          }
          if (!internship.start_date) {
            errors.push(`Internship #${index + 1}: Start date is required`);
          }
        }
      });
    }
    
    return errors.length > 0 ? errors : null;
  };

  // Fix photo field
  const preparePhotoField = () => {
    // Handle multiple photo format options
    if (formData.photos && typeof formData.photos === 'object' && formData.photos.photolink !== undefined) {
      return { photolink: formData.photos.photolink || '' };
    }
    
    if (formData.photo && typeof formData.photo === 'object' && formData.photo.photolink !== undefined) {
      return { photolink: formData.photo.photolink || '' };
    }
    
    if (Array.isArray(formData.photos) && formData.photos.length > 0) {
      if (formData.photos[0].photo) {
        return { photolink: formData.photos[0].photo || '' };
      }
      if (formData.photos[0].photolink) {
        return { photolink: formData.photos[0].photolink || '' };
      }
    }
    
    return { photolink: '' };
  };

  // Prepare data for submission
  const prepareDataForSubmission = () => {
    const personalInfo = formData.personal_info || {};
    
    return {
      title: formData.title || "My Resume",
      is_public: formData.is_public !== undefined ? formData.is_public : false,
      personal_info: {
        full_name: personalInfo.full_name?.trim() || '',
        email: personalInfo.email?.trim() || '',
        mobile: personalInfo.mobile?.trim() || '',
        title: personalInfo.title || '',
        address: personalInfo.address || '',
        city: personalInfo.city || '',
        postal_code: personalInfo.postal_code || '',
        driving_license: personalInfo.driving_license || '',
        nationality: personalInfo.nationality || '',
        place_of_birth: personalInfo.place_of_birth || '',
        date_of_birth: personalInfo.date_of_birth ? formatDate(personalInfo.date_of_birth) : null,
        linkedin: personalInfo.linkedin || '',
        website: personalInfo.website || '',
        summary: personalInfo.summary || ''
      },
      
      // Clean and format each section
      educations: formatDatesInArray(
        (formData.educations || [])
          .filter(e => e && (e.institution || e.degree || e.field_of_study)), 
        ['start_date', 'end_date']
      ),
      
      experiences: formatDatesInArray(
        (formData.experiences || [])
          .filter(e => e && (e.company || e.position)), 
        ['start_date', 'end_date']
      ),
      
      skills: (formData.skills || [])
        .filter(s => s && s.name && s.name.trim() !== '')
        .map(s => ({
          ...s,
          name: s.name.trim(),
          level: s.level || ''
        })),
      
      languages: (formData.languages || [])
        .filter(l => 
          (l && l.language && l.language.trim() !== '') || 
          (l && l.name && l.name.trim() !== '')
        )
        .map(l => ({
          id: l.id,
          language: (l.language || l.name || '').trim(),
          proficiency: (l.proficiency || l.level || '').trim()
        })),
      
      referrals: (formData.referrals || [])
        .filter(r => r && r.name && r.name.trim() !== '')
        .map(r => ({
          ...r,
          name: r.name.trim(),
          relation: r.relation?.trim() || 'Professional',
          phone: r.phone || '',
          email: r.email || ''
        })),
      
      custom_sections: (formData.custom_sections || [])
        .filter(s => s && s.title && s.title.trim() !== '')
        .map(s => ({
          ...s,
          title: s.title.trim(),
          content: s.content || ''
        })),
      
      extracurriculars: (formData.extracurriculars || [])
        .filter(e => e && (e.name || e.title) && (e.name || e.title).trim() !== '')
        .map(e => ({
          id: e.id,
          name: (e.name || e.title || '').trim(),
          description: e.description || ''
        })),
      
      hobbies: (formData.hobbies || [])
        .filter(h => h && h.name && h.name.trim() !== '')
        .map(h => ({
          ...h,
          name: h.name.trim()
        })),
      
      courses: (formData.courses || [])
        .filter(c => c && c.name && c.name.trim() !== '')
        .map(c => ({
          ...c,
          name: c.name.trim(),
          institution: c.institution || '',
          description: c.description || ''
        })),
      
      internships: formatDatesInArray(
        (formData.internships || [])
          .filter(i => i && (i.company || i.position)), 
        ['start_date', 'end_date']
      ),
      
      customization: formData.customization || {
        template: "stockholm",
        accent_color: "#1a5276",
        font_family: "Helvetica, Arial, sans-serif",
        line_spacing: 1.5,
        headings_uppercase: false,
        hide_skill_level: false
      },
      
      photo: preparePhotoField()
    };
  };

  // Format API errors
  const formatApiErrors = (responseText) => {
    let errorData;
    try {
      errorData = JSON.parse(responseText);
    } catch (e) {
      errorData = { detail: responseText };
    }
    
    const errors = [];
    
    // Handle different error formats
    if (errorData.detail && Array.isArray(errorData.detail)) {
      errorData.detail.forEach(err => {
        if (err.loc && Array.isArray(err.loc)) {
          // Try to get section name and index for array items
          let message = err.msg;
          
          try {
            // Handle array item errors (common pattern)
            if (err.loc.some(part => /^\d+$/.test(part))) {
              const sections = {
                'educations': 'Education',
                'experiences': 'Experience',
                'languages': 'Language',
                'skills': 'Skill',
                'referrals': 'Reference',
                'internships': 'Internship',
                'hobbies': 'Hobby'
              };
              
              let sectionName = "Item";
              let index = -1;
              let fieldName = '';
              
              // Find the section and index
              for (let i = 0; i < err.loc.length; i++) {
                // Find the section type
                if (typeof err.loc[i] === 'string' && sections[err.loc[i]]) {
                  sectionName = sections[err.loc[i]];
                }
                
                // Find the index
                if (/^\d+$/.test(err.loc[i])) {
                  index = parseInt(err.loc[i]);
                }
                
                // Find the field name
                if (i === err.loc.length - 1 && typeof err.loc[i] === 'string') {
                  fieldName = err.loc[i].replace(/_/g, ' ');
                }
              }
              
              // Format the message
              if (index >= 0) {
                if (err.msg === "Field required") {
                  message = `${sectionName} #${index + 1}: ${fieldName} is required`;
                } else {
                  message = `${sectionName} #${index + 1}: ${fieldName} - ${err.msg}`;
                }
              }
            }
          } catch (e) {
            // Fallback: Just use the original message
            console.error('Error parsing API error location:', e);
          }
          
          errors.push(message);
        } else {
          errors.push(err.msg);
        }
      });
    } else if (typeof errorData.detail === 'string') {
      errors.push(errorData.detail);
    } else if (typeof errorData.detail === 'object') {
      // Handle nested error objects
      for (const [field, message] of Object.entries(errorData.detail)) {
        errors.push(`${field}: ${message}`);
      }
    } else {
      errors.push('Unknown error occurred');
    }
    
    return errors;
  };

  // ======== Main Functions ========

  // Create a new resume
  const handleCreateResume = async () => {
    // Check authentication
    if (!userIsAuthenticated) {
      showToast(t('settings.not_authenticated', 'You must be logged in'), 'info');
      onLoginRequired();
      return;
    }
    
    try {
      setIsSaving(true);
      const token = useAuthStore.getState().token;
      
      if (!token) {
        throw new Error(t('settings.not_authenticated', 'You must be logged in'));
      }
      
      // Check if user has entered data
      if (!hasUserEnteredData(formData)) {
        showToast(t('validation.no_data_entered', 'Please enter your information before saving'), 'error');
        setValidationErrors([{
          field: 'personal_info',
          message: t('validation.no_data_entered', 'Please enter your information before saving')
        }]);
        setIsSaving(false);
        return;
      }
      
      // Validate required fields
      const basicErrors = validateRequiredFields(formData);
      if (basicErrors) {
        setValidationErrors(
          basicErrors.map(msg => ({
            field: msg.toLowerCase().includes('name') ? 'full_name' : 
                  msg.toLowerCase().includes('email') ? 'email' : 'mobile',
            message: msg
          }))
        );
        showToast(`Please fix the following: ${basicErrors.join(", ")}`, 'error');
        setIsSaving(false);
        return;
      }
      
      // Validate array sections
      const sectionErrors = validateArraySections(formData);
      if (sectionErrors) {
        setValidationErrors(
          sectionErrors.map(msg => ({
            field: 'section_validation',
            message: msg
          }))
        );
        showToast(`Please fix the following: ${sectionErrors[0]}${sectionErrors.length > 1 ? ` and ${sectionErrors.length - 1} more issues` : ''}`, 'error');
        setIsSaving(false);
        return;
      }
      
      // Clear validation errors
      setValidationErrors(null);
      
      // Prepare data for submission
      const dataToSubmit = prepareDataForSubmission();
      
      // Submit data
      const response = await fetch(`${API_BASE_URL}/resume/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });
      
      if (!response.ok) {
        const responseText = await response.text();
        console.error("API error response:", responseText);
        
        const errors = formatApiErrors(responseText);
        throw new Error(`${t('CoverLetter.errors.requiredFields')}:\n• ${errors.join('\n• ')}`);
      }
      
      // Success
      await response.json();
      showToast(t('resume.actions.create_success'), 'success');
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/my-resumes');
      }, 1500);
    } catch (error) {
      console.error('Error creating resume:', error);
      showToast(`${t('common.error')}: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Update an existing resume
  const handleUpdateResume = async () => {
    // Check authentication
    if (!userIsAuthenticated) {
      showToast(t('settings.not_authenticated', 'You must be logged in'), 'info');
      onLoginRequired();
      return;
    }
    
    try {
      setIsSaving(true);
      const token = useAuthStore.getState().token;
      
      if (!token) {
        throw new Error(t('settings.not_authenticated', 'You must be logged in'));
      }
      
      // Check resume ID
      if (!resumeId && !formData.id) {
        throw new Error(t('resume.no_id', 'No resume ID found for update'));
      }
      
      const id = resumeId || formData.id;
      
      // Check if user has entered data
      if (!hasUserEnteredData(formData)) {
        showToast(t('validation.no_data_entered', 'Please enter your information before saving'), 'error');
        setValidationErrors([{
          field: 'personal_info',
          message: t('validation.no_data_entered', 'Please enter your information before saving')
        }]);
        setIsSaving(false);
        return;
      }
      
      // Validate required fields
      const basicErrors = validateRequiredFields(formData);
      if (basicErrors) {
        setValidationErrors(
          basicErrors.map(msg => ({
            field: msg.toLowerCase().includes('name') ? 'full_name' : 
                  msg.toLowerCase().includes('email') ? 'email' : 'mobile',
            message: msg
          }))
        );
        showToast(`Please fix the following: ${basicErrors.join(", ")}`, 'error');
        setIsSaving(false);
        return;
      }
      
      // Validate array sections
      const sectionErrors = validateArraySections(formData);
      if (sectionErrors) {
        setValidationErrors(
          sectionErrors.map(msg => ({
            field: 'section_validation',
            message: msg
          }))
        );
        showToast(`Please fix the following: ${sectionErrors[0]}${sectionErrors.length > 1 ? ` and ${sectionErrors.length - 1} more issues` : ''}`, 'error');
        setIsSaving(false);
        return;
      }
      
      // Clear validation errors
      setValidationErrors(null);
      
      // Prepare data for submission
      const dataToSubmit = prepareDataForSubmission();
      
      // Submit data
      const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });
      
      if (!response.ok) {
        const responseText = await response.text();
        console.error("API error response:", responseText);
        
        const errors = formatApiErrors(responseText);
        throw new Error(`${t('common.validation_error')}:\n• ${errors.join('\n• ')}`);
      }
      
      // Success
      showToast(t('resume.actions.update_success'), 'success');
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/my-resumes');
      }, 1500);
    } catch (error) {
      console.error('Error updating resume:', error);
      showToast(`${t('common.error')}: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ======== Render ========

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center my-1">
        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* Validation Errors */}
      {validationErrors && validationErrors.length > 0 && (
        <div className={`p-2 mb-2 rounded-xl shadow-md ${
          darkMode ? 'bg-red-900/80 backdrop-blur-sm text-white' : 'bg-red-100 text-red-700'
        }`}>
          <p className="font-semibold mb-1 text-xs">{t('CoverLetter.errors.requiredFields')}:</p>
          <ul className="list-disc pl-5 text-xs">
            {validationErrors.map((error, index) => (
              <li key={index}>{error.message.replace('Field required', 'is required')}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Save Button */}
      {hasExistingResume ? (
        <button
          onClick={handleUpdateResume}
          className={`px-3 py-1 text-xs rounded-full text-white flex items-center justify-center gap-1 shadow-md transition-all duration-300 ${
            isSaving
              ? (darkMode ? 'bg-blue-800/80 cursor-wait' : 'bg-blue-400/80 cursor-wait')
              : (darkMode ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105' : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105')
          } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center">
              <span className="mr-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {t('resume.actions.saving')}
            </span>
          ) : (
            <>
              <Save size={14} /> 
              {t('resume.actions.save_changes')}
            </>
          )}
        </button>
      ) : (
        <button
          onClick={handleCreateResume}
          className={`px-3 py-1 text-xs rounded-full text-white flex items-center justify-center gap-1 shadow-md transition-all duration-300 ${
            isSaving
              ? (darkMode ? 'bg-blue-800/80 cursor-wait' : 'bg-blue-400/80 cursor-wait')
              : (darkMode ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105' : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105')
          } ${!userIsAuthenticated ? 'opacity-90' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center">
              <span className="mr-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {t('resume.actions.saving')}
            </span>
          ) : (
            <>
              <Save size={14} /> 
              {t('common.save')}
            </>
          )}
        </button>
      )}
    </>
  );
};

export default SaveButton;