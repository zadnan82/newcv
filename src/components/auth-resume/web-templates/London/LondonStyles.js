/**
 * Styling for the London template
 * British professional style with elegant typography
 */
export const getLondonStyles = (darkMode, settings) => {
    const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;
  
    const colors = {
      background: darkMode ? '#1e1e1e' : '#ffffff',
      text: darkMode ? '#e0e0e0' : '#333333',
      textSecondary: darkMode ? '#a0a0a0' : '#666666',
      heading: darkMode ? '#ffffff' : '#222222',
      border: darkMode ? '#444444' : '#e0e0e0',
      divider: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      sideBackground: darkMode ? '#282828' : '#f8f8f8',
      itemBg: darkMode ? '#333333' : 'rgba(0, 0, 0, 0.02)',
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
        boxShadow: darkMode ? '0 0 10px rgba(0, 0, 0, 0.5)' : '0 0 10px rgba(0, 0, 0, 0.1)',
      },
  
      // Header styles
      header: {
        padding: '40px 50px 30px',
        borderBottom: `5px solid ${accentColor}`,
      },
      name: {
        fontSize: '38px',
        fontWeight: 'bold',
        color: colors.heading,
        margin: '0 0 5px 0',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '2px' : 'normal',
      },
      title: {
        fontSize: '18px',
        color: accentColor,
        fontWeight: '400',
        letterSpacing: '1px',
      },
  
      // Contact bar
      contactBar: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: '15px 50px',
        backgroundColor: colors.sideBackground,
        borderBottom: `1px solid ${colors.divider}`,
      },
      contactItem: {
        flex: '1 1 auto',
        minWidth: '140px',
        padding: '0 10px',
        fontSize: '14px',
        margin: '5px 0',
      },
      contactLabel: {
        color: accentColor,
        fontWeight: 'bold',
        marginBottom: '3px',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        fontSize: '12px',
      },
  
      // Content layout
      content: {
        display: 'flex',
        flexDirection: 'row',
      },
      leftColumn: {
        flex: '2',
        padding: '30px 40px',
      },
      rightColumn: {
        flex: '1',
        padding: '30px 20px',
        backgroundColor: colors.sideBackground,
        borderLeft: `1px solid ${colors.divider}`,
      },
  
      // Main content sections
      section: {
        marginBottom: '30px',
      },
      sectionTitle: {
        fontSize: '22px',
        color: accentColor,
        fontWeight: '600',
        marginBottom: '15px',
        paddingBottom: '5px',
        borderBottom: `1px solid ${colors.divider}`,
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
      },
      sectionContent: {
        marginTop: '15px',
      },
  
      // Summary section
      summaryText: {
        fontSize: '15px',
        lineHeight: lineSpacing,
        margin: '0',
      },
  
      // Experience items
      experienceItem: {
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: `1px solid ${colors.divider}`,
      },
      experienceHeader: {
        marginBottom: '10px',
      },
      experienceTitle: {
        fontSize: '17px',
        fontWeight: 'bold',
        color: colors.heading,
        margin: '0 0 5px 0',
      },
      experienceCompany: {
        fontSize: '15px',
        fontWeight: '500',
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
  
      // Education items
      educationItem: {
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: `1px solid ${colors.divider}`,
      },
      educationHeader: {
        marginBottom: '10px',
      },
      educationDegree: {
        fontSize: '17px',
        fontWeight: 'bold',
        color: colors.heading,
        margin: '0 0 5px 0',
      },
      educationInstitution: {
        fontSize: '15px',
        fontWeight: '500',
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
  
      // Internship items (similar to experience)
      internshipItem: {
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: `1px solid ${colors.divider}`,
      },
      internshipHeader: {
        marginBottom: '10px',
      },
      internshipTitle: {
        fontSize: '17px',
        fontWeight: 'bold',
        color: colors.heading,
        margin: '0 0 5px 0',
      },
      internshipCompany: {
        fontSize: '15px',
        fontWeight: '500',
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
  
      // Courses
      coursesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
      courseItem: {
        padding: '10px 12px',
        backgroundColor: colors.itemBg,
        borderRadius: '4px',
      },
      courseName: {
        fontWeight: 'bold',
        fontSize: '15px',
        marginBottom: '3px',
      },
      courseDetails: {
        fontSize: '13px',
        color: colors.textSecondary,
      },
  
      // Custom sections
      customItem: {
        marginBottom: '15px',
        padding: '10px 0',
        borderBottom: `1px solid ${colors.divider}`,
      },
      customItemTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginBottom: '3px',
      },
      customItemSubtitle: {
        fontSize: '14px',
        color: accentColor,
        marginBottom: '2px',
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
  
      // References
      referenceText: {
        fontSize: '14px',
        fontStyle: 'italic',
      },
      referenceItem: {
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: colors.itemBg,
        borderRadius: '4px',
      },
      referenceName: {
        fontWeight: 'bold',
        fontSize: '15px',
        marginBottom: '3px',
      },
      referenceRelation: {
        fontSize: '14px',
        color: accentColor,
        marginBottom: '5px',
      },
      referenceContact: {
        fontSize: '13px',
        color: colors.textSecondary,
      },
  
      // Right sidebar sections
      sideSection: {
        marginBottom: '30px',
      },
      sideSectionTitle: {
        fontSize: '18px',
        color: accentColor,
        fontWeight: '600',
        marginBottom: '15px',
        paddingBottom: '5px',
        borderBottom: `1px solid ${colors.divider}`,
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
      },
  
      // Skills
      skillsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
      skillItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
      },
      skillName: {
        fontSize: '14px',
        fontWeight: '500',
      },
      skillLevel: {
        display: 'flex',
        gap: '3px',
      },
      skillDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: colors.border,
      },
  
      // Languages
      languagesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      },
      languageItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
      },
      languageName: {
        fontSize: '14px',
        fontWeight: '500',
      },
      languageProficiency: {
        fontSize: '13px',
        color: colors.textSecondary,
      },
  
      // Hobbies
      hobbiesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      },
      hobbiesText: {
        fontSize: '14px',
        margin: '0',
        lineHeight: lineSpacing,
      },
      hobbyItem: {
        fontSize: '14px',
        padding: '5px 10px',
        backgroundColor: colors.itemBg,
        borderRadius: '4px',
        display: 'inline-block',
        marginRight: '8px',
        marginBottom: '8px',
      },
  
      // Personal details
      personalDetailsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
      personalDetailItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      },
      personalDetailLabel: {
        fontSize: '13px',
        color: accentColor,
        fontWeight: 'bold',
      },
      personalDetailValue: {
        fontSize: '14px',
      },
    };
  };
  
  export default getLondonStyles;