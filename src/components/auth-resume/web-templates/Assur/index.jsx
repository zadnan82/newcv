import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAssurStyles } from './AssurStyles';

const Assur = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t } = useTranslation();
 
  // Default custom settings with Assyrian theme
  const settings = {
    accentColor: customSettings?.accentColor || '#9D2C25', // Deep Assyrian red as default
    fontFamily: customSettings?.fontFamily || '"Trajan Pro", "Palatino Linotype", "Book Antiqua", serif',
    lineSpacing: customSettings?.lineSpacing || 1.6,
    headingsUppercase: customSettings?.headingsUppercase !== undefined ? customSettings.headingsUppercase : true,
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Create a normalized version of the data with consistent property names
  const data = {
    ...formData,
    personal_info: formData.personal_info || {
      full_name: t('resume.personal_info.full_name_placeholder'),
      title: t('resume.personal_info.title_placeholder'),
      email: t('resume.personal_info.email_placeholder'),
      mobile: t('resume.personal_info.mobile_placeholder'),
      city: t('resume.personal_info.city_placeholder'),
      // ...other fields with translations
    },
    educations: formData.educations || [],
    experiences: formData.experiences || [],
    skills: formData.skills || [],
    languages: formData.languages?.map(lang => ({
      ...lang,
      language: lang.name || lang.language, // Ensure both properties exist
      name: lang.name || lang.language,
      // Preserve the level for translations
      level: lang.level || lang.proficiency
    })) || [],
    internships: formData.internships || [],
    courses: formData.courses || [],
    hobbies: formData.hobbies || [],
    extracurriculars: formData.extracurriculars || [],
    referrals: formData.referrals || []
  };
   
  // Get the styles specific to this template with PDF mode
  const styles = getAssurStyles(darkMode, settings, isPdfMode);

  // Add Assyrian decorative elements
  useEffect(() => {
    // Only add decorative elements when not in PDF mode
    if (!isPdfMode && typeof document !== 'undefined') {
      // Get the resume container
      const container = document.querySelector('.assur-template');
      
      if (container) {
        // Remove any existing decorative elements
        const existingElements = container.querySelectorAll('.assur-decorative');
        existingElements.forEach(el => el.remove());
        
        // Add lamassu-inspired corner decorations to the header
        const header = container.querySelector('.assur-header');
        if (header) {
          // Top left corner
          const topLeftCorner = document.createElement('div');
          topLeftCorner.className = 'assur-decorative assur-corner';
          topLeftCorner.style.position = 'absolute';
          topLeftCorner.style.top = '10px';
          topLeftCorner.style.left = '10px';
          topLeftCorner.style.width = '30px';
          topLeftCorner.style.height = '30px';
          topLeftCorner.style.backgroundImage = darkMode ? 
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'30\' viewBox=\'0 0 30 30\'%3E%3Cpath d=\'M0,0 L30,0 L30,30 L0,30 L0,0 Z M3,3 L3,27 L27,27 L27,3 L3,3 Z\' fill=\'none\' stroke=\'%234A4A4D\' stroke-width=\'1\'/%3E%3C/svg%3E")' : 
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'30\' viewBox=\'0 0 30 30\'%3E%3Cpath d=\'M0,0 L30,0 L30,30 L0,30 L0,0 Z M3,3 L3,27 L27,27 L27,3 L3,3 Z\' fill=\'none\' stroke=\'%23C5BBA9\' stroke-width=\'1\'/%3E%3C/svg%3E")';
          
          // Top right corner
          const topRightCorner = document.createElement('div');
          topRightCorner.className = 'assur-decorative assur-corner';
          topRightCorner.style.position = 'absolute';
          topRightCorner.style.top = '10px';
          topRightCorner.style.right = '10px';
          topRightCorner.style.width = '30px';
          topRightCorner.style.height = '30px';
          topRightCorner.style.backgroundImage = darkMode ? 
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'30\' viewBox=\'0 0 30 30\'%3E%3Cpath d=\'M0,0 L30,0 L30,30 L0,30 L0,0 Z M3,3 L3,27 L27,27 L27,3 L3,3 Z\' fill=\'none\' stroke=\'%234A4A4D\' stroke-width=\'1\'/%3E%3C/svg%3E")' : 
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'30\' viewBox=\'0 0 30 30\'%3E%3Cpath d=\'M0,0 L30,0 L30,30 L0,30 L0,0 Z M3,3 L3,27 L27,27 L27,3 L3,3 Z\' fill=\'none\' stroke=\'%23C5BBA9\' stroke-width=\'1\'/%3E%3C/svg%3E")';
          
          header.appendChild(topLeftCorner);
          header.appendChild(topRightCorner);
        }
        
        // Add ziggurat-inspired patterns to sections
        const sections = container.querySelectorAll('.assur-section, .assur-sidebar-section');
        sections.forEach((section, index) => {
          // Skip every other section to create visual variety
          if (index % 2 === 0) return;
          
          const zigguratPattern = document.createElement('div');
          zigguratPattern.className = 'assur-decorative assur-pattern';
          zigguratPattern.style.position = 'absolute';
          zigguratPattern.style.top = '0';
          zigguratPattern.style.right = '0';
          zigguratPattern.style.width = '100%';
          zigguratPattern.style.height = '100%';
          zigguratPattern.style.opacity = '0.03';
          zigguratPattern.style.pointerEvents = 'none';
          zigguratPattern.style.backgroundImage = darkMode ? 
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cpath d=\'M0,0 L100,0 L100,20 L80,20 L80,40 L60,40 L60,60 L40,60 L40,80 L20,80 L20,100 L0,100 Z\' fill=\'%234A4A4D\' fill-opacity=\'0.2\'/%3E%3C/svg%3E")' : 
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cpath d=\'M0,0 L100,0 L100,20 L80,20 L80,40 L60,40 L60,60 L40,60 L40,80 L20,80 L20,100 L0,100 Z\' fill=\'%23C5BBA9\' fill-opacity=\'0.2\'/%3E%3C/svg%3E")';
          zigguratPattern.style.backgroundRepeat = 'no-repeat';
          zigguratPattern.style.backgroundPosition = 'top right';
          zigguratPattern.style.backgroundSize = '60px 60px';
          
          section.appendChild(zigguratPattern);
        });
      }
    }
    
    return () => {
      // Cleanup function to remove decorative elements when component unmounts
      if (typeof document !== 'undefined') {
        const existingElements = document.querySelectorAll('.assur-decorative');
        existingElements.forEach(el => el.remove());
      }
    };
  }, [isPdfMode, darkMode]);

  // Format date helper with internationalization support
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const [year, month] = dateStr.split('-').map(num => parseInt(num, 10));
      
      // Use Intl.DateTimeFormat for localized month names
      const dateObj = new Date(year, month - 1); // month is 0-indexed in JS Date
      const formatter = new Intl.DateTimeFormat(undefined, { month: 'long' });
      const localizedMonth = formatter.format(dateObj);
      
      return `${localizedMonth} ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const DEFAULT_PROFILE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
  let profileImage = DEFAULT_PROFILE_IMAGE; 
  if (formData.photo && formData.photo.photolink) {
    //console.log('Found photo.photolink:', formData.photo.photolink);
    profileImage = formData.photo.photolink;
  } 
  else if (formData.photos && Array.isArray(formData.photos) && formData.photos.length > 0) {
    
    // Make sure the item has a photolink property
    if (formData.photos[0].photolink) {
      profileImage = formData.photos[0].photolink;
    }
  } 
  else if (data.photos) {
    if (Array.isArray(data.photos) && data.photos.length > 0 && data.photos[0].photolink) {
        
      profileImage = data.photos[0].photolink;
    } else if (data.photos.photolink) {
         
      profileImage = data.photos.photolink;
    }
  } 
  else if (formData.photolink) {
    console.log('Found direct photolink property');
    profileImage = formData.photolink;
  } 
  // Assyrian-styled animation classes
  const enhancedClasses = isPdfMode ? {
    // PDF-specific classes (no animations for PDF)
    container: "print:bg-white print:shadow-none",
    header: "print:py-3",
    section: "print:break-inside-avoid",
    expItem: "print:break-inside-avoid",
    sectionTitle: "print:break-after-avoid",
    sidebar: "print:bg-gray-50"
  } : {
    // Interactive UI classes with bold, angular animations
    container: "transition-all duration-500 ease-in-out",
    header: "transition-all duration-500 ease-in-out",
    section: "transition-all duration-500 ease-in-out",
    expItem: "transition-all duration-300 ease-in-out hover:translate-x-1 hover:shadow-md",
    sectionTitle: "relative transition-all duration-500 ease-in-out",
    sidebar: "transition-all duration-500 ease-in-out",
    skillBar: "transition-all duration-1000 ease-out",
    hobbyItem: "transition-all duration-300 hover:translate-y-[-2px]",
    contactItem: "transition-all duration-300 hover:translate-x-1"
  };

  // Assyrian animation timing
  const getAnimationDelay = (index) => {
    return `${index * 0.12}s`;
  };
  
  // Helper functions to check if sections have data
  const hasPersonalDetails = () => {
    return data.personal_info && (
      data.personal_info.address || 
      data.personal_info.postal_code || 
      data.personal_info.driving_license || 
      data.personal_info.nationality || 
      data.personal_info.place_of_birth || 
      data.personal_info.date_of_birth
    );
  };

  const hasExperiences = () => {
    return data.experiences && 
           Array.isArray(data.experiences) && 
           data.experiences.filter(exp => exp && exp.company).length > 0;
  };

  const hasEducation = () => {
    return data.educations && 
           Array.isArray(data.educations) && 
           data.educations.filter(edu => edu && edu.institution).length > 0;
  };

  const hasInternships = () => {
    return data.internships && 
           Array.isArray(data.internships) && 
           data.internships.filter(intern => intern && intern.company).length > 0;
  };

  const hasCourses = () => {
    return data.courses && 
           Array.isArray(data.courses) && 
           data.courses.filter(course => course && course.name).length > 0;
  };

  const hasSkills = () => {
    return data.skills && 
           Array.isArray(data.skills) && 
           data.skills.filter(skill => skill && skill.name).length > 0;
  };

  const hasLanguages = () => {
    return data.languages && 
           Array.isArray(data.languages) && 
           data.languages.filter(lang => lang && lang.language).length > 0;
  };

  const hasHobbies = () => {
    return data.hobbies && 
           ((Array.isArray(data.hobbies) && 
             data.hobbies.filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name)).length > 0) || 
            (typeof data.hobbies === 'string' && data.hobbies.trim() !== ''));
  };

  const hasExtracurriculars = () => {
    return data.extracurriculars && 
           Array.isArray(data.extracurriculars) && 
           data.extracurriculars.filter(activity => activity && activity.title).length > 0;
  };

  const hasCustomSections = () => {
    return data.custom_sections && 
           Array.isArray(data.custom_sections) && 
           data.custom_sections.filter(section => section && section.title && (section.content || (section.items && section.items.length > 0))).length > 0;
  };

  const hasReferences = () => {
    if (!data.referrals) return false;
    if (data.referrals.providedOnRequest === true) return true;
    return Array.isArray(data.referrals) && 
           data.referrals.filter(ref => ref && ref.name).length > 0;
  };

  // Skill level function with Assyrian theme
  function getSkillLevelWidth(level) {
    const levels = {
      'Beginner': '20%',
      'Elementary': '40%',
      'Intermediate': '60%',
      'Advanced': '80%',
      'Expert': '100%',
      'Native': '100%',
      'Fluent': '90%',
      'Proficient': '80%',
      'Conversational': '60%',
      'Basic': '30%',
      'Novice': '15%',
      'Learning': '25%',
      'Familiar': '45%',
      'Competent': '65%',
      'Skilled': '75%',
      'Very Advanced': '85%',
      'Near Expert': '95%',
    };
    
    return levels[level] || '50%';
  }
  
  // Proficiency translation with Assyrian language terms
  function getProficiencyTranslation(proficiency, t) {
    const proficiencies = {
      'Native': t('resume.languages.levels.native'),
      'Fluent': t('resume.languages.levels.fluent'),
      'Advanced': t('resume.languages.levels.advanced'),
      'Intermediate': t('resume.languages.levels.intermediate'),
      'Beginner': t('resume.languages.levels.beginner'),
     
    };
    
    return proficiencies[proficiency] || proficiency;
  }

  // Section icons for Assyrian style
  const getSectionIcon = (sectionType) => {
    const icons = {
      experience: darkMode ? 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z\'/%3E%3C/svg%3E")' : 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z\'/%3E%3C/svg%3E")',
      education: darkMode ? 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath d=\'M12 14l9-5-9-5-9 5 9 5z\'/%3E%3Cpath d=\'M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z\'/%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222\'/%3E%3C/svg%3E")' : 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath d=\'M12 14l9-5-9-5-9 5 9 5z\'/%3E%3Cpath d=\'M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z\'/%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222\'/%3E%3C/svg%3E")',
      skills: darkMode ? 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z\'/%3E%3C/svg%3E")' : 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z\'/%3E%3C/svg%3E")',
      languages: darkMode ? 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129\'/%3E%3C/svg%3E")' : 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129\'/%3E%3C/svg%3E")',
      hobbies: darkMode ? 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\'/%3E%3C/svg%3E")' : 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\'/%3E%3C/svg%3E")',
      default: darkMode ? 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z\'/%3E%3C/svg%3E")' : 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239D2C25\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z\'/%3E%3C/svg%3E")',
    };
    
    return icons[sectionType] || icons.default;
  };

  return (
    <div style={styles.container} className={`assur-template ${enhancedClasses.container}`}>
      {/* Assyrian-styled header with profile info and contact details */}
      <header style={styles.header} className={`assur-header ${enhancedClasses.header}`}>
        <div style={styles.headerLeft}>
          <h1 style={styles.name}>{data.personal_info.full_name}</h1>
          <div style={styles.title}>{data.personal_info.title}</div>
          
          {/* Contact information with stone carving styling */}
          <div style={styles.contactGrid}>
            {data.personal_info.email && (
              <div style={styles.contactItem} className={enhancedClasses.contactItem}>
                <span style={styles.contactIcon}>✉️</span>
                <span>{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info.mobile && (
              <div style={styles.contactItem} className={enhancedClasses.contactItem}>
                <span style={styles.contactIcon}>📱</span>
                <span>{data.personal_info.mobile}</span>
              </div>
            )}
           
            {data.personal_info.linkedin && (
              <div style={styles.contactItem} className={enhancedClasses.contactItem}>
                <span style={styles.contactIcon}>🔗</span>
                <span>{data.personal_info.linkedin}</span>
              </div>
            )}
            {data.personal_info.website && (
              <div style={styles.contactItem} className={enhancedClasses.contactItem}>
                <span style={styles.contactIcon}>🌐</span>
                <span>{data.personal_info.website}</span>
              </div>
            )}
            {data.personal_info.city && (
              <div style={styles.contactItem} className={enhancedClasses.contactItem}>
                <span style={styles.contactIcon}>🏙️</span>
                <span>{data.personal_info.city}</span>
              </div>
            )}
          </div>
        </div>
        
        <div style={styles.headerRight}>
          {/* Profile image with Assyrian frame */}
          <div style={styles.profileContainer}>
            <img 
              src={profileImage}
              alt={data.personal_info.full_name} 
              style={styles.profileImage} 
              className="profile-image"
            />
          </div>
        </div>
      </header>

      {/* Assyrian two-column layout */}
      <div style={styles.contentLayout}>
        {/* Main column with stone carving-inspired layout */}
        <div style={styles.mainColumn} className="assur-main-column">
          {/* Professional Summary with Assyrian stone tablet styling */}
          {data.personal_info.summary && (
            <div 
              style={styles.section} 
              className={`assur-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`assur-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="summary"
              >
                <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('default'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                {t('resume.personal_info.summary')}
              </h2>
              <div>
                <p style={styles.summary}>{data.personal_info.summary}</p>
              </div>
            </div>
          )}

          {/* Work Experience with Assyrian relief-inspired styling */}
          {hasExperiences() && (
            <div 
              style={styles.section} 
              className={`assur-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`assur-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="experience"
              >
                <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('experience'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                {t('resume.experience.title')}
              </h2>
              <div>
                {data.experiences
                  .filter(exp => exp && exp.company)
                  .map((exp, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.expItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className={`assur-exp-item ${enhancedClasses.expItem}`}
                    >
                      <div style={styles.expHeader}>
                        <div style={styles.expTitle}>{exp.position}</div>
                        <div style={styles.expCompany}>{exp.company}</div>
                        <div style={styles.expDate}>
                          {formatDate(exp.start_date)} - {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                        </div>
                      </div>

                      {exp.location && <div style={styles.expLocation}>{exp.location}</div>}
                      {exp.description && <div style={styles.expDescription}>{exp.description}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* Education with Assyrian tablet styling */}
          {hasEducation() && (
            <div 
              style={styles.section} 
              className={`assur-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`assur-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="education"
              >
                <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('education'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                {t('resume.education.title')}
              </h2>
              <div>
                {data.educations
                  .filter(edu => edu && edu.institution)
                  .map((edu, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.expItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className={`assur-edu-item ${enhancedClasses.expItem}`}
                    >
                      <div style={styles.expHeader}>
                        <div style={styles.expTitle}>
                          {edu.degree} {edu.field_of_study && t('common.in') + ` ${edu.field_of_study}`}
                        </div>
                        <div style={styles.expCompany}>{edu.institution}</div>
                        <div style={styles.expDate}>
                          {formatDate(edu.start_date)} - {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                        </div>
                      </div>
                      {edu.location && <div style={styles.expLocation}>{edu.location}</div>}
                      {edu.gpa && <div style={styles.expDescription}>{t('resume.education.gpa')}: {edu.gpa}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* Internships with Assyrian tablet styling */}
          {hasInternships() && (
            <div 
              style={styles.section} 
              className={`assur-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`assur-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="internships"
              >
                <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('experience'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                {t('resume.internships.title')}
              </h2>
              <div>
                {data.internships
                  .filter(internship => internship && internship.company)
                  .map((internship, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.expItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className={`assur-internship-item ${enhancedClasses.expItem}`}
                    >
                      <div style={styles.expHeader}>
                        <div style={styles.expTitle}>{internship.position}</div>
                        <div style={styles.expCompany}>{internship.company}</div>
                        <div style={styles.expDate}>
                          {formatDate(internship.start_date)} - {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
                        </div>
                      </div>
                      {internship.location && <div style={styles.expLocation}>{internship.location}</div>}
                      {internship.description && <div style={styles.expDescription}>{internship.description}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses & Certifications with Assyrian tablet styling */}
          {hasCourses() && (
            <div 
              style={styles.section} 
              className={`assur-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`assur-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="courses"
              >
                <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('education'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                {t('resume.courses.title')}
              </h2>
              <div>
                {data.courses
                  .filter(course => course && course.name)
                  .map((course, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.expItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }} 
                      className={`assur-course-item ${enhancedClasses.expItem}`}
                    >
                      <div style={styles.expHeader}>
                        <div style={styles.expTitle}>{course.name}</div>
                        <div style={styles.expCompany}>{course.institution}</div>
                        {course.date && <div style={styles.expDate}>{formatDate(course.date)}</div>}
                      </div>
                      {course.description && <div style={styles.expDescription}>{course.description}</div>}
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections with Assyrian tablet styling */}
          {hasCustomSections() && 
            data.custom_sections
              .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
              .map((section, sectionIndex) => (
                <div 
                  key={`custom-${sectionIndex}`} 
                  style={styles.section} 
                  className={`assur-section ${enhancedClasses.section}`}
                >
                  <h2 
                    style={styles.sectionTitle} 
                    className={`assur-section-title ${enhancedClasses.sectionTitle}`} 
                    data-section={`custom-${sectionIndex}`}
                  >
                    <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('default'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                    {section.title || t('resume.custom_sections.title')}
                  </h2>
                  <div>
                    {/* If the section has items array, render them as individual entries */}
                    {section.items && section.items.length > 0 ? (
                      section.items.map((item, itemIndex) => (
                        <div 
                          key={`custom-item-${sectionIndex}-${itemIndex}`} 
                          style={{
                            ...styles.expItem,
                            animationDelay: !isPdfMode ? getAnimationDelay(itemIndex) : '0s'
                          }} 
                          className={`assur-custom-item ${enhancedClasses.expItem}`}
                        >
                          <div style={styles.expHeader}>
                            <div style={styles.expTitle}>{item.title}</div>
                            {item.date && <div style={styles.expDate}>{item.date}</div>}
                          </div>
                          {item.subtitle && <div style={styles.expCompany}>{item.subtitle}</div>}
                          {item.content && <div style={styles.expDescription}>{item.content}</div>}
                        </div>
                      ))
                    ) : (
                      // Otherwise just render the section content as a block
                      <div 
                        style={styles.expItem} 
                        className={`assur-custom-content ${enhancedClasses.expItem}`}
                      >
                        {section.content && <div style={styles.expDescription}>{section.content}</div>}
                      </div>
                    )}
                  </div>
                </div>
              ))
          }

          {/* Extra Curricular Activities with Assyrian tablet styling */}
          {hasExtracurriculars() && (
            <div 
              style={styles.section} 
              className={`assur-section ${enhancedClasses.section}`}
            >
              <h2 
                style={styles.sectionTitle} 
                className={`assur-section-title ${enhancedClasses.sectionTitle}`} 
                data-section="extracurriculars"
              >
                <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('hobbies'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                {t('resume.extracurricular.activity')}
              </h2>
              <div>
                {data.extracurriculars.map((activity, index) => (
                  <div 
                    key={index} 
                    style={{
                      ...styles.expItem,
                      animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                    }} 
                    className={`assur-extracurricular-item ${enhancedClasses.expItem}`}
                  >
                    <div style={styles.expHeader}>
                      <div style={styles.expTitle}>{activity.title}</div>
                    </div>
                    {activity.description && <div style={styles.expDescription}>{activity.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (right) with Assyrian stone panel styling */}
        <div style={styles.sidebar} className="assur-sidebar">
          {/* Personal Information with Assyrian styling */}
          {hasPersonalDetails() && (
            <div style={styles.section} className={`assur-sidebar-section ${enhancedClasses.section}`}>
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`assur-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="personal-details"
              >
                <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('default'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                {t('resume.personal_info.title')}
              </h2>
              <div style={styles.personalDetails}>
                {data.personal_info.address && (
                  <div style={styles.personalDetailItem}
                       className={enhancedClasses.contactItem}>
                    <span style={styles.contactIcon}>🏠</span>
                    <span>{data.personal_info.address}</span>
                  </div>
                )}
                {data.personal_info.postal_code && (
                  <div style={styles.personalDetailItem}
                       className={enhancedClasses.contactItem}>
                    <span style={styles.contactIcon}>📮</span>
                    <span>{data.personal_info.postal_code} {data.personal_info.city}</span>
                  </div>
                )}

                {data.personal_info.driving_license && (
                  <div style={styles.personalDetailItem}
                       className={enhancedClasses.contactItem}>
                    <span style={styles.contactIcon}>🚗</span>
                    <span>{t('resume.personal_info.driving_license')}: {data.personal_info.driving_license}</span>
                  </div>
                )}
                {data.personal_info.nationality && (
                  <div style={styles.personalDetailItem}
                       className={enhancedClasses.contactItem}>
                    <span style={styles.contactIcon}>🌍</span>
                    <span>{t('resume.personal_info.nationality')}: {data.personal_info.nationality}</span>
                  </div>
                )}
                {data.personal_info.place_of_birth && (
                  <div style={styles.personalDetailItem}
                       className={enhancedClasses.contactItem}>
                    <span style={styles.contactIcon}>📍</span>
                    <span>{t('resume.personal_info.place_of_birth')}: {data.personal_info.place_of_birth}</span>
                  </div>
                )}
                {data.personal_info.date_of_birth && (
                  <div style={styles.personalDetailItem}
                       className={enhancedClasses.contactItem}>
                    <span style={styles.contactIcon}>🎂</span>
                    <span>{t('resume.personal_info.date_of_birth')}: {formatDate(data.personal_info.date_of_birth)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills with Assyrian-inspired meters */}
          {hasSkills() && (
            <div style={styles.section} className={`assur-sidebar-section ${enhancedClasses.section}`}>
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`assur-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="skills"
              >
                <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('skills'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                {t('resume.skills.title')}
              </h2>
              <div style={styles.skillsGrid}>
                {data.skills
                  .filter(skill => skill && skill.name)
                  .map((skill, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.skillItem,
                        animationDelay: !isPdfMode ? getAnimationDelay(index) : '0s'
                      }}
                    >
                      <div style={styles.skillName}>
                        {skill.name}
                      </div>
                      {skill.level && !settings.hideSkillLevel && (
                        <div style={styles.skillLevel}>
                          <div 
                            style={{
                              ...styles.skillLevelBar,
                              width: getSkillLevelWidth(skill.level)
                            }}
                            className={enhancedClasses.skillBar}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Languages with Assyrian styling */}
          {hasLanguages() && (
            <div style={styles.section} className={`assur-sidebar-section ${enhancedClasses.section}`}>
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`assur-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="languages"
              >
                <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('languages'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                {t('resume.languages.title')}
              </h2>
              <div style={styles.languagesGrid}>
                {data.languages.map((lang, index) => (
                  <div 
                    key={index} 
                    style={styles.languageItem}
                    className={enhancedClasses.hobbyItem}
                  >
                    <div style={styles.languageName}>{lang.name}</div>
                    <div style={styles.languageProficiency}>{getProficiencyTranslation(lang.level, t)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Hobbies with Assyrian styling */}
          {hasHobbies() && (
            <div style={styles.section} className={`assur-sidebar-section ${enhancedClasses.section}`}>
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`assur-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="hobbies"
              >
                <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('hobbies'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                {t('resume.hobbies.title')}
              </h2>
              <div style={styles.hobbiesContainer}>
                {typeof data.hobbies === 'string' ? (
                  <p style={styles.hobbiesText}>{data.hobbies}</p>
                ) : (
                  <div style={styles.hobbiesGrid}>
                    {data.hobbies
                      .filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name))
                      .map((hobby, index) => (
                        <div 
                          key={index} 
                          style={styles.hobbyItem}
                          className={enhancedClasses.hobbyItem}
                        >
                          {typeof hobby === 'string' ? hobby : hobby.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          
          {/* References with Assyrian tablet styling */}
          {hasReferences() && (
            <div style={styles.section} className={`assur-sidebar-section ${enhancedClasses.section}`}>
              <h2 
                style={styles.sidebarSectionTitle} 
                className={`assur-sidebar-title ${enhancedClasses.sectionTitle}`} 
                data-section="referrals"
              >
                <span style={{display: 'inline-block', width: '24px', height: '24px', marginRight: '10px', backgroundImage: getSectionIcon('default'), backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></span>
                {t('resume.references.title')}
              </h2>
              <div style={styles.referralsGrid}>
                {data.referrals?.providedOnRequest ? (
                  <div style={styles.referralItem} className="transition-all duration-300">
                    <p style={styles.referralsText}>{t('resume.references.provide_upon_request')}</p>
                  </div>
                ) : ( 
                  data.referrals && data.referrals.map((reference, index) => (
                    <div 
                      key={`referral-${index}`} 
                      style={styles.referralItem}
                      className="transition-all duration-300"
                    >
                      <div style={styles.referralName}>{reference.name}</div>
                      {reference.relation && <div style={styles.referralPosition}>{reference.relation}</div>}
                      {reference.email && (
                        <div style={styles.referralContact} className="mt-2">
                          {reference.email}
                        </div>
                      )}
                      {reference.phone && (
                        <div style={{...styles.referralContact, marginTop: '5px'}}>
                          {reference.phone}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
  
      {/* Assyrian-inspired CSS styles for animations and PDF mode */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translate3d(-20px, 0, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        @keyframes growWidth {
          from {
            width: 0;
          }
        }
        
        .assur-exp-item, .assur-edu-item, .assur-internship-item, .assur-course-item, .assur-custom-item {
          animation: fadeInUp 0.6s ease-out both;
          animation-delay: var(--delay, 0s);
        }
        
        .assur-section-title, .assur-sidebar-title {
          animation: slideInLeft 0.5s ease-out both;
        }
        
        .profile-image {
          animation: fadeIn 0.8s ease-in-out;
        }
        
        .assur-skill-level-bar {
          animation: growWidth 1.2s ease-out forwards;
        }
        
        /* PDF-specific print styles */
        @page {
          size: A4;
          margin: 0;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .assur-exp-item, .assur-edu-item, .assur-internship-item, .assur-course-item, .assur-custom-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            animation: none !important;
          }
          
          .assur-section-title, .assur-sidebar-title {
            page-break-after: avoid !important;
            break-after: avoid !important;
            animation: none !important;
          }
          
          .profile-image {
            animation: none !important;
          }
          
          .assur-skill-level-bar {
            animation: none !important;
          }
          
          p, li {
            orphans: 2 !important;
            widows: 2 !important;
          }
          
          * {
            transition: none !important;
            animation: none !important;
          }
        }
        
        /* Custom Assyrian-inspired fonts */
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap');
      `}} />
    </div>
  );
};
  
export default Assur;