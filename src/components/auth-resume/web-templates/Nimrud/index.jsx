import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Nimrud Template using a pure HTML/CSS approach instead of inline styles
 * Fixed to properly handle all resume data and translations
 */
const Nimrud = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t } = useTranslation();

  // Create a normalized version of the data with consistent property names
  const data = {
    personal_info: formData?.personal_info || {
      full_name: t('resume.personal_info.full_name_placeholder'),
      title: t('resume.personal_info.title_placeholder'),
      email: t('resume.personal_info.email_placeholder'),
      mobile: t('resume.personal_info.mobile_placeholder'),
      city: t('resume.personal_info.city_placeholder'),
      address: t('resume.personal_info.address_placeholder'),
      postal_code: t('resume.personal_info.postal_code_placeholder'),
      driving_license: t('resume.personal_info.driving_license_placeholder'),
      nationality: t('resume.personal_info.nationality_placeholder'),
      place_of_birth: t('resume.personal_info.place_of_birth_placeholder'),
      date_of_birth: t('resume.personal_info.date_of_birth_placeholder'),
      linkedin: t('resume.personal_info.linkedin_placeholder'),
      website: t('resume.personal_info.website_placeholder'),
      summary: t('resume.personal_info.summary_placeholder'),
    },
    education: formData?.educations || formData?.education || [],
    experiences: formData?.experiences || [],
    skills: formData?.skills || [],
    languages: (formData?.languages || []).map(lang => ({
      language: lang?.name || lang?.language || "",
      proficiency: lang?.level || lang?.proficiency || ""
    })),
    internships: formData?.internships || [],
    courses: formData?.courses || [],
    hobbies: formData?.hobbies || [],
    extracurriculars: formData?.extracurriculars || [],
    referrals: formData?.referrals || { providedOnRequest: true, references: [] },
    custom_sections: formData?.custom_sections || []
  };
  
  // Default custom settings
  const settings = {
    accentColor: customSettings?.accentColor || '#2b6cb0',
    fontFamily: customSettings?.fontFamily || 'Arial, sans-serif',
    lineSpacing: customSettings?.lineSpacing || 1.4,
    headingsUppercase: customSettings?.headingsUppercase === false ? false : true
  };
  
  // Format date helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const [year, month] = dateStr.split('-').map(num => parseInt(num, 10));
      return `${month.toString().padStart(2, '0')}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };
  
  const formatDateRange = (startDate, endDate, current = false) => {
    if (!startDate) return '';
    const start = formatDate(startDate);
    const end = current ? t('resume.experience.current_work') : formatDate(endDate);
    return `${start}—${end}`;
  };
  
  // Format description with triple dashes
  const formatDescription = (desc) => {
    if (!desc) return '';
    return `- - - ${desc}`;
  };
  
  // Helper function to check if array contains valid items with a specific key
  const hasContent = (array, keyToCheck) => {
    return array && 
           Array.isArray(array) && 
           array.filter(item => item && (keyToCheck ? item[keyToCheck] : true)).length > 0;
  };
  
  // Helper functions to check if sections have data
  const hasPersonalDetails = () => {
    return data.personal_info && (
      data.personal_info.date_of_birth || 
      data.personal_info.place_of_birth || 
      data.personal_info.driving_license || 
      data.personal_info.nationality
    );
  };

  const hasLinks = () => {
    return data.personal_info && (
      data.personal_info.linkedin || 
      data.personal_info.website
    );
  };

  const hasReferences = () => {
    if (!data.referrals) return false;
    if (data.referrals.providedOnRequest === true) return true;
    
    // Check if referrals is an array or if it has a references array
    return (Array.isArray(data.referrals) && data.referrals.length > 0) || 
           (data.referrals.references && Array.isArray(data.referrals.references) && 
            data.referrals.references.length > 0);
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
  // Get the name parts for the sidebar
  const nameParts = data.personal_info.full_name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  
  return (
    <>
      {/* Embedded CSS - this ensures styles are applied directly */}
      <style>
        {`
          .nimrud-container {
            display: flex;
            width: 100%;
            min-height: 1100px;
            font-family: ${settings.fontFamily};
            color: ${darkMode ? '#ffffff' : '#333333'};
            background-color: ${darkMode ? '#1a1a1a' : '#ffffff'};
          }
          
          .nimrud-sidebar {
            width: 212px;
            min-width: 212px;
            background-color: ${darkMode ? '#252525' : '#f5f5f5'};
            padding: 20px;
            border-right: 1px solid ${darkMode ? '#444444' : '#dee2e6'};
          }
          
          .nimrud-main {
            flex: 1;
            padding: 20px;
          }
          
          .nimrud-name {
            font-size: 32px;
            font-weight: bold;
            line-height: 1.1;
            margin-bottom: 0;
            color: ${darkMode ? '#ffffff' : '#000000'};
          }
          
          .nimrud-title {
            font-size: 16px;
            margin-bottom: 15px;
            color: ${darkMode ? '#cccccc' : '#333333'};
          }
          
          .nimrud-contact-item {
            font-size: 14px;
            margin-bottom: 5px;
            line-height: ${settings.lineSpacing};
          }
          
          .nimrud-sidebar-section {
            margin-top: 20px;
            margin-bottom: 15px;
          }
          
          .nimrud-sidebar-section-title {
            color: ${settings.accentColor};
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid ${darkMode ? '#444444' : '#dee2e6'};
            padding-bottom: 3px;
            margin-bottom: 5px;
            text-transform: ${settings.headingsUppercase ? 'uppercase' : 'none'};
          }
          
          .nimrud-section {
            margin-bottom: 25px;
          }
          
          .nimrud-section-title {
            color: ${settings.accentColor};
            font-size: 24px;
            font-weight: normal;
            border-bottom: 1px solid ${darkMode ? '#444444' : '#dee2e6'};
            padding-bottom: 5px;
            margin-bottom: 15px;
            text-transform: ${settings.headingsUppercase ? 'uppercase' : 'none'};
          }
          
          .nimrud-exp-item {
            margin-bottom: 15px;
            padding: 15px;
            border: 1px solid ${darkMode ? '#444444' : '#dee2e6'};
            page-break-inside: avoid;
            break-inside: avoid;
            background-color: ${darkMode ? '#2a2a2a' : '#ffffff'};
          }
          
          .nimrud-exp-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            width: 100%;
          }
          
          .nimrud-exp-company {
            color: ${settings.accentColor};
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 3px;
          }
          
          .nimrud-exp-date {
            font-size: 14px;
            color: ${darkMode ? '#aaaaaa' : '#6c757d'};
            text-align: right;
          }
          
          .nimrud-exp-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
          }
          
          .nimrud-exp-description {
            font-size: 14px;
            line-height: ${settings.lineSpacing};
          }
          
          .nimrud-pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 30px;
            display: ${isPdfMode ? 'none' : 'flex'};
          }
          
          .nimrud-page-button {
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
            background-color: ${darkMode ? '#444444' : '#f0f0f0'};
          }
          
          .nimrud-page-number {
            margin: 0 10px;
            font-size: 14px;
          }
          
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
            }
            
            .nimrud-sidebar-section-title, 
            .nimrud-section-title,
            .nimrud-exp-company {
              color: ${settings.accentColor} !important;
            }
            
            .nimrud-sidebar-section-title,
            .nimrud-section-title {
              text-transform: ${settings.headingsUppercase ? 'uppercase' : 'none'} !important;
            }
            
            .nimrud-exp-item, 
            .nimrud-edu-item, 
            .nimrud-course-item {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            .nimrud-section {
              page-break-inside: auto !important;
              break-inside: auto !important;
            }
            
            .nimrud-section-title {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            
            .nimrud-container {
              background-color: #ffffff !important;
              color: #333333 !important;
            }
            
            .nimrud-sidebar {
              background-color: #f5f5f5 !important;
              border-right-color: #dee2e6 !important;
            }
            
            .nimrud-name {
              color: #000000 !important;
            }
            
            .nimrud-title {
              color: #333333 !important;
            }
            
            .nimrud-pagination {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="nimrud-container">
        {/* Sidebar */}
        <div className="nimrud-sidebar">
          <h1 className="nimrud-name">{firstName}</h1>
          {lastName && <h1 className="nimrud-name">{lastName}</h1>}
          <div className="nimrud-title">{data.personal_info.title}</div>
          
          <div className="nimrud-contact-info">
            {data.personal_info.email && (
              <div className="nimrud-contact-item">{data.personal_info.email}</div>
            )}
            {data.personal_info.mobile && (
              <div className="nimrud-contact-item">{data.personal_info.mobile}</div>
            )}
            {data.personal_info.address && (
              <div className="nimrud-contact-item">{data.personal_info.address}</div>
            )}
            {data.personal_info.city && data.personal_info.postal_code && (
              <div className="nimrud-contact-item">
                {data.personal_info.postal_code} {data.personal_info.city}
              </div>
            )}
            {data.personal_info.city && !data.personal_info.postal_code && (
              <div className="nimrud-contact-item">{data.personal_info.city}</div>
            )}
            {data.personal_info.country && (
              <div className="nimrud-contact-item">{data.personal_info.country}</div>
            )}
          </div>
          
          {(data.personal_info.date_of_birth || data.personal_info.place_of_birth) && (
            <div className="nimrud-sidebar-section">
              <div className="nimrud-sidebar-section-title">{t('resume.personal_info.date_of_birth')}</div>
              {data.personal_info.date_of_birth && (
                <div className="nimrud-contact-item">
                  {formatDate(data.personal_info.date_of_birth)}
                </div>
              )}
              {data.personal_info.place_of_birth && (
                <div className="nimrud-contact-item">
                  {data.personal_info.place_of_birth}
                </div>
              )}
            </div>
          )}
          
          {data.personal_info.driving_license && (
            <div className="nimrud-sidebar-section">
              <div className="nimrud-sidebar-section-title">{t('resume.personal_info.driving_license')}</div>
              <div className="nimrud-contact-item">
                {data.personal_info.driving_license}
              </div>
            </div>
          )}
          
          {data.personal_info.nationality && (
            <div className="nimrud-sidebar-section">
              <div className="nimrud-sidebar-section-title">{t('resume.personal_info.nationality')}</div>
              <div className="nimrud-contact-item">
                {data.personal_info.nationality}
              </div>
            </div>
          )}
          
          {hasLinks() && (
            <div className="nimrud-sidebar-section">
              <div className="nimrud-sidebar-section-title"> </div>
              {data.personal_info.linkedin && (
                <div className="nimrud-contact-item">{data.personal_info.linkedin}</div>
              )}
              {data.personal_info.website && (
                <div className="nimrud-contact-item">{data.personal_info.website}</div>
              )}
            </div>
          )}
          
          {hasContent(data.skills, 'name') && (
            <div className="nimrud-sidebar-section">
              <div className="nimrud-sidebar-section-title">{t('resume.skills.title')}</div>
              {data.skills
                .filter(skill => skill && skill.name)
                .map((skill, index) => (
                  <div key={index} className="nimrud-contact-item">{skill.name}</div>
                ))}
            </div>
          )}
          
          {hasContent(data.languages, 'language') && (
            <div className="nimrud-sidebar-section">
              <div className="nimrud-sidebar-section-title">{t('resume.languages.title')}</div>
              {data.languages
                .filter(lang => lang && lang.language)
                .map((language, index) => (
                  <div key={index} className="nimrud-contact-item">
                    {language.language} - {language.proficiency}
                  </div>
                ))}
            </div>
          )}
          
          {((typeof data.hobbies === 'string' && data.hobbies.trim() !== '') || 
           (Array.isArray(data.hobbies) && data.hobbies.length > 0)) && (
            <div className="nimrud-sidebar-section">
              <div className="nimrud-sidebar-section-title">{t('resume.hobbies.title')}</div>
              {typeof data.hobbies === 'string' ? (
                <div className="nimrud-contact-item">{data.hobbies}</div>
              ) : (
                <div className="nimrud-contact-item">
                  {data.hobbies
                    .filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name))
                    .map((hobby, index) => 
                      typeof hobby === 'string' ? hobby : hobby.name
                    ).join(', ')}
                </div>
              )}
            </div>
          )}
          
          {hasReferences() && (
            <div className="nimrud-sidebar-section">
              <div className="nimrud-sidebar-section-title">{t('resume.references.title')}</div>
              {data.referrals?.providedOnRequest ? (
                <div className="nimrud-contact-item">{t('resume.references.provide_upon_request')}</div>
              ) : (
                <>
                  {Array.isArray(data.referrals) ? (
                    // Direct array of references
                    data.referrals.map((reference, index) => (
                      <React.Fragment key={index}>
                        <div className="nimrud-contact-item">{reference.name}</div>
                        {reference.relation && (
                          <div className="nimrud-contact-item">{reference.relation}</div>
                        )}
                        {reference.email && (
                          <div className="nimrud-contact-item">{reference.email}</div>
                        )}
                        {reference.phone && (
                          <div className="nimrud-contact-item">{reference.phone}</div>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    // References inside a references array
                    data.referrals.references && data.referrals.references.map((reference, index) => (
                      <React.Fragment key={index}>
                        <div className="nimrud-contact-item">{reference.name}</div>
                        {reference.relation && (
                          <div className="nimrud-contact-item">{reference.relation}</div>
                        )}
                        {reference.email && (
                          <div className="nimrud-contact-item">{reference.email}</div>
                        )}
                        {reference.phone && (
                          <div className="nimrud-contact-item">{reference.phone}</div>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Main content */}
        <div className="nimrud-main">
          {data.personal_info.summary && (
            <div className="nimrud-section">
              <h2 className="nimrud-section-title">{t('resume.personal_info.summary')}</h2>
              <div className="nimrud-exp-item">
                <div className="nimrud-exp-description">
                  {data.personal_info.summary}
                </div>
              </div>
            </div>
          )}
          
          {hasContent(data.experiences, 'company') && (
            <div className="nimrud-section">
              <h2 className="nimrud-section-title">{t('resume.experience.title')}</h2>
              {data.experiences
                .filter(exp => exp && exp.company)
                .map((exp, index) => (
                  <div key={index} className="nimrud-exp-item">
                    <div className="nimrud-exp-header">
                      <div className="nimrud-exp-company">
                        {exp.company}{exp.location && `, ${exp.location}`}
                      </div>
                      <div className="nimrud-exp-date">
                        {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                      </div>
                    </div>
                    <div className="nimrud-exp-title">{exp.position}</div>
                    {exp.description && (
                      <div className="nimrud-exp-description">{formatDescription(exp.description)}</div>
                    )}
                  </div>
                ))}
            </div>
          )}
          
          {hasContent(data.education, 'institution') && (
            <div className="nimrud-section">
              <h2 className="nimrud-section-title">{t('resume.education.title')}</h2>
              {data.education
                .filter(edu => edu && edu.institution)
                .map((edu, index) => (
                  <div key={index} className="nimrud-exp-item nimrud-edu-item">
                    <div className="nimrud-exp-header">
                      <div className="nimrud-exp-company">
                        {edu.institution}
                      </div>
                      <div className="nimrud-exp-date">
                        {formatDateRange(edu.start_date, edu.end_date, edu.current)}
                      </div>
                    </div>
                    <div className="nimrud-exp-title">
                      {edu.degree} {edu.field_of_study && `${t('common.in')} ${edu.field_of_study}`}
                    </div>
                    {edu.location && !edu.institution.includes(edu.location) && (
                      <div className="nimrud-exp-description">{edu.location}</div>
                    )}
                    {edu.gpa && (
                      <div className="nimrud-exp-description">{t('resume.education.gpa')}: {edu.gpa}</div>
                    )}
                    {edu.description && (
                      <div className="nimrud-exp-description">{formatDescription(edu.description)}</div>
                    )}
                  </div>
                ))}
            </div>
          )}
          
          {hasContent(data.internships, 'company') && (
            <div className="nimrud-section">
              <h2 className="nimrud-section-title">{t('resume.internships.title')}</h2>
              {data.internships
                .filter(internship => internship && internship.company)
                .map((internship, index) => (
                  <div key={index} className="nimrud-exp-item">
                    <div className="nimrud-exp-header">
                      <div className="nimrud-exp-company">
                        {internship.company}{internship.location && `, ${internship.location}`}
                      </div>
                      <div className="nimrud-exp-date">
                        {formatDateRange(internship.start_date, internship.end_date, internship.current)}
                      </div>
                    </div>
                    <div className="nimrud-exp-title">{internship.position}</div>
                    {internship.description && (
                      <div className="nimrud-exp-description">{formatDescription(internship.description)}</div>
                    )}
                  </div>
                ))}
            </div>
          )}
          
          {hasContent(data.courses, 'name') && (
            <div className="nimrud-section">
              <h2 className="nimrud-section-title">{t('resume.courses.title')}</h2>
              {data.courses
                .filter(course => course && course.name)
                .map((course, index) => (
                  <div key={index} className="nimrud-exp-item nimrud-course-item">
                    <div className="nimrud-exp-header">
                      <div className="nimrud-exp-company">{course.institution || ''}</div>
                      <div className="nimrud-exp-date">{course.date ? formatDate(course.date) : '—'}</div>
                    </div>
                    <div className="nimrud-exp-title">{course.name}</div>
                    {course.description && (
                      <div className="nimrud-exp-description">{formatDescription(course.description)}</div>
                    )}
                  </div>
                ))}
            </div>
          )}
          
          {/* Extracurricular Activities */}
          {hasContent(data.extracurriculars, 'title') && (
            <div className="nimrud-section">
              <h2 className="nimrud-section-title">{t('resume.extracurricular.activity')}</h2>
              {data.extracurriculars
                .filter(activity => activity && activity.title)
                .map((activity, index) => (
                  <div key={index} className="nimrud-exp-item">
                    <div className="nimrud-exp-title">{activity.title}</div>
                    {activity.description && (
                      <div className="nimrud-exp-description">{formatDescription(activity.description)}</div>
                    )}
                  </div>
                ))}
            </div>
          )}
          
          {/* Custom Sections */}
          {hasContent(data.custom_sections, 'title') &&
            data.custom_sections
              .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
              .map((section, sectionIndex) => (
                <div key={`custom-${sectionIndex}`} className="nimrud-section">
                  <h2 className="nimrud-section-title">{section.title || t('resume.custom_sections.title')}</h2>
                  
                  {section.items && section.items.length > 0 ? (
                    section.items.map((item, itemIndex) => (
                      <div key={`custom-item-${sectionIndex}-${itemIndex}`} className="nimrud-exp-item">
                        <div className="nimrud-exp-header">
                          <div className="nimrud-exp-company">{item.subtitle || ''}</div>
                          {item.date && (
                            <div className="nimrud-exp-date">{item.date}</div>
                          )}
                        </div>
                        <div className="nimrud-exp-title">{item.title}</div>
                        {item.content && (
                          <div className="nimrud-exp-description">{formatDescription(item.content)}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="nimrud-exp-item">
                      <div className="nimrud-exp-description">{section.content}</div>
                    </div>
                  )}
                </div>
              ))}
          
          {/* Pagination - hidden in PDF mode */}
          {!isPdfMode && (
            <div className="nimrud-pagination">
              <div className="nimrud-page-button">❮</div>
              <div className="nimrud-page-number">1 / 2</div>
              <div className="nimrud-page-button">❯</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Nimrud;