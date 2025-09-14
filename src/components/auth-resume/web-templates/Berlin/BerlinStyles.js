/**
 * Styling for the Berlin template
 * Minimalist geometric design with clean lines
 */
export const getBerlinStyles = (darkMode, settings) => {
    const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;
  
    const colors = {
      background: darkMode ? '#1c1c1c' : '#ffffff',
      sidebarBg: darkMode ? '#2c2c2c' : '#f5f5f5',
      text: darkMode ? '#e0e0e0' : '#333333',
      textLight: darkMode ? '#a0a0a0' : '#666666',
      heading: darkMode ? '#ffffff' : '#222222',
      headingBar: accentColor,
      timelineDot: accentColor,
      timelineConnector: darkMode ? '#555555' : '#dddddd',
      cardBg: darkMode ? '#3a3a3a' : '#ffffff',
      cardBorder: darkMode ? '#444444' : '#eeeeee',
      cardShadow: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)',
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
        display: 'flex',
        boxShadow: darkMode ? '0 0 20px rgba(0, 0, 0, 0.5)' : '0 0 20px rgba(0, 0, 0, 0.1)',
      },
  
      // Sidebar (left column)
      sidebar: {
        width: '30%',
        backgroundColor: colors.sidebarBg,
        padding: '40px 25px',
        boxSizing: 'border-box',
      },
  
      // Profile section
      profile: {
        textAlign: 'left',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: `2px solid ${accentColor}`,
      },
      name: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: colors.heading,
        margin: '0 0 5px 0',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
      },
      title: {
        fontSize: '16px',
        color: accentColor,
        fontWeight: '400',
      },
  
      // Sidebar section common styles
      sidebarSection: {
        marginBottom: '30px',
      },
      sidebarHeading: {
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
        color: accentColor,
        marginBottom: '12px',
        paddingBottom: '5px',
        borderBottom: `1px solid ${colors.timelineConnector}`,
      },
  
      // Contact section
      contactList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      },
      contactItem: {
        display: 'flex',
        alignItems: 'flex-start',
        fontSize: '14px',
      },
      contactIcon: {
        width: '20px',
        marginRight: '8px',
        color: accentColor,
      },
      contactText: {
        flex: 1,
        wordBreak: 'break-word',
      },
  
      // Skills section
      skillList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
      skillItem: {
        marginBottom: '8px',
      },
      skillName: {
        fontSize: '14px',
        marginBottom: '5px',
      },
      skillBar: {
        height: '4px',
        backgroundColor: colors.timelineConnector,
        borderRadius: '2px',
        overflow: 'hidden',
      },
      skillBarFill: {
        height: '100%',
        backgroundColor: accentColor,
      },
  
      // Languages section
      languageList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      },
      languageItem: {
        fontSize: '14px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      },
      languageName: {
        fontWeight: '500',
      },
      languageDot: {
        margin: '0 5px',
        color: accentColor,
      },
      languageLevel: {
        color: colors.textLight,
      },
  
      // Personal details
      personalList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      },
      personalItem: {
        fontSize: '14px',
      },
      personalLabel: {
        color: accentColor,
        fontWeight: '500',
        marginBottom: '2px',
      },
      personalValue: {
        fontSize: '14px',
      },
  
      // Hobbies section
      hobbyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      },
      hobbyText: {
        fontSize: '14px',
        margin: '0',
      },
      hobbyItem: {
        display: 'inline-block',
        fontSize: '13px',
        backgroundColor: colors.cardBg,
        padding: '4px 10px',
        marginRight: '6px',
        marginBottom: '6px',
        borderRadius: '3px',
        border: `1px solid ${colors.cardBorder}`,
      },
  
      // Main content area (right column)
      mainContent: {
        flex: 1,
        padding: '40px 30px',
        backgroundColor: colors.background,
      },
  
      // Section common styles
      section: {
        marginBottom: '30px',
      },
      sectionHeader: {
        marginBottom: '20px',
        position: 'relative',
      },
      sectionHeading: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: colors.heading,
        margin: '0 0 10px 0',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
      },
      sectionBar: {
        height: '3px',
        width: '60px',
        backgroundColor: accentColor,
      },
      sectionContent: {
        paddingLeft: '5px',
      },
  
      // Summary section
      summaryText: {
        fontSize: '15px',
        lineHeight: lineSpacing,
        margin: '0',
      },
  
      // Timeline items for experience, education, internships
      timelineItem: {
        position: 'relative',
        paddingLeft: '25px',
        marginBottom: '25px',
      },
      timelineDot: {
        position: 'absolute',
        left: '0',
        top: '5px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: accentColor,
      },
      timelineConnector: {
        position: 'absolute',
        left: '5px',
        top: '15px',
        width: '2px',
        height: 'calc(100% + 10px)',
        backgroundColor: colors.timelineConnector,
      },
      timelineContent: {
        backgroundColor: colors.cardBg,
        padding: '15px',
        borderRadius: '4px',
        boxShadow: `0 1px 4px ${colors.cardShadow}`,
        border: `1px solid ${colors.cardBorder}`,
      },
      timelineHeader: {
        marginBottom: '10px',
      },
      timelineTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: colors.heading,
        marginBottom: '3px',
      },
      timelineSubtitle: {
        fontSize: '15px',
        color: accentColor,
        marginBottom: '3px',
      },
      timelineDate: {
        fontSize: '14px',
        color: colors.textLight,
      },
      timelineDescription: {
        fontSize: '14px',
        lineHeight: lineSpacing,
        whiteSpace: 'pre-line',
      },
  
      // Education specific
      eduGpa: {
        fontSize: '14px',
        fontWeight: '500',
        marginTop: '5px',
      },
  
      // Courses section
      courseGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
      },
      courseItem: {
        flex: '0 0 calc(50% - 10px)',
        backgroundColor: colors.cardBg,
        padding: '12px',
        borderRadius: '4px',
        boxShadow: `0 1px 3px ${colors.cardShadow}`,
        border: `1px solid ${colors.cardBorder}`,
      },
      courseName: {
        fontSize: '15px',
        fontWeight: '500',
        marginBottom: '3px',
      },
      courseDetails: {
        fontSize: '13px',
        color: colors.textLight,
      },
  
      // Custom sections
      customItem: {
        backgroundColor: colors.cardBg,
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '12px',
        boxShadow: `0 1px 3px ${colors.cardShadow}`,
        border: `1px solid ${colors.cardBorder}`,
      },
      customItemTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '5px',
      },
      customItemSubtitle: {
        fontSize: '14px',
        color: accentColor,
        marginBottom: '3px',
      },
      customItemDate: {
        fontSize: '13px',
        color: colors.textLight,
        marginBottom: '8px',
      },
      customItemContent: {
        fontSize: '14px',
        lineHeight: lineSpacing,
      },
      customContent: {
        fontSize: '14px',
        lineHeight: lineSpacing,
      },
      
      // References section
      referenceText: {
        fontSize: '14px',
        fontStyle: 'italic',
      },
      referenceGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
      },
      referenceItem: {
        flex: '0 0 calc(50% - 15px)',
        backgroundColor: colors.cardBg,
        padding: '15px',
        borderRadius: '4px',
        boxShadow: `0 1px 3px ${colors.cardShadow}`,
        border: `1px solid ${colors.cardBorder}`,
      },
      referenceName: {
        fontSize: '15px',
        fontWeight: 'bold',
        marginBottom: '3px',
      },
      referenceRelation: {
        fontSize: '14px',
        color: accentColor,
        marginBottom: '5px',
      },
      referenceContact: {
        fontSize: '13px',
        color: colors.textLight,
      },
    };
  };
  
  export default getBerlinStyles;