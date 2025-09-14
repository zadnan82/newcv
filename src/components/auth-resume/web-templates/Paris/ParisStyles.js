/**
 * Styling for the Paris template
 * Elegant French-inspired design with artistic touches
 * Fixed to properly apply custom settings
 */
export const getParisStyles = (darkMode, settings) => {
  const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;

  const colors = {
    background: darkMode ? '#121212' : '#ffffff',
    backgroundAlt: darkMode ? '#1a1a1a' : '#f9f9f9',
    text: darkMode ? '#e0e0e0' : '#333333',
    textSecondary: darkMode ? '#a0a0a0' : '#666666',
    heading: darkMode ? '#ffffff' : '#222222',
    border: darkMode ? '#333333' : '#e0e0e0',
    cardBg: darkMode ? '#1e1e1e' : '#ffffff',
    shadow: darkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
  };

  return {
    // Main container
    container: {
      fontFamily,
      lineHeight: lineSpacing,
      color: colors.text,
      backgroundColor: colors.background,
      maxWidth: '850px',
      margin: '0 auto',
      boxShadow: `0 0 25px ${colors.shadow}`,
      position: 'relative',
    },

    // Decorative header at the top
    decorativeHeader: {
      height: '15px',
      backgroundColor: accentColor,
      width: '100%',
    },

    // Main content container
    content: {
      padding: '30px',
    },

    // Header with name and contact info
    header: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: '30px',
      borderBottom: `3px solid ${accentColor}`,
      paddingBottom: '20px',
    },
    headerLeft: {
      flex: '1 1 300px',
      marginRight: '20px',
      marginBottom: '15px',
    },
    name: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: colors.heading,
      margin: '0 0 5px 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : 'normal',
    },
    title: {
      fontSize: '18px',
      color: accentColor,
      fontWeight: '400',
      fontStyle: 'italic',
    },
    contactInfo: {
      flex: '1 1 300px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '10px',
      alignContent: 'center',
    },
    contactItem: {
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
    },
    contactIcon: {
      marginRight: '8px',
      color: accentColor,
    },

    // Two-column layout
    twoColumnLayout: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '30px',
    },
    mainColumn: {
      flex: '2 1 450px',
    },
    sidebar: {
      flex: '1 1 250px',
      backgroundColor: colors.backgroundAlt,
      padding: '20px',
      borderRadius: '5px',
      border: `1px solid ${colors.border}`,
      boxShadow: `0 2px 5px ${colors.shadow}`,
    },

    // Main column sections
    section: {
      marginBottom: '30px',
    },
    sectionHeading: {
      fontSize: '22px',
      color: accentColor,
      fontWeight: 'bold',
      margin: '0 0 15px 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : 'normal',
      borderBottom: `2px solid ${colors.border}`,
      paddingBottom: '8px',
      position: 'relative',
    },
    sectionContent: {
      padding: '0 0 0 10px',
    },

    // Summary section
    summary: {
      fontSize: '15px',
      lineHeight: lineSpacing,
      margin: '0',
    },

    // Experience section
    experienceItem: {
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: `1px dashed ${colors.border}`,
    },
    experienceHeader: {
      marginBottom: '10px',
    },
    experienceTitle: {
      fontSize: '17px',
      fontWeight: 'bold',
      color: colors.heading,
      marginBottom: '3px',
    },
    experienceCompany: {
      fontSize: '16px',
      color: accentColor,
      marginBottom: '3px',
      fontStyle: 'italic',
    },
    experienceDate: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    experienceDescription: {
      fontSize: '14px',
      lineHeight: lineSpacing,
      whiteSpace: 'pre-line',
    },

    // Education section
    educationItem: {
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: `1px dashed ${colors.border}`,
    },
    educationHeader: {
      marginBottom: '10px',
    },
    educationDegree: {
      fontSize: '17px',
      fontWeight: 'bold',
      color: colors.heading,
      marginBottom: '3px',
    },
    educationInstitution: {
      fontSize: '16px',
      color: accentColor,
      marginBottom: '3px',
      fontStyle: 'italic',
    },
    educationDate: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    educationDescription: {
      fontSize: '14px',
      lineHeight: lineSpacing,
    },
    educationGpa: {
      fontSize: '14px',
      fontWeight: '500',
      marginTop: '5px',
    },

    // References section
    referenceText: {
      fontSize: '14px',
      fontStyle: 'italic',
      lineHeight: lineSpacing,
    },
    referenceItem: {
      marginBottom: '15px',
      padding: '15px',
      backgroundColor: colors.cardBg,
      borderRadius: '4px',
      boxShadow: `0 1px 3px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
    },
    referenceName: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '3px',
    },
    referencePosition: {
      fontSize: '14px',
      color: accentColor,
      marginBottom: '8px',
      fontStyle: 'italic',
    },
    referenceContact: {
      fontSize: '13px',
      color: colors.textSecondary,
      lineHeight: lineSpacing,
    },
    referenceEmail: {
      marginBottom: '3px',
    },
    referencePhone: {
      marginBottom: '3px',
    },

    // Sidebar sections
    sideSection: {
      marginBottom: '25px',
    },
    sideSectionHeading: {
      fontSize: '18px',
      color: accentColor,
      fontWeight: 'bold',
      margin: '0 0 12px 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : 'normal',
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: '5px',
    },
    sideSectionContent: {
      padding: '0 0 0 5px',
    },

    // Skills section
    skillsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    skillItem: {
      marginBottom: '5px',
    },
    skillName: {
      fontSize: '14px',
      marginBottom: '5px',
    },
    skillBar: {
      height: '5px',
      backgroundColor: colors.border,
      borderRadius: '3px',
      overflow: 'hidden',
    },
    skillBarFill: {
      height: '100%',
      backgroundColor: accentColor,
    },

    // Languages section
    languagesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    languageItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '5px',
    },
    languageName: {
      fontSize: '14px',
      fontWeight: '500',
    },
    languageProficiency: {
      fontSize: '13px',
    },
    languageBadge: {
      backgroundColor: accentColor,
      color: '#ffffff',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '12px',
    },

    // Internships section
    internshipsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    internshipItem: {
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: colors.cardBg,
      borderRadius: '4px',
      border: `1px solid ${colors.border}`,
    },
    internshipTitle: {
      fontSize: '15px',
      fontWeight: 'bold',
      marginBottom: '3px',
    },
    internshipCompany: {
      fontSize: '14px',
      color: accentColor,
      marginBottom: '3px',
    },
    internshipDate: {
      fontSize: '13px',
      color: colors.textSecondary,
    },

    // Courses section
    coursesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    courseItem: {
      marginBottom: '10px',
    },
    courseName: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '3px',
    },
    courseDetails: {
      fontSize: '13px',
      color: colors.textSecondary,
      lineHeight: lineSpacing,
    },

    // Hobbies section
    hobbiesText: {
      fontSize: '14px',
      margin: '0',
      lineHeight: lineSpacing,
    },
    hobbiesList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    hobbyItem: {
      fontSize: '13px',
      backgroundColor: colors.cardBg,
      padding: '4px 10px',
      borderRadius: '15px',
      marginBottom: '8px',
      border: `1px solid ${colors.border}`,
    },

    // Personal details
    personalList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    personalItem: {
      marginBottom: '8px',
    },
    personalLabel: {
      fontSize: '13px',
      color: accentColor,
      fontWeight: '500',
      marginBottom: '3px',
    },
    personalValue: {
      fontSize: '14px',
      lineHeight: lineSpacing,
    },

    // Custom sections
    customItemsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    customItem: {
      marginBottom: '10px',
    },
    customItemTitle: {
      fontSize: '15px',
      fontWeight: 'bold',
      marginBottom: '3px',
    },
    customItemSubtitle: {
      fontSize: '14px',
      color: accentColor,
      marginBottom: '3px',
    },
    customItemDate: {
      fontSize: '13px',
      color: colors.textSecondary,
      marginBottom: '5px',
    },
    customItemContent: {
      fontSize: '14px',
      lineHeight: lineSpacing,
    },
    customContent: {
      fontSize: '14px',
      lineHeight: lineSpacing,
    },
  };
};

export default getParisStyles;