/**
 * Styling for the Tokyo template
 * Modern minimalist design with Japanese-inspired clean lines
 */
export const getTokyoStyles = (darkMode, settings) => {
    const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;
  
    const colors = {
      background: darkMode ? '#121212' : '#ffffff',
      backgroundSecondary: darkMode ? '#1e1e1e' : '#f8f8f8',
      text: darkMode ? '#e0e0e0' : '#333333',
      textSecondary: darkMode ? '#a0a0a0' : '#666666',
      heading: darkMode ? '#ffffff' : '#222222',
      border: darkMode ? '#333333' : '#eeeeee',
      cardBg: darkMode ? '#1e1e1e' : '#ffffff',
      shadow: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
    };
  
    return {
      // Main container
      container: {
        fontFamily,
        lineHeight: lineSpacing,
        backgroundColor: colors.background,
        color: colors.text,
        maxWidth: '850px',
        margin: '0 auto',
        boxShadow: darkMode ? '0 0 20px rgba(0, 0, 0, 0.5)' : '0 0 20px rgba(0, 0, 0, 0.1)',
      },
  
      // Header styles
      header: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: '35px 40px',
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.backgroundSecondary,
      },
      headerLeft: {
        flex: '1 1 300px',
        marginRight: '20px',
        marginBottom: '15px',
      },
      headerRight: {
        flex: '1 1 300px',
      },
      name: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: colors.heading,
        margin: '0 0 5px 0',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
      },
      title: {
        fontSize: '18px',
        color: accentColor,
        fontWeight: '500',
      },
      contactInfo: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '10px',
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
  
      // Main content
      mainContent: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      leftColumn: {
        flex: '2 1 500px',
        padding: '30px 40px',
        backgroundColor: colors.background,
      },
      rightColumn: {
        flex: '1 1 250px',
        padding: '30px 25px',
        backgroundColor: colors.backgroundSecondary,
        borderLeft: `1px solid ${colors.border}`,
      },
  
      // Section styles for main column
      section: {
        marginBottom: '35px',
      },
      sectionHeading: {
        fontSize: '20px',
        fontWeight: '600',
        color: colors.heading,
        margin: '0 0 20px 0',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
        position: 'relative',
        paddingBottom: '10px',
        borderBottom: `1px solid ${colors.border}`,
      },
      headingMark: {
        color: accentColor,
        marginRight: '5px',
        fontWeight: 'bold',
      },
      sectionContent: {
        paddingLeft: '8px',
      },
  
      // Summary section
      summary: {
        fontSize: '15px',
        lineHeight: lineSpacing,
        margin: '0',
      },
  
      // Experience items
      experienceItem: {
        marginBottom: '25px',
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
        whiteSpace: 'pre-line',
      },
  
      // Education items - similar to experience
      educationItem: {
        marginBottom: '25px',
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
  
      // Internship items - similar to experience
      internshipItem: {
        marginBottom: '25px',
        paddingBottom: '20px',
        borderBottom: `1px dashed ${colors.border}`,
      },
      internshipHeader: {
        marginBottom: '10px',
      },
      internshipTitle: {
        fontSize: '17px',
        fontWeight: 'bold',
        color: colors.heading,
        marginBottom: '3px',
      },
      internshipCompany: {
        fontSize: '15px',
        color: accentColor,
        marginBottom: '3px',
      },
      internshipDate: {
        fontSize: '14px',
        color: colors.textSecondary,
      },
      internshipDescription: {
        fontSize: '14px',
        lineHeight: lineSpacing,
      },
  
      // References section
      referenceText: {
        fontSize: '14px',
        fontStyle: 'italic',
      },
      referenceList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      },
      referenceItem: {
        padding: '15px',
        backgroundColor: colors.cardBg,
        borderRadius: '4px',
        boxShadow: `0 1px 3px ${colors.shadow}`,
        border: `1px solid ${colors.border}`,
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
  
      // Panel styles for side column
      panel: {
        marginBottom: '30px',
      },
      panelHeading: {
        fontSize: '18px',
        fontWeight: '600',
        color: colors.heading,
        margin: '0 0 15px 0',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
        position: 'relative',
        paddingBottom: '8px',
        borderBottom: `1px solid ${colors.border}`,
      },
      panelContent: {
        paddingLeft: '5px',
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
        marginTop: '3px',
      },
      skillLevelBar: {
        height: '4px',
        backgroundColor: colors.border,
        borderRadius: '2px',
        overflow: 'hidden',
      },
      skillLevelFill: {
        height: '100%',
        backgroundColor: accentColor,
      },
  
      // Languages section
      languagesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
      languageItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px dashed ${colors.border}`,
        paddingBottom: '8px',
      },
      languageName: {
        fontSize: '14px',
        fontWeight: '500',
      },
      languageProficiency: {
        fontSize: '13px',
        color: colors.textSecondary,
      },
  
      // Courses section
      coursesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
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
      },
  
      // Personal details
      personalList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
      personalItem: {
        marginBottom: '10px',
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
        padding: '5px 10px',
        borderRadius: '3px',
        marginBottom: '8px',
        border: `1px solid ${colors.border}`,
      },
  
      // Custom sections
      customItemsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      },
      customItem: {
        marginBottom: '12px',
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
  
  export default getTokyoStyles;