import React from 'react';
import { getLondonStyles } from './LondonStyles';
import { useTranslation } from 'react-i18next';

/**
 * London Template Implementation
 * British professional style with elegant typography
 * Fixed to properly handle all resume data
 */
const London = ({ formData, customSettings, darkMode, isPdfMode = false }) => {
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
      summary: t('resume.personal_info.summary_placeholder')
    },
    educations: formData?.educations || [],
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
    referrals: formData?.referrals || { providedOnRequest: true }
  };

  // Default custom settings
  const settings = {
    accentColor: customSettings?.accentColor || '#1d4e89',
    fontFamily: customSettings?.fontFamily || 'Georgia, serif',
    lineSpacing: customSettings?.lineSpacing || 1.5,
    headingsUppercase: customSettings?.headingsUppercase || false,
    hideSkillLevel: customSettings?.hideSkillLevel || false
  };

  // Get the styles specific to this template with PDF mode support
  const styles = getLondonStyles(darkMode, settings, isPdfMode);

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

  // Helper for skill level
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
      'Very Advanced': 5,
      'Near Expert': 5
    };
    
    return levels[level] || 3;
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
  
  // PDF-specific Tailwind classes
  const pdfClasses = isPdfMode ? {
    container: "print:bg-white print:shadow-none",
    section: "print:break-inside-avoid",
    expItem: "print:break-inside-avoid",
    sectionTitle: "print:break-after-avoid"
  } : {
    container: "",
    section: "",
    expItem: "",
    sectionTitle: ""
  };

  return (
    <div style={styles.container} className={`london-template ${pdfClasses.container}`}>
      {/* Header with name and title */}
      <header style={styles.header}>
        <h1 style={styles.name}>{data.personal_info.full_name}</h1>
        <div style={styles.title}>{data.personal_info.title}</div>
      </header>

      {/* Contact Information Bar */}
      <div style={styles.contactBar}>
        {data.personal_info.email && (
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>{t('resume.personal_info.email')}</div>
            <div>{data.personal_info.email}</div>
          </div>
        )}
        {data.personal_info.mobile && (
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>{t('resume.personal_info.mobile')}</div>
            <div>{data.personal_info.mobile}</div>
          </div>
        )}
        {data.personal_info.address && (
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>{t('resume.personal_info.address')}</div>
            <div>
              {data.personal_info.address}
              {(data.personal_info.city || data.personal_info.postal_code) && (
                <span>, {data.personal_info.city} {data.personal_info.postal_code}</span>
              )}
            </div>
          </div>
        )}
        {data.personal_info.linkedin && (
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>LinkedIn</div>
            <div>{data.personal_info.linkedin}</div>
          </div>
        )}
        {data.personal_info.website && (
          <div style={styles.contactItem}>
            <div style={styles.contactLabel}>{t('resume.personal_info.website')}</div>
            <div>{data.personal_info.website}</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Left Column */}
        <div style={styles.leftColumn}>
          {/* Professional Summary */}
          {data.personal_info.summary && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.personal_info.title')}</h2>
              <div style={styles.sectionContent}>
                <p style={styles.summaryText}>{data.personal_info.summary}</p>
              </div>
            </div>
          )}

          {/* Experience */}
          {hasExperiences() && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.experience.title')}</h2>
              <div style={styles.sectionContent}>
                {data.experiences
                  .filter(exp => exp && exp.company)
                  .map((exp, index) => (
                    <div key={index} style={styles.experienceItem} className={pdfClasses.expItem}>
                      <div style={styles.experienceHeader}>
                        <h3 style={styles.experienceTitle}>{exp.position}</h3>
                        <div style={styles.experienceCompany}>
                          {exp.company}
                          {exp.location && <span>, {exp.location}</span>}
                        </div>
                        <div style={styles.experienceDate}>
                          {formatDate(exp.start_date)} - {exp.current ? t('resume.experience.current_work') : formatDate(exp.end_date)}
                        </div>
                      </div>
                      {exp.description && <div style={styles.experienceDescription}>{exp.description}</div>}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Education */}
          {hasEducation() && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.education.title')}</h2>
              <div style={styles.sectionContent}>
                {data.educations
                  .filter(edu => edu && edu.institution)
                  .map((edu, index) => (
                    <div key={index} style={styles.educationItem} className={pdfClasses.expItem}>
                      <div style={styles.educationHeader}>
                        <h3 style={styles.educationDegree}>
                          {edu.degree} {edu.field_of_study && `${t('common.in')} ${edu.field_of_study}`}
                        </h3>
                        <div style={styles.educationInstitution}>
                          {edu.institution}
                          {edu.location && !edu.institution.includes(edu.location) && <span>, {edu.location}</span>}
                        </div>
                        <div style={styles.educationDate}>
                          {formatDate(edu.start_date)} - {edu.current ? t('resume.education.currently_studying') : formatDate(edu.end_date)}
                        </div>
                      </div>
                      {edu.gpa && (
                        <div style={styles.educationDescription}>
                          {t('resume.education.gpa')}: {edu.gpa}
                        </div>
                      )}
                      {edu.description && <div style={styles.educationDescription}>{edu.description}</div>}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Internships */}
          {hasInternships() && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.internships.title')}</h2>
              <div style={styles.sectionContent}>
                {data.internships
                  .filter(internship => internship && internship.company)
                  .map((internship, index) => (
                    <div key={index} style={styles.internshipItem} className={pdfClasses.expItem}>
                      <div style={styles.internshipHeader}>
                        <h3 style={styles.internshipTitle}>{internship.position}</h3>
                        <div style={styles.internshipCompany}>
                          {internship.company}
                          {internship.location && <span>, {internship.location}</span>}
                        </div>
                        <div style={styles.internshipDate}>
                          {formatDate(internship.start_date)} - {internship.current ? t('resume.internships.current_work') : formatDate(internship.end_date)}
                        </div>
                      </div>
                      {internship.description && <div style={styles.internshipDescription}>{internship.description}</div>}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Courses & Certifications */}
          {hasCourses() && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.courses.title')}</h2>
              <div style={styles.sectionContent}>
                <div style={styles.coursesList}>
                  {data.courses
                    .filter(course => course && course.name)
                    .map((course, index) => (
                      <div key={index} style={styles.courseItem} className={pdfClasses.expItem}>
                        <div style={styles.courseName}>{course.name}</div>
                        <div style={styles.courseDetails}>
                          {course.institution && <span>{course.institution}</span>}
                          {course.institution && course.date && <span> | </span>}
                          {course.date && <span>{formatDate(course.date)}</span>}
                        </div>
                        {course.description && <div style={styles.courseDescription}>{course.description}</div>}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Extracurricular Activities */}
          {hasExtracurriculars() && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.extracurricular.activity')}</h2>
              <div style={styles.sectionContent}>
                {data.extracurriculars
                  .filter(activity => activity && activity.title)
                  .map((activity, index) => (
                    <div key={index} style={styles.experienceItem} className={pdfClasses.expItem}>
                      <div style={styles.experienceHeader}>
                        <h3 style={styles.experienceTitle}>{activity.title}</h3>
                      </div>
                      {activity.description && <div style={styles.experienceDescription}>{activity.description}</div>}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {hasCustomSections() && 
            data.custom_sections
              .filter(section => section && section.title && (section.content || (section.items && section.items.length > 0)))
              .map((section, sectionIndex) => (
                <div key={`custom-${sectionIndex}`} style={styles.section} className={pdfClasses.section}>
                  <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{section.title || t('resume.custom_sections.title')}</h2>
                  <div style={styles.sectionContent}>
                    {section.items && section.items.length > 0 ? (
                      section.items.map((item, itemIndex) => (
                        <div key={`custom-item-${sectionIndex}-${itemIndex}`} style={styles.customItem} className={pdfClasses.expItem}>
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

          {/* References */}
          {hasReferences() && (
            <div style={styles.section} className={pdfClasses.section}>
              <h2 style={styles.sectionTitle} className={pdfClasses.sectionTitle}>{t('resume.references.title')}</h2>
              <div style={styles.sectionContent}>
                {data.referrals?.providedOnRequest ? (
                  <p style={styles.referenceText}>{t('resume.references.provide_upon_request')}</p>
                ) : (
                  Array.isArray(data.referrals) && data.referrals.map((reference, index) => (
                    <div key={`referral-${index}`} style={styles.referenceItem} className={pdfClasses.expItem}>
                      <div style={styles.referenceName}>{reference.name}</div>
                      {reference.relation && <div style={styles.referenceRelation}>{reference.relation}</div>}
                      <div style={styles.referenceContact}>
                        {reference.email && `${t('resume.personal_info.email')}: ${reference.email}`}
                        {reference.email && reference.phone && <br />}
                        {reference.phone && `${t('resume.personal_info.mobile')}: ${reference.phone}`}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={styles.rightColumn}>
          {/* Skills */}
          {hasSkills() && (
            <div style={styles.sideSection} className={pdfClasses.section}>
              <h2 style={styles.sideSectionTitle} className={pdfClasses.sectionTitle}>{t('resume.skills.title')}</h2>
              <div style={styles.skillsList}>
                {data.skills
                  .filter(skill => skill && skill.name)
                  .map((skill, index) => (
                    <div key={index} style={styles.skillItem} className={pdfClasses.expItem}>
                      <div style={styles.skillName}>{skill.name}</div>
                      {skill.level && !settings.hideSkillLevel && (
                        <div style={styles.skillLevel}>
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              style={{
                                ...styles.skillDot,
                                backgroundColor: i < getSkillLevel(skill.level) 
                                  ? settings.accentColor
                                  : darkMode ? '#444' : '#ddd'
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {hasLanguages() && (
            <div style={styles.sideSection} className={pdfClasses.section}>
              <h2 style={styles.sideSectionTitle} className={pdfClasses.sectionTitle}>{t('resume.languages.title')}</h2>
              <div style={styles.languagesList}>
                {data.languages
                  .filter(lang => lang && lang.language)
                  .map((language, index) => (
                    <div key={index} style={styles.languageItem} className={pdfClasses.expItem}>
                      <div style={styles.languageName}>{language.language}</div>
                      <div style={styles.languageProficiency}>
                        {getProficiencyTranslation(language.level || language.proficiency, t)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Hobbies & Interests */}
          {hasHobbies() && (
            <div style={styles.sideSection} className={pdfClasses.section}>
              <h2 style={styles.sideSectionTitle} className={pdfClasses.sectionTitle}>{t('resume.hobbies.title')}</h2>
              <div style={styles.hobbiesList}>
                {typeof data.hobbies === 'string' ? (
                  <p style={styles.hobbiesText}>{data.hobbies}</p>
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

          {/* Personal Details */}
          {hasPersonalDetails() && (
            <div style={styles.sideSection} className={pdfClasses.section}>
              <h2 style={styles.sideSectionTitle} className={pdfClasses.sectionTitle}>{t('resume.personal_info.title')}</h2>
              <div style={styles.personalDetailsList}>
                {data.personal_info.nationality && (
                  <div style={styles.personalDetailItem}>
                    <div style={styles.personalDetailLabel}>{t('resume.personal_info.nationality')}</div>
                    <div style={styles.personalDetailValue}>{data.personal_info.nationality}</div>
                  </div>
                )}
                {data.personal_info.driving_license && (
                  <div style={styles.personalDetailItem}>
                    <div style={styles.personalDetailLabel}>{t('resume.personal_info.driving_license')}</div>
                    <div style={styles.personalDetailValue}>{data.personal_info.driving_license}</div>
                  </div>
                )}
                {data.personal_info.date_of_birth && (
                  <div style={styles.personalDetailItem}>
                    <div style={styles.personalDetailLabel}>{t('resume.personal_info.date_of_birth')}</div>
                    <div style={styles.personalDetailValue}>{formatDate(data.personal_info.date_of_birth)}</div>
                  </div>
                )}
                {data.personal_info.place_of_birth && (
                  <div style={styles.personalDetailItem}>
                    <div style={styles.personalDetailLabel}>{t('resume.personal_info.place_of_birth')}</div>
                    <div style={styles.personalDetailValue}>{data.personal_info.place_of_birth}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
            .london-template {
              background-color: #ffffff !important;
            }
            .london-expItem, .london-educationItem {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .london-sectionTitle {
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

// Function to get language proficiency translation
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

export default London;