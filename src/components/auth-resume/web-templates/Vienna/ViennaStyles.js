/**
 * Styling for the Vienna template
 * Elegant European design with classical styling
 */
export const getViennaStyles = (darkMode, settings) => {
    const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;
  
    const colors = {
      background: darkMode ? '#1c1c1c' : '#f8f6f2',
      contentBg: darkMode ? '#282828' : '#ffffff',
      text: darkMode ? '#e0e0e0' : '#333333',
      textSecondary: darkMode ? '#a0a0a0' : '#666666',
      heading: darkMode ? '#ffffff' : '#3c3c3c',
      border: darkMode ? '#3a3a3a' : '#e0d9d0',
      columnBg: darkMode ? '#333333' : '#f9f8f6',
      cardBg: darkMode ? '#383838' : '#ffffff',
      shadow: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
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
        boxShadow: `0 0 20px ${colors.shadow}`,
        position: 'relative',
      },
  
      // Header styles
      header: {
        display: 'flex',
        padding: '30px 35px',
        backgroundColor: colors.contentBg,
        borderBottom: `3px solid ${accentColor}`,
        position: 'relative',
      },
      headerContent: {
        flex: 1,
      },
      headerOrnament: {
        width: '15px',
        backgroundColor: accentColor,
      },
      name: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: colors.heading,
        margin: '0 0 8px 0',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '2px' : 'normal',
      },
      title: {
        fontSize: '18px',
        color: accentColor,
        fontWeight: '500',
        marginBottom: '15px',
      },
      
      // Contact bar
      contactBar: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginTop: '15px',
      },
      contactItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        marginRight: '15px',
      },
      contactIcon: {
        marginRight: '8px',
        color: accentColor,
      },
  
      // Main content
      content: {
        backgroundColor: colors.contentBg,
        padding: '30px 35px',
      },
  
      // Section for full-width content
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
      },
      sectionContent: {
        padding: '0 5px',
      },
      summary: {
        fontSize: '15px',
        lineHeight: lineSpacing,
        margin: '0',
        color: colors.text,
      },
  
      // Three-column layout
      threeColumnLayout: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginTop: '30px',
      },
      column: {
        flex: '1 1 250px',
      },
  
      // Column section styles
      columnSection: {
        marginBottom: '25px',
        backgroundColor: colors.columnBg,
        padding: '15px',
        borderRadius: '5px',
        border: `1px solid ${colors.border}`,
      },
      columnHeading: {
        fontSize: '18px',
        color: accentColor,
        fontWeight: 'bold',
        margin: '0 0 12px 0',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '5px',
      },
      columnContent: {
        padding: '0 5px',
      },
  
      // Experience items
      experienceItem: {
        marginBottom: '15px',
      },
      experienceHeader: {
        marginBottom: '8px',
      },
      experienceTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: colors.heading,
        marginBottom: '3px',
      },
      experienceCompany: {
        fontSize: '15px',
        color: accentColor,
        marginBottom: '3px',
      },
      experienceDate: {
        fontSize: '14px',
        color: colors.textSecondary,
      },
      experienceDescription: {
        fontSize: '14px',
        lineHeight: lineSpacing,
      },
  
      // Education items
      educationItem: {
        marginBottom: '15px',
      },
      educationHeader: {
        marginBottom: '8px',
      },
      educationDegree: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: colors.heading,
        marginBottom: '3px',
      },
      educationInstitution: {
        fontSize: '15px',
        color: accentColor,
        marginBottom: '3px',
      },
      educationDate: {
        fontSize: '14px',
        color: colors.textSecondary,
      },
      educationDescription: {
        fontSize: '14px',
        lineHeight: lineSpacing,
      },
  
      // Skills section
      skillsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
      skillItem: {
        marginBottom: '10px',
      },
      skillName: {
        fontSize: '14px',
        marginBottom: '5px',
      },
      skillLevel: {
        display: 'flex',
        gap: '5px',
      },
      skillCircle: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
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
        paddingBottom: '8px',
        marginBottom: '5px',
        borderBottom: `1px dotted ${colors.border}`,
      },
      languageName: {
        fontSize: '14px',
        fontWeight: '500',
      },
      languageProficiency: {
        fontSize: '13px',
        color: colors.textSecondary,
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
        marginBottom: '5px',
        border: `1px solid ${colors.border}`,
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
        fontSize: '15px',
        fontWeight: '500',
        marginBottom: '3px',
      },
      courseDetails: {
        fontSize: '13px',
        color: colors.textSecondary,
      },
  
      // Internships section
      internshipItem: {
        marginBottom: '15px',
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
        marginBottom: '5px',
      },
      internshipDescription: {
        fontSize: '13px',
        lineHeight: lineSpacing,
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
      },
  
      // References section
      referenceText: {
        fontSize: '14px',
        fontStyle: 'italic',
      },
      referencesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      },
      referenceItem: {
        backgroundColor: colors.cardBg,
        padding: '10px',
        borderRadius: '5px',
        border: `1px solid ${colors.border}`,
        marginBottom: '10px',
      },
      referenceName: {
        fontSize: '15px',
        fontWeight: 'bold',
        marginBottom: '3px',
      },
      referencePosition: {
        fontSize: '14px',
        color: accentColor,
        marginBottom: '5px',
      },
      referenceContact: {
        fontSize: '13px',
        color: colors.textSecondary,
      },
  
      // Custom sections
      customItemsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      },
      customItem: {
        backgroundColor: colors.columnBg,
        padding: '15px',
        borderRadius: '5px',
        border: `1px solid ${colors.border}`,
        marginBottom: '10px',
      },
      customItemTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: colors.heading,
        marginBottom: '3px',
      },
      customItemSubtitle: {
        fontSize: '15px',
        color: accentColor,
        marginBottom: '3px',
      },
      customItemDate: {
        fontSize: '14px',
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
  
  export default getViennaStyles;