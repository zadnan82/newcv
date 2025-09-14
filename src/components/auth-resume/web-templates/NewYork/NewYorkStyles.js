/**
 * New York Resume Styles
 * Professional styling for the New York resume template
 * Supports both normal display and PDF export modes
 * Properly handles custom settings application
 */
export const getNewYorkStyles = (darkMode, settings, isPdfMode = false) => {
  const { 
    primaryColor,
    accentColor, 
    secondaryColor,
    backgroundColor, 
    sidebarColor, 
    sidebarTextColor,
    fontFamily, 
    headingFontFamily,
    lineSpacing, 
    headingsUppercase
  } = settings;

  // Always use light mode for PDF export
  const effectiveDarkMode = isPdfMode ? false : darkMode;

  // Base color scheme
  const colors = {
    background: effectiveDarkMode ? '#121212' : backgroundColor,
    backgroundSecondary: effectiveDarkMode ? '#1e1e1e' : sidebarColor,
    text: effectiveDarkMode ? '#f1f1f1' : '#2c3e50',
    textSecondary: effectiveDarkMode ? '#b0b0b0' : '#5d6778',
    textSidebar: effectiveDarkMode ? '#e0e0e0' : sidebarTextColor,
    border: effectiveDarkMode ? '#444444' : '#e9ecef',
    card: effectiveDarkMode ? '#252525' : '#ffffff',
    cardBorder: effectiveDarkMode ? '#3a3a3a' : '#edf2f7',
    shadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.08)',
    accentShadow: `${accentColor}33`, // 20% transparent version of accent color
    accentLight: effectiveDarkMode ? `${accentColor}99` : `${accentColor}22`, // Lighter accent color variant
  };

  // PDF-specific colors
  if (isPdfMode) {
    colors.background = '#ffffff';
    colors.backgroundSecondary = '#f8f9fa';
    colors.text = '#2c3e50';
    colors.textSecondary = '#5d6778';
    colors.textSidebar = '#1D3557';
    colors.border = '#e9ecef';
    colors.card = '#ffffff';
    colors.cardBorder = '#edf2f7';
    colors.shadow = 'rgba(0, 0, 0, 0.08)';
  }

  return {
    // Main container
    container: {
      fontFamily,
      backgroundColor: colors.background,
      color: colors.text,
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0',
      lineHeight: lineSpacing,
      boxShadow: isPdfMode ? 'none' : '0 5px 25px rgba(0,0,0,0.1)',
      position: 'relative',
      overflowX: 'hidden',
    },
    
    // Header
    header: {
      backgroundColor: primaryColor,
      padding: '40px 0 20px',
      width: '100%',
      position: 'relative',
    },
    headerInner: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingLeft: '50px',
      paddingRight: '50px',
    },
    headerContent: {
      width: '100%',
      zIndex: 2,
    },
    name: {
      fontFamily: headingFontFamily,
      color: '#ffffff',
      fontSize: '42px',
      fontWeight: '700',
      margin: '0 0 10px 0',
      letterSpacing: '1px',
      position: 'relative',
      display: 'inline-block',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
    },
    titleBar: {
      display: 'inline-block',
      backgroundColor: accentColor,
      padding: '6px 15px',
      position: 'relative',
      transform: 'translateY(-5px)',
    },
    titleText: {
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    
    // Contact section
    contactSection: {
      backgroundColor: secondaryColor,
      padding: '12px 50px',
      width: '100%',
    },
    contactGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      color: '#ffffff',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      marginRight: '20px',
      fontSize: '14px',
      marginBottom: '5px',
    },
    contactIcon: {
      marginRight: '8px',
      fontSize: '16px',
    },
    contactText: {
      fontWeight: '300',
    },
    
    // Main grid layout
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gap: '0',
      width: '100%',
    },
    
    // Main column styles
    mainColumn: {
      padding: '40px 50px',
      borderRight: isPdfMode ? '1px solid #e2e8f0' : 'none',
      backgroundColor: colors.background,
    },
    section: {
      marginBottom: '35px',
      position: 'relative',
    },
    sectionTitle: {
      position: 'relative',
      marginBottom: '25px',
      paddingBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `2px solid ${accentColor}`,
      fontSize: '20px',
      fontWeight: '700',
      color: primaryColor,
      fontFamily: headingFontFamily,
      letterSpacing: headingsUppercase ? '1px' : '0.5px',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
    },
    summaryText: {
      fontSize: '15px',
      lineHeight: lineSpacing,
      color: colors.text,
      marginBottom: '10px',
    },
    
    // Experience & Education items with timeline
    timelinePoint: {
      position: 'absolute',
      left: '-6px',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: accentColor,
      marginTop: '6px',
    },
    experienceItem: {
      position: 'relative',
      paddingLeft: '20px',
      marginBottom: '25px',
      borderLeft: `2px solid ${primaryColor}20`,
      paddingBottom: '15px',
    },
    educationItem: {
      position: 'relative',
      paddingLeft: '20px',
      marginBottom: '25px',
      borderLeft: `2px solid ${primaryColor}20`,
      paddingBottom: '15px',
    },
    internshipItem: {
      position: 'relative',
      paddingLeft: '20px',
      marginBottom: '25px',
      borderLeft: `2px solid ${primaryColor}20`,
      paddingBottom: '15px',
    },
    extracurricularItem: {
      position: 'relative',
      paddingLeft: '20px',
      marginBottom: '25px',
      borderLeft: `2px solid ${primaryColor}20`,
      paddingBottom: '15px',
    },
    customItem: {
      position: 'relative',
      paddingLeft: '20px',
      marginBottom: '25px',
      borderLeft: `2px solid ${primaryColor}20`,
      paddingBottom: '15px',
    },
    itemContent: {
      paddingLeft: '15px',
    },
    itemHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    },
    itemTitle: {
      fontSize: '17px',
      fontWeight: '600',
      color: primaryColor,
      marginBottom: '5px',
      marginTop: '0',
      flex: '1',
      minWidth: '200px',
    },
    itemDate: {
      fontSize: '14px',
      color: accentColor,
      fontWeight: '500',
      textAlign: 'right',
      marginBottom: '5px',
    },
    itemSubtitle: {
      marginBottom: '8px',
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    companyName: {
      fontWeight: '500',
      color: secondaryColor,
    },
    locationText: {
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    itemDescription: {
      fontSize: '14px',
      color: colors.text,
      lineHeight: lineSpacing,
      whiteSpace: 'pre-line',
    },
    gpaLabel: {
      fontWeight: '500',
    },
    
    // Sidebar styles
    sidebar: {
      backgroundColor: colors.backgroundSecondary,
      padding: '40px 30px',
      color: colors.textSidebar,
    },
    sidebarSection: {
      marginBottom: '30px',
    },
    sidebarSectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: primaryColor,
      marginBottom: '15px',
      paddingBottom: '5px',
      borderBottom: `2px solid ${accentColor}`,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : '0.5px',
      fontFamily: headingFontFamily,
    },
    
    // Personal details
    personalDetails: {
      marginBottom: '20px',
    },
    personalDetailItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      fontSize: '14px',
    },
    
    // Skills
    skillsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    skillItem: {
      marginBottom: '5px',
    },
    skillHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
    },
    skillName: {
      fontSize: '14px',
      fontWeight: '500',
    },
    skillLevelText: {
      fontSize: '12px',
      color: colors.textSecondary,
    },
    skillLevel: {
      height: '5px',
      backgroundColor: '#e2e8f0',
      borderRadius: '2px',
      overflow: 'hidden',
    },
    skillLevelBar: {
      height: '100%',
      backgroundColor: accentColor,
      borderRadius: '2px',
    },
    
    // Languages
    languagesGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    languageItem: {
      marginBottom: '10px',
    },
    languageName: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '5px',
    },
    languageProficiency: {
      fontSize: '13px',
      color: colors.textSecondary,
      marginBottom: '5px',
    },
    languageDots: {
      display: 'flex',
      gap: '5px',
    },
    languageDotFilled: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: accentColor,
    },
    languageDotEmpty: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: '#e2e8f0',
      border: `1px solid ${accentColor}`,
    },
    
    // Courses & Certifications
    coursesGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    courseItem: {
      marginBottom: '15px',
      padding: '10px',
      backgroundColor: 'rgba(255,255,255,0.5)',
      borderLeft: `3px solid ${accentColor}`,
      borderRadius: '0 4px 4px 0',
    },
    courseName: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '3px',
    },
    courseInstitution: {
      fontSize: '13px',
      color: colors.textSecondary,
      marginBottom: '3px',
    },
    courseDate: {
      fontSize: '12px',
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    
    // Hobbies
    hobbiesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    hobbyItem: {
      backgroundColor: 'rgba(255,255,255,0.5)',
      color: primaryColor,
      padding: '5px 10px',
      borderRadius: '15px',
      fontSize: '13px',
      display: 'inline-block',
      margin: '3px 0',
      border: `1px solid ${primaryColor}20`,
    },
    hobbyText: {
      fontSize: '14px',
      lineHeight: lineSpacing,
    },
    
    // References
    referencesGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    referenceItem: {
      padding: '10px 15px',
      backgroundColor: 'rgba(255,255,255,0.5)',
      borderRadius: '4px',
      border: `1px solid ${primaryColor}20`,
    },
    referenceName: {
      fontSize: '15px',
      fontWeight: '600',
      marginBottom: '3px',
      color: primaryColor,
    },
    referencePosition: {
      fontSize: '13px',
      color: colors.textSecondary,
      fontStyle: 'italic',
      marginBottom: '5px',
    },
    referenceContact: {
      fontSize: '13px',
      color: colors.text,
    },
    referenceText: {
      fontSize: '14px',
      fontStyle: 'italic',
    },
  };
};