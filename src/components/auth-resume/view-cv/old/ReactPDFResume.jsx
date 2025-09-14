import React from 'react';
import { 
  Document, Page, Text, View, StyleSheet, PDFViewer, Image 
} from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';

const ResumePDFViewer = ({ formData, theme = 'light' }) => {
  const { t } = useTranslation(); 
  const getStyles = (theme) => StyleSheet.create({
    page: {
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#FFFFFF',
      padding: 50,
      fontFamily: 'Helvetica',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    header: {
      flexDirection: 'row',
      marginBottom: 10,
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'column',
      width: '70%',
    },
    headerRight: {
      width: 80,
      height: 80,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 50,
      objectFit: 'cover',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    title: {
      fontSize: 16,
      color: theme === 'dark' ? '#cccccc' : '#666',
      marginBottom: 10,
    },
    contactInfo: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 5,
    },
    contactItem: {
      fontSize: 10,
      marginRight: 15,
      marginBottom: 3,
      color: theme === 'dark' ? '#cccccc' : '#000000',
    },
    personalDetails: {
      marginTop: 5,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    personalDetailItem: {
      fontSize: 10,
      marginRight: 15,
      marginBottom: 3,
      color: theme === 'dark' ? '#cccccc' : '#000000',
    },
    summary: {
      fontSize: 12,
      lineHeight: 1.6,
      marginBottom: 10,
      textAlign: 'justify',
      color: theme === 'dark' ? '#cccccc' : '#000000',
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#4dabf7' : '#158bd5',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#4dabf7' : '#158bd5',
      paddingBottom: 2,
    },
    itemContainer: {
      marginBottom: 10,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
    },
    itemTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      maxWidth: '50%',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    itemSubtitle: {
      fontSize: 12,
      fontStyle: 'italic',
      textAlign: 'right',
      maxWidth: '70%',
      color: theme === 'dark' ? '#cccccc' : '#000000',
    },
    itemDates: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
      fontSize: 10,
      color: theme === 'dark' ? '#cccccc' : '#666',
    },
    itemDescription: {
      fontSize: 10,
      marginTop: 3,
      lineHeight: 1.5,
      color: theme === 'dark' ? '#cccccc' : '#000000',
    },
    skills: {
      fontSize: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      lineHeight: 1.5,
    },
    skillItem: {
      marginRight: 5,
      marginBottom: 3,
      color: theme === 'dark' ? '#cccccc' : '#000000',
    },
    referenceContainer: {
      marginBottom: 8,
    },
    referenceText: {
      fontSize: 10,
      marginBottom: 2,
      color: theme === 'dark' ? '#cccccc' : '#000000',
    },
    referenceItalic: {
      fontSize: 10,
      fontStyle: 'italic',
      marginBottom: 2,
      color: theme === 'dark' ? '#cccccc' : '#000000',
    },
    customSection: {
      fontSize: 10,
      lineHeight: 1.5,
      textAlign: 'justify',
      color: theme === 'dark' ? '#cccccc' : '#000000',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 10,
      bottom: 20,
      right: 30,
      color: theme === 'dark' ? '#cccccc' : '#666',
    },
    extracurricularSection: {
      marginBottom: 15,
    },
    extracurricularTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#4dabf7' : '#158bd5',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'dark' ? '#4dabf7' : '#158bd5',
      paddingBottom: 2,
    },
    extracurricularItem: {
      marginBottom: 8,
    },
    extracurricularName: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 3,
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    extracurricularDescription: {
      fontSize: 10,
      lineHeight: 1.5,
      color: theme === 'dark' ? '#cccccc' : '#000000',
    },
  });
 
  const hasValidData = (section, keyToCheck) => {
    return section && Array.isArray(section) && section.some(item => item[keyToCheck]);
  }; 

  const hasReferences = (referrals) => {
    if (!referrals) return false;
    if (referrals.providedOnRequest) return true;
    return Array.isArray(referrals) && referrals.some(ref => ref && ref.name);
  };
 
  const PDFResume = ({ formData, theme = 'light' }) => {
    const { t } = useTranslation();
    const styles = getStyles(theme); // Dynamically get styles based on theme

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.name}>{formData.personal_info.full_name || t('resume.personal_info.full_name_placeholder')}</Text>
              <Text style={styles.title}>{formData.personal_info.title || ''}</Text>
              
              {/* Primary Contact Info */}
              <View style={styles.contactInfo}>
                {formData.personal_info.email && (
                  <Text style={styles.contactItem}>{formData.personal_info.email}</Text>
                )}
                {formData.personal_info.mobile && (
                  <Text style={styles.contactItem}>{formData.personal_info.mobile}</Text>
                )}
                {formData.personal_info.city && (
                  <Text style={styles.contactItem}>{formData.personal_info.city}</Text>
                )}
                {formData.personal_info.address && (
                  <Text style={styles.contactItem}>{formData.personal_info.address}</Text>
                )}
                {formData.personal_info.postal_code && (
                  <Text style={styles.contactItem}>{t('resume.personal_info.postal_code')}: {formData.personal_info.postal_code}</Text>
                )}
              </View>
              
              {/* Online Presence */}
              <View style={styles.contactInfo}>
                {formData.personal_info.linkedin && (
                  <Text style={styles.contactItem}>LinkedIn: {formData.personal_info.linkedin}</Text>
                )}
                {formData.personal_info.website && (
                  <Text style={styles.contactItem}>{t('resume.personal_info.website')}: {formData.personal_info.website}</Text>
                )}
              </View>
              
              {/* Additional Personal Details */}
              <View style={styles.personalDetails}>
                {formData.personal_info.nationality && (
                  <Text style={styles.personalDetailItem}>{t('resume.personal_info.nationality')}: {formData.personal_info.nationality}</Text>
                )}
                {formData.personal_info.driving_license && (
                  <Text style={styles.personalDetailItem}>{t('resume.personal_info.driving_license')}: {formData.personal_info.driving_license}</Text>
                )}
                {formData.personal_info.place_of_birth && (
                  <Text style={styles.personalDetailItem}>{t('resume.personal_info.place_of_birth')}: {formData.personal_info.place_of_birth}</Text>
                )}
                {formData.personal_info.date_of_birth && (
                  <Text style={styles.personalDetailItem}>{t('resume.personal_info.date_of_birth')}: {formData.personal_info.date_of_birth}</Text>
                )}
              </View>
            </View>
            
            {formData.photos && formData.photos.length > 0 && formData.photos[0].photo && (
              <View style={styles.headerRight}>
                <Image
                  src={formData.photos[0].photo}
                  style={styles.profileImage}
                />
              </View>
            )}
          </View>

          {/* Summary Section */}
          {formData.personal_info.summary && (
            <View style={styles.summary}>
              <Text>{formData.personal_info.summary}</Text>
            </View>
          )}

          {/* Experience Section */}
          {hasValidData(formData.experiences, 'company') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('resume.experience.title').toUpperCase()}</Text>
              {formData.experiences
                .filter(exp => exp.company)
                .map((exp, index) => (
                  <View key={index} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{exp.company}</Text>
                      <Text style={styles.itemSubtitle}>{exp.position}</Text>
                    </View>
                    <View style={styles.itemDates}>
                      <Text>
                        {exp.start_date} - {exp.current ? t('common.tonow') : exp.end_date || ''}
                      </Text>
                      <Text>{exp.location}</Text>
                    </View>
                    {exp.description && (
                      <Text style={styles.itemDescription}>{exp.description}</Text>
                    )}
                  </View>
                ))}
            </View>
          )}

          {/* Education Section */}
          {hasValidData(formData.educations, 'institution') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('resume.education.title').toUpperCase()}</Text>
              {formData.educations
                .filter(edu => edu.institution)
                .map((edu, index) => (
                  <View key={index} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{edu.institution}</Text>
                      <Text style={styles.itemSubtitle}>
                        {edu.degree}{edu.field_of_study ? `, ${edu.field_of_study}` : ''}
                      </Text>
                    </View>
                    <View style={styles.itemDates}>
                      <Text>
                        {edu.start_date} - {edu.current ? t('common.tonow') : edu.end_date || ''}
                      </Text>
                      <Text>{edu.location}</Text>
                    </View>
                    {edu.gpa && (
                      <Text style={styles.itemDescription}>GPA: {edu.gpa}</Text>
                    )}
                  </View>
                ))}
            </View>
          )}

          {/* Skills Section */}
          {hasValidData(formData.skills, 'name') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('resume.skills.title').toUpperCase()}</Text>
              <View style={styles.skills}>
                {formData.skills
                  .filter(skill => skill.name)
                  .map((skill, index, array) => (
                    <Text key={index} style={styles.skillItem}>
                      {skill.name} ({skill.level})
                      {index < array.length - 1 ? ' • ' : ''}
                    </Text>
                  ))}
              </View>
            </View>
          )}

          {/* Languages Section */}
          {hasValidData(formData.languages, 'language') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('resume.languages.title').toUpperCase()}</Text>
              <View style={styles.skills}>
                {formData.languages
                  .filter(lang => lang.language)
                  .map((lang, index, array) => (
                    <Text key={index} style={styles.skillItem}>
                      {lang.language} ({lang.proficiency})
                      {index < array.length - 1 ? ' • ' : ''}
                    </Text>
                  ))}
              </View>
            </View>
          )}
          
          {/* Courses Section */}
          {hasValidData(formData.courses, 'name') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('resume.courses.title').toUpperCase()}</Text>
              {formData.courses
                .filter(course => course.name)
                .map((course, index) => (
                  <View key={index} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>
                        {course.name}
                        {course.institution && ` at ${course.institution}`}
                      </Text>
                    </View>
                    {course.description && (
                      <Text style={styles.itemDescription}>{course.description}</Text>
                    )}
                  </View>
                ))}
            </View>
          )}

          {/* Internships Section */}
          {hasValidData(formData.internships, 'company') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('resume.internships.title').toUpperCase()}</Text>
              {formData.internships
                .filter(internship => internship.company)
                .map((internship, index) => (
                  <View key={index} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{internship.company}</Text>
                      <Text style={styles.itemSubtitle}>{internship.position}</Text>
                    </View>
                    <View style={styles.itemDates}>
                      <Text>
                        {internship.start_date} - {internship.current ? t('common.tonow') : internship.end_date || ''}
                      </Text>
                      <Text>{internship.location}</Text>
                    </View>
                    {internship.description && (
                      <Text style={styles.itemDescription}>{internship.description}</Text>
                    )}
                  </View>
                ))}
            </View>
          )}

          {/* Custom Sections */}
          {formData.custom_sections && formData.custom_sections.some(section => section.title && section.content) && (
            <>
              {formData.custom_sections
                .filter(section => section.title && section.content)
                .map((section, index) => (
                  <View key={index} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
                    <Text style={styles.customSection}>{section.content}</Text>
                  </View>
                ))}
            </>
          )}
          
          {/* Hobbies Section */}
          {hasValidData(formData.hobbies, 'name') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('resume.hobbies.title').toUpperCase()}</Text>
              <View style={styles.skills}>
                {formData.hobbies
                  .filter(hobby => hobby.name)
                  .map((hobby, index, array) => (
                    <Text key={index} style={styles.skillItem}>
                      {hobby.name}
                      {index < array.length - 1 ? ' • ' : ''}
                    </Text>
                  ))}
              </View>
            </View>
          )}
          
          {/* Extracurricular Activities */}
          {hasValidData(formData.extracurriculars, 'name') && (
            <View style={styles.extracurricularSection}>
              <Text style={styles.extracurricularTitle}>{t('resume.extracurricular.activity').toUpperCase()}</Text>
              {formData.extracurriculars
                .filter(activity => activity.name)
                .map((activity, index) => (
                  <View key={index} style={styles.extracurricularItem}>
                    <Text style={styles.extracurricularName}>{activity.name}</Text>
                    {activity.description && (
                      <Text style={styles.extracurricularDescription}>
                        {activity.description}
                      </Text>
                    )}
                  </View>
                ))}
            </View>
          )}

          {/* References Section - Only show if there are valid references */}
          {hasReferences(formData.referrals) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('resume.references.title').toUpperCase()}</Text>
              
              {formData.referrals.providedOnRequest ? (
                <Text style={styles.referenceItalic}>{t('resume.references.provide_upon_request')}</Text>
              ) : (
                formData.referrals 
                  .filter(ref => ref && ref.name)
                  .map((ref, index) => (
                    <View key={index} style={styles.referenceContainer}>
                      <Text style={[styles.referenceText, { fontWeight: 'bold' }]}>{ref.name}</Text>
                      <Text style={styles.referenceItalic}>{ref.relation}</Text>
                      <View style={{ flexDirection: 'row' }}>
                        {ref.email && <Text style={styles.referenceText}>{ref.email}  </Text>}
                        {ref.phone && <Text style={styles.referenceText}>{ref.phone}</Text>}
                      </View>
                    </View>
                  ))
              )}
            </View>
          )}

          {/* Page Number */}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        </Page>
      </Document>
    );
  };
 
  return (
    <div className="flex flex-col items-center w-full">
      <div className="h-[750px] w-full border border-gray-300 shadow-md">
        <PDFViewer width="100%" height="100%">
          <PDFResume formData={formData} theme={theme} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default ResumePDFViewer;