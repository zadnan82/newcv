import React from 'react';
import { getViennaStyles } from './ViennaStyles';
import { useTranslation } from 'react-i18next';

/**
 * Vienna Template Implementation
 * Elegant European design with classical styling
 */
const Vienna = ({ formData, customSettings, darkMode }) => {
  const { t } = useTranslation();
  
  // Create a normalized version of the data with consistent property names
  const data = {
    ...formData,
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
      profile_image: null,
      summary: t('resume.personal_info.summary_placeholder')
    },
    educations: formData?.educations || [],
    experiences: formData?.experiences || [],
    skills: formData?.skills || [],
    languages: formData?.languages?.map(lang => ({
      ...lang,
      language: lang.name || lang.language,
      proficiency: lang.level || lang.proficiency
    })) || [],
    internships: formData?.internships || [],
    courses: formData?.courses || [],
    hobbies: formData?.hobbies || [],
    extracurriculars: formData?.extracurriculars || [],
    referrals: formData?.referrals || { providedOnRequest: true },
    custom_sections: formData?.custom_sections || []
  };

  // Default custom settings with proper fallbacks
  const settings = {
    accentColor: customSettings?.accentColor || '#7a5c58',
    fontFamily: customSettings?.fontFamily || 'Times New Roman, Times, serif',
    lineSpacing: customSettings?.lineSpacing || 1.5,
    headingsUppercase: customSettings?.headingsUppercase === false ? false : true, // Default to true
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Get the styles specific to this template
  const styles = getViennaStyles(darkMode, settings);

  // Format date helper
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
    console.log('Found photo.photolink:', formData.photo.photolink);
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

  // Helper function to convert skill level to circles (1-5)
  const getSkillLevel = (level) => {
    const levels = {
      'Beginner': 1,
      'Elementary': 2,
      'Intermediate': 3,
      'Advanced': 4,
      'Expert': 5,
      'Native': 5,
      'Fluent': 5,
      'Proficient': 4,
      'Conversational': 3,
      'Basic': 1,
      'Novice': 1,
      'Learning': 2,
      'Familiar': 2,
      'Competent': 3,
      'Skilled': 4,
      'Very Advanced': 4,
      'Near Expert': 5,
    };
    
    return levels[level] || 3;
  };

  // Helper functions to check if sections have data
  const hasPersonalDetails = () => {
    return data.personal_info && (
      data.personal_info.nationality || 
      data.personal_info.driving_license || 
      data.personal_info.date_of_birth || 
      data.personal_info.place_of_birth
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
    return data.hobbies && (
      (Array.isArray(data.hobbies) && data.hobbies.filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name)).length > 0) || 
      (typeof data.hobbies === 'string' && data.hobbies.trim() !== '')
    );
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

  return (
    <div style={styles.container}>
      {/* Header with name and title */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.name}>{data.personal_info.full_name}</h1>
          <div style={styles.title}>{data.personal_info.title}</div>
          
          {/* Contact info - horizontal bar */}
          <div style={styles.contactBar}>
            {data.personal_info.email && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>✉</span>
                <span>{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info.mobile && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📱</span>
                <span>{data.personal_info.mobile}</span>
              </div>
            )}
            {data.personal_info.address && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📍</span>
                <span>{data.personal_info.address}</span>
              </div>
            )}
            {data.personal_info.linkedin && (
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🔗</span>
                <span>{data.personal_info.linkedin}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Ornamental sidebar element */}
        <div style={styles.headerOrnament}></div>
      </header>

      {/* Main content */}
      <div style={styles.content}>
        {/* Professional Summary */}
        {data.personal_info.summary && (
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>
              {settings.headingsUppercase ? t('resume.personal_info.summary').toUpperCase() : t('resume.personal_info.summary')}
            </h2>
            <div style={styles.sectionContent}>
              <p style={styles.summary}>{data.personal_info.summary}</p>
            </div>
          </div>
        )}

        {/* Main three-column layout */}
        <div style={styles.threeColumnLayout}>
          {/* Column 1 */}
          <div style={styles.column}>
            {/* Experience Section */}
            {hasExperiences() && (
              <div style={styles.columnSection}>
                <h2 style={styles.columnHeading}>
                  {settings.headingsUppercase ? t('resume.experience.title').toUpperCase() : t('resume.experience.title')}
                </h2>
                <div style={styles.columnContent}>
                  {data.experiences.map((exp, index) => (
                    <div key={index} style={styles.experienceItem}>
                      <div style={styles.experienceHeader}>
                        <div style={styles.experienceTitle}>{exp.position}</div>
                        <div style={styles.experienceCompany}>{exp.company}</div>
                        <div style={styles.experienceDate}>
                          {formatDate(exp.start_date)} — {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                        </div>
                      </div>
                      {exp.description && (
                        <div style={styles.experienceDescription}>{exp.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hobbies Section */}
            {hasHobbies() && (
              <div style={styles.columnSection}>
                <h2 style={styles.columnHeading}>
                  {settings.headingsUppercase ? t('resume.hobbies.title').toUpperCase() : t('resume.hobbies.title')}
                </h2>
                <div style={styles.columnContent}>
                  {typeof data.hobbies === 'string' ? (
                    <p style={styles.hobbiesText}>{data.hobbies}</p>
                  ) : (
                    <div style={styles.hobbiesList}>
                      {data.hobbies.map((hobby, index) => (
                        <div key={index} style={styles.hobbyItem}>
                          {typeof hobby === 'string' ? hobby : hobby.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Extracurricular Activities - Added */}
            {hasExtracurriculars() && (
              <div style={styles.columnSection}>
                <h2 style={styles.columnHeading}>
                  {settings.headingsUppercase ? t('resume.extracurricular.activity').toUpperCase() : t('resume.extracurricular.activity')}
                </h2>
                <div style={styles.columnContent}>
                  {data.extracurriculars.map((activity, index) => (
                    <div key={index} style={styles.experienceItem}>
                      <div style={styles.experienceHeader}>
                        <div style={styles.experienceTitle}>{activity.title}</div>
                      </div>
                      {activity.description && (
                        <div style={styles.experienceDescription}>{activity.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2 */}
          <div style={styles.column}>
            {/* Education Section */}
            {hasEducation() && (
              <div style={styles.columnSection}>
                <h2 style={styles.columnHeading}>
                  {settings.headingsUppercase ? t('resume.education.title').toUpperCase() : t('resume.education.title')}
                </h2>
                <div style={styles.columnContent}>
                  {data.educations.map((edu, index) => (
                    <div key={index} style={styles.educationItem}>
                      <div style={styles.educationHeader}>
                        <div style={styles.educationDegree}>
                          {edu.degree} {edu.field_of_study && `${t('common.in')} ${edu.field_of_study}`}
                        </div>
                        <div style={styles.educationInstitution}>{edu.institution}</div>
                        <div style={styles.educationDate}>
                          {formatDate(edu.start_date)} — {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                        </div>
                      </div>
                      {edu.description && (
                        <div style={styles.educationDescription}>{edu.description}</div>
                      )}
                      {edu.gpa && (
                        <div style={styles.educationDescription}>{t('resume.education.gpa')}: {edu.gpa}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courses Section */}
            {hasCourses() && (
              <div style={styles.columnSection}>
                <h2 style={styles.columnHeading}>
                  {settings.headingsUppercase ? t('resume.courses.title').toUpperCase() : t('resume.courses.title')}
                </h2>
                <div style={styles.columnContent}>
                  <div style={styles.coursesList}>
                    {data.courses.map((course, index) => (
                      <div key={index} style={styles.courseItem}>
                        <div style={styles.courseName}>{course.name}</div>
                        <div style={styles.courseDetails}>
                          {course.institution && <span>{course.institution}</span>}
                          {course.date && <span> • {formatDate(course.date)}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* References Section */}
            {hasReferences() && (
              <div style={styles.columnSection}>
                <h2 style={styles.columnHeading}>
                  {settings.headingsUppercase ? t('resume.references.title').toUpperCase() : t('resume.references.title')}
                </h2>
                <div style={styles.columnContent}>
                  {data.referrals.providedOnRequest ? (
                    <p style={styles.referenceText}>{t('resume.references.provide_upon_request')}</p>
                  ) : (
                    <div style={styles.referencesList}>
                      {Array.isArray(data.referrals) && data.referrals.map((reference, index) => (
                        <div key={`ref-${index}`} style={styles.referenceItem}>
                          <div style={styles.referenceName}>{reference.name}</div>
                          {reference.relation && <div style={styles.referencePosition}>{reference.relation}</div>}
                          <div style={styles.referenceContact}>
                            {reference.email && <div>{reference.email}</div>}
                            {reference.phone && <div>{reference.phone}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Column 3 */}
          <div style={styles.column}>
            {/* Skills Section */}
            {hasSkills() && (
              <div style={styles.columnSection}>
                <h2 style={styles.columnHeading}>
                  {settings.headingsUppercase ? t('resume.skills.title').toUpperCase() : t('resume.skills.title')}
                </h2>
                <div style={styles.columnContent}>
                  <div style={styles.skillsList}>
                    {data.skills.map((skill, index) => (
                      <div key={index} style={styles.skillItem}>
                        <div style={styles.skillName}>{skill.name}</div>
                        {skill.level && !settings.hideSkillLevel && (
                          <div style={styles.skillLevel}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div 
                                key={i} 
                                style={{
                                  ...styles.skillCircle,
                                  backgroundColor: i < getSkillLevel(skill.level) 
                                    ? settings.accentColor 
                                    : darkMode ? '#444444' : '#e0e0e0'
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Languages Section */}
            {hasLanguages() && (
              <div style={styles.columnSection}>
                <h2 style={styles.columnHeading}>
                  {settings.headingsUppercase ? t('resume.languages.title').toUpperCase() : t('resume.languages.title')}
                </h2>
                <div style={styles.columnContent}>
                  <div style={styles.languagesList}>
                    {data.languages.map((language, index) => (
                      <div key={index} style={styles.languageItem}>
                        <div style={styles.languageName}>{language.language}</div>
                        <div style={styles.languageProficiency}>{language.proficiency}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Internships Section */}
            {hasInternships() && (
              <div style={styles.columnSection}>
                <h2 style={styles.columnHeading}>
                  {settings.headingsUppercase ? t('resume.internships.title').toUpperCase() : t('resume.internships.title')}
                </h2>
                <div style={styles.columnContent}>
                  {data.internships.map((internship, index) => (
                    <div key={index} style={styles.internshipItem}>
                      <div style={styles.internshipTitle}>{internship.position}</div>
                      <div style={styles.internshipCompany}>{internship.company}</div>
                      <div style={styles.internshipDate}>
                        {formatDate(internship.start_date)} — {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
                      </div>
                      {internship.description && (
                        <div style={styles.internshipDescription}>{internship.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Details */}
            {hasPersonalDetails() && (
              <div style={styles.columnSection}>
                <h2 style={styles.columnHeading}>
                  {settings.headingsUppercase ? t('resume.personal_info.title').toUpperCase() : t('resume.personal_info.title')}
                </h2>
                <div style={styles.columnContent}>
                  <div style={styles.personalList}>
                    {data.personal_info.nationality && (
                      <div style={styles.personalItem}>
                        <div style={styles.personalLabel}>{t('resume.personal_info.nationality')}</div>
                        <div style={styles.personalValue}>{data.personal_info.nationality}</div>
                      </div>
                    )}
                    {data.personal_info.driving_license && (
                      <div style={styles.personalItem}>
                        <div style={styles.personalLabel}>{t('resume.personal_info.driving_license')}</div>
                        <div style={styles.personalValue}>{data.personal_info.driving_license}</div>
                      </div>
                    )}
                    {data.personal_info.date_of_birth && (
                      <div style={styles.personalItem}>
                        <div style={styles.personalLabel}>{t('resume.personal_info.date_of_birth')}</div>
                        <div style={styles.personalValue}>{formatDate(data.personal_info.date_of_birth)}</div>
                      </div>
                    )}
                    {data.personal_info.place_of_birth && (
                      <div style={styles.personalItem}>
                        <div style={styles.personalLabel}>{t('resume.personal_info.place_of_birth')}</div>
                        <div style={styles.personalValue}>{data.personal_info.place_of_birth}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Sections */}
        {hasCustomSections() && 
          data.custom_sections.map((section, sectionIndex) => (
            <div key={`custom-${sectionIndex}`} style={styles.section}>
              <h2 style={styles.sectionHeading}>
                {settings.headingsUppercase ? (section.title || t('resume.custom_sections.title')).toUpperCase() : (section.title || t('resume.custom_sections.title'))}
              </h2>
              <div style={styles.sectionContent}>
                {section.items && section.items.length > 0 ? (
                  <div style={styles.customItemsList}>
                    {section.items.map((item, itemIndex) => (
                      <div key={`custom-item-${sectionIndex}-${itemIndex}`} style={styles.customItem}>
                        {item.title && <div style={styles.customItemTitle}>{item.title}</div>}
                        {item.subtitle && <div style={styles.customItemSubtitle}>{item.subtitle}</div>}
                        {item.date && <div style={styles.customItemDate}>{item.date}</div>}
                        {item.content && <div style={styles.customItemContent}>{item.content}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.customContent}>{section.content}</div>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Vienna;