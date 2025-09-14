import React from 'react';
import { getBerlinStyles } from './BerlinStyles';
import { useTranslation } from 'react-i18next';

/**
 * Berlin Template Implementation
 * Minimalist geometric design with clean lines
 * Fixed to properly handle all resume data
 */
const Berlin = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
  const { t } = useTranslation();
  
  // Create a normalized version of the data with consistent property names
  // but preserve the original translation references
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
      summary: t('resume.personal_info.summary_placeholder')
    },
    educations: formData?.educations || formData?.education || [],
    experiences: formData?.experiences || [],
    skills: formData?.skills || [],
    languages: formData?.languages?.map(lang => ({
      ...lang,
      language: lang.name || lang.language,
      name: lang.name || lang.language,
      level: lang.level || lang.proficiency,
      proficiency: lang.level || lang.proficiency
    })) || [],
    internships: formData?.internships || [],
    courses: formData?.courses || [],
    hobbies: formData?.hobbies || [],
    extracurriculars: formData?.extracurriculars || [],
    referrals: formData?.referrals || { providedOnRequest: true },
    custom_sections: formData?.custom_sections || []
  };

  // Default custom settings
  const settings = {
    accentColor: customSettings?.accentColor || '#333333',
    fontFamily: customSettings?.fontFamily || 'Arial, Helvetica, sans-serif',
    lineSpacing: customSettings?.lineSpacing || 1.5,
    headingsUppercase: customSettings?.headingsUppercase === false ? false : true,
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Get the styles specific to this template with PDF mode support
  const styles = getBerlinStyles(darkMode, settings, isPdfMode);

  // Format date helper with internationalization support
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const [year, month] = dateStr.split('-').map(num => parseInt(num, 10));
      
      // Use Intl.DateTimeFormat for localized abbreviated month names
      const dateObj = new Date(year, month - 1); // month is 0-indexed in JS Date
      const formatter = new Intl.DateTimeFormat(undefined, { month: 'short' });
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
  // Helper functions to check if sections have data
  const hasPersonalDetails = () => {
    return data.personal_info && (
      data.personal_info.nationality || 
      data.personal_info.driving_license || 
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
           data.languages.filter(lang => lang && (lang.language || lang.name)).length > 0;
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
    
    // Check if referrals is an array or if it has a references array
    return (Array.isArray(data.referrals) && data.referrals.length > 0) || 
           (data.referrals.references && Array.isArray(data.referrals.references) && 
            data.referrals.references.length > 0);
  };
  
  // PDF-specific Tailwind classes
  const pdfClasses = isPdfMode ? {
    container: "print:bg-white print:shadow-none",
    section: "print:break-inside-avoid",
    timelineItem: "print:break-inside-avoid",
    sectionHeading: "print:break-after-avoid"
  } : {
    container: "",
    section: "",
    timelineItem: "",
    sectionHeading: ""
  };

  return (
    <div style={styles.container} className={`berlin-template ${pdfClasses.container}`}>
      {/* Left sidebar */}
      <div style={styles.sidebar}>
        {/* Profile section */}
        <div style={styles.profile}>
          <h1 style={styles.name}>{data.personal_info.full_name}</h1>
          <div style={styles.title}>{data.personal_info.title}</div>
        </div>

        {/* Contact information */}
        <div style={styles.sidebarSection}>
          <h2 style={styles.sidebarHeading}>{t('contact.info.title')}</h2>
          <div style={styles.contactList}>
            {data.personal_info.email && (
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>✉</div>
                <div style={styles.contactText}>{data.personal_info.email}</div>
              </div>
            )}
            {data.personal_info.mobile && (
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>📱</div>
                <div style={styles.contactText}>{data.personal_info.mobile}</div>
              </div>
            )}
            {data.personal_info.address && (
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>📍</div>
                <div style={styles.contactText}>
                  {data.personal_info.address}
                  {(data.personal_info.city || data.personal_info.postal_code) && (
                    <div>
                      {data.personal_info.city} {data.personal_info.postal_code}
                    </div>
                  )}
                </div>
              </div>
            )}
            {data.personal_info.linkedin && (
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>🔗</div>
                <div style={styles.contactText}>{data.personal_info.linkedin}</div>
              </div>
            )}
            {data.personal_info.website && (
              <div style={styles.contactItem}>
                <div style={styles.contactIcon}>🌐</div>
                <div style={styles.contactText}>{data.personal_info.website}</div>
              </div>
            )}
          </div>
        </div>

        {/* Skills section */}
        {hasSkills() && (
          <div style={styles.sidebarSection} className={pdfClasses.section}>
            <h2 style={styles.sidebarHeading} className={pdfClasses.sectionHeading}>{t('resume.skills.title')}</h2>
            <div style={styles.skillList}>
              {data.skills
                .filter(skill => skill && skill.name)
                .map((skill, index) => (
                  <div key={index} style={styles.skillItem}>
                    <div style={styles.skillName}>{skill.name}</div>
                    {skill.level && !settings.hideSkillLevel && (
                      <div style={styles.skillBar}>
                        <div 
                          style={{
                            ...styles.skillBarFill,
                            width: getSkillPercentage(skill.level)
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Languages section */}
        {hasLanguages() && (
          <div style={styles.sidebarSection} className={pdfClasses.section}>
            <h2 style={styles.sidebarHeading} className={pdfClasses.sectionHeading}>{t('resume.languages.title')}</h2>
            <div style={styles.languageList}>
              {data.languages
                .filter(lang => lang && (lang.language || lang.name))
                .map((language, index) => (
                  <div key={index} style={styles.languageItem}>
                    <span style={styles.languageName}>{language.language || language.name}</span>
                    <span style={styles.languageDot}>•</span>
                    <span style={styles.languageLevel}>
                      {getProficiencyTranslation(language.proficiency || language.level, t)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Additional Personal Details */}
        {hasPersonalDetails() && (
          <div style={styles.sidebarSection} className={pdfClasses.section}>
            <h2 style={styles.sidebarHeading} className={pdfClasses.sectionHeading}>{t('resume.personal_info.title')}</h2>
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
        )}

        {/* Hobbies section */}
        {hasHobbies() && (
          <div style={styles.sidebarSection} className={pdfClasses.section}>
            <h2 style={styles.sidebarHeading} className={pdfClasses.sectionHeading}>{t('resume.hobbies.title')}</h2>
            <div style={styles.hobbyList}>
              {typeof data.hobbies === 'string' ? (
                <p style={styles.hobbyText}>{data.hobbies}</p>
              ) : (
                data.hobbies
                  .filter(hobby => hobby && (typeof hobby === 'string' ? hobby : hobby.name))
                  .map((hobby, index) => (
                    <div key={index} style={styles.hobbyItem}>
                      {typeof hobby === 'string' ? hobby : hobby.name}
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div style={styles.mainContent}>
        {/* Professional Summary */}
        {data.personal_info.summary && (
          <div style={styles.section} className={pdfClasses.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionHeading} className={pdfClasses.sectionHeading}>{t('resume.personal_info.summary')}</h2>
              <div style={styles.sectionBar}></div>
            </div>
            <div style={styles.sectionContent}>
              <p style={styles.summaryText}>{data.personal_info.summary}</p>
            </div>
          </div>
        )}

        {/* Experience section */}
        {hasExperiences() && (
          <div style={styles.section} className={pdfClasses.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionHeading} className={pdfClasses.sectionHeading}>{t('resume.experience.title')}</h2>
              <div style={styles.sectionBar}></div>
            </div>
            <div style={styles.sectionContent}>
              {data.experiences
                .filter(exp => exp && exp.company)
                .map((exp, index, filteredArray) => (
                  <div key={index} style={styles.timelineItem} className={pdfClasses.timelineItem}>
                    <div style={styles.timelineDot}></div>
                    <div style={styles.timelineConnector} 
                      className={index === filteredArray.length - 1 ? 'last-item' : ''}></div>
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineHeader}>
                        <div style={styles.timelineTitle}>{exp.position}</div>
                        <div style={styles.timelineSubtitle}>
                          {exp.company}
                          {exp.location && <span>, {exp.location}</span>}
                        </div>
                        <div style={styles.timelineDate}>
                          {formatDate(exp.start_date)} — {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                        </div>
                      </div>
                      {exp.description && (
                        <div style={styles.timelineDescription}>{exp.description}</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Education section */}
        {hasEducation() && (
          <div style={styles.section} className={pdfClasses.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionHeading} className={pdfClasses.sectionHeading}>{t('resume.education.title')}</h2>
              <div style={styles.sectionBar}></div>
            </div>
            <div style={styles.sectionContent}>
              {data.educations
                .filter(edu => edu && edu.institution)
                .map((edu, index, filteredArray) => (
                  <div key={index} style={styles.timelineItem} className={pdfClasses.timelineItem}>
                    <div style={styles.timelineDot}></div>
                    <div style={styles.timelineConnector} 
                      className={index === filteredArray.length - 1 ? 'last-item' : ''}></div>
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineHeader}>
                        <div style={styles.timelineTitle}>
                          {edu.degree} {edu.field_of_study && `${t('common.in')} ${edu.field_of_study}`}
                        </div>
                        <div style={styles.timelineSubtitle}>
                          {edu.institution}
                          {edu.location && !edu.institution.includes(edu.location) && <span>, {edu.location}</span>}
                        </div>
                        <div style={styles.timelineDate}>
                          {formatDate(edu.start_date)} — {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                        </div>
                      </div>
                      {edu.description && (
                        <div style={styles.timelineDescription}>{edu.description}</div>
                      )}
                      {edu.gpa && (
                        <div style={styles.eduGpa}>{t('resume.education.gpa')}: {edu.gpa}</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Internships section */}
        {hasInternships() && (
          <div style={styles.section} className={pdfClasses.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionHeading} className={pdfClasses.sectionHeading}>{t('resume.internships.title')}</h2>
              <div style={styles.sectionBar}></div>
            </div>
            <div style={styles.sectionContent}>
              {data.internships
                .filter(internship => internship && internship.company)
                .map((internship, index, filteredArray) => (
                  <div key={index} style={styles.timelineItem} className={pdfClasses.timelineItem}>
                    <div style={styles.timelineDot}></div>
                    <div style={styles.timelineConnector} 
                      className={index === filteredArray.length - 1 ? 'last-item' : ''}></div>
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineHeader}>
                        <div style={styles.timelineTitle}>{internship.position}</div>
                        <div style={styles.timelineSubtitle}>
                          {internship.company}
                          {internship.location && <span>, {internship.location}</span>}
                        </div>
                        <div style={styles.timelineDate}>
                          {formatDate(internship.start_date)} — {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
                        </div>
                      </div>
                      {internship.description && (
                        <div style={styles.timelineDescription}>{internship.description}</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {/* Extracurricular Activities */}
        {hasExtracurriculars() && (
          <div style={styles.section} className={pdfClasses.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionHeading} className={pdfClasses.sectionHeading}>{t('resume.extracurricular.activity')}</h2>
              <div style={styles.sectionBar}></div>
            </div>
            <div style={styles.sectionContent}>
              {data.extracurriculars
                .filter(activity => activity && activity.title)
                .map((activity, index, filteredArray) => (
                  <div key={index} style={styles.timelineItem} className={pdfClasses.timelineItem}>
                    <div style={styles.timelineDot}></div>
                    <div style={styles.timelineConnector} 
                      className={index === filteredArray.length - 1 ? 'last-item' : ''}></div>
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineHeader}>
                        <div style={styles.timelineTitle}>{activity.title}</div>
                      </div>
                      {activity.description && (
                        <div style={styles.timelineDescription}>{activity.description}</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Courses section */}
        {hasCourses() && (
          <div style={styles.section} className={pdfClasses.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionHeading} className={pdfClasses.sectionHeading}>{t('resume.courses.title')}</h2>
              <div style={styles.sectionBar}></div>
            </div>
            <div style={styles.sectionContent}>
              <div style={styles.courseGrid}>
                {data.courses
                  .filter(course => course && course.name)
                  .map((course, index) => (
                    <div key={index} style={styles.courseItem} className={pdfClasses.timelineItem}>
                      <div style={styles.courseName}>{course.name}</div>
                      <div style={styles.courseDetails}>
                        {course.institution && <span>{course.institution}</span>}
                        {course.date && <span> • {formatDate(course.date)}</span>}
                      </div>
                      {course.description && (
                        <div style={styles.courseDescription}>{course.description}</div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Custom sections */}
        {hasCustomSections() && 
          data.custom_sections
            .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
            .map((section, sectionIndex) => (
              <div key={`custom-${sectionIndex}`} style={styles.section} className={pdfClasses.section}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionHeading} className={pdfClasses.sectionHeading}>{section.title || t('resume.custom_sections.title')}</h2>
                  <div style={styles.sectionBar}></div>
                </div>
                <div style={styles.sectionContent}>
                  {section.items && section.items.length > 0 ? (
                    section.items.map((item, itemIndex) => (
                      <div key={`custom-item-${sectionIndex}-${itemIndex}`} style={styles.customItem} className={pdfClasses.timelineItem}>
                        {item.title && <div style={styles.customItemTitle}>{item.title}</div>}
                        {item.subtitle && <div style={styles.customItemSubtitle}>{item.subtitle}</div>}
                        {item.date && <div style={styles.customItemDate}>{item.date}</div>}
                        {item.content && <div style={styles.customItemContent}>{item.content}</div>}
                      </div>
                    ))
                  ) : (
                    <div style={styles.customContent}>{section.content}</div>
                  )}
                </div>
              </div>
            ))
        }

        {/* References section */}
        {hasReferences() && (
          <div style={styles.section} className={pdfClasses.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionHeading} className={pdfClasses.sectionHeading}>{t('resume.references.title')}</h2>
              <div style={styles.sectionBar}></div>
            </div>
            <div style={styles.sectionContent}>
              {data.referrals.providedOnRequest ? (
                <p style={styles.referenceText}>{t('resume.references.provide_upon_request')}</p>
              ) : (
                <div style={styles.referenceGrid}>
                  {Array.isArray(data.referrals) ? (
                    // Direct array of references
                    data.referrals.map((reference, index) => (
                      <div key={`ref-${index}`} style={styles.referenceItem} className={pdfClasses.timelineItem}>
                        <div style={styles.referenceName}>{reference.name}</div>
                        {reference.relation && (
                          <div style={styles.referenceRelation}>{reference.relation}</div>
                        )}
                        <div style={styles.referenceContact}>
                          {reference.email && <div>{reference.email}</div>}
                          {reference.phone && <div>{reference.phone}</div>}
                        </div>
                      </div>
                    ))
                  ) : (
                    // References inside a references array
                    data.referrals.references && data.referrals.references.map((reference, index) => (
                      <div key={`ref-${index}`} style={styles.referenceItem} className={pdfClasses.timelineItem}>
                        <div style={styles.referenceName}>{reference.name}</div>
                        {reference.relation && (
                          <div style={styles.referenceRelation}>{reference.relation}</div>
                        )}
                        <div style={styles.referenceContact}>
                          {reference.email && <div>{reference.email}</div>}
                          {reference.phone && <div>{reference.phone}</div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* PDF-specific print styles */}
      {isPdfMode && (
        <style dangerouslySetInnerHTML={{ __html: `
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .berlin-template {
              background-color: #ffffff !important;
            }
            .last-item {
              display: none !important;
            }
            .berlin-timelineItem {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .berlin-sectionHeading {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            p, li {
              orphans: 2 !important;
              widows: 2 !important;
            }
          }
        `}} />
      )}
    </div>
  );
};

// Helper function to convert skill level to percentage
function getSkillPercentage(level) {
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

// Function to get language proficiency translation
function getProficiencyTranslation(proficiency, t) {
  if (!proficiency) return '';
  
  // Match exactly the keys used in translation file
  switch(proficiency) {
    case 'Native':
      return t('resume.languages.levels.native');
    case 'Fluent':
      return t('resume.languages.levels.fluent');
    case 'Advanced':
      return t('resume.languages.levels.advanced');
    case 'Intermediate':
      return t('resume.languages.levels.intermediate');
    case 'Beginner':
      return t('resume.languages.levels.beginner');
   
    default:
      return proficiency;
  }
}

export default Berlin;