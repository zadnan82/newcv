/**
 * Redesigned styling for the Stockholm template
 * Modern, clean layout with improved visual hierarchy
 * Enhanced with PDF compatibility
 */
export const getStockholmStyles = (darkMode, settings, isPdfMode = false) => {
  const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;

  // Use light mode colors for PDF regardless of darkMode setting
  const effectiveDarkMode = isPdfMode ? false : darkMode;

  // Color scheme - enhanced contrast and visual appeal
  const colors = {
    background: effectiveDarkMode ? '#1a1a1a' : '#ffffff',
    backgroundSecondary: effectiveDarkMode ? '#2d2d2d' : '#f8f9fa',
    text: effectiveDarkMode ? '#f0f0f0' : '#2c3e50',
    textSecondary: effectiveDarkMode ? '#b0b0b0' : '#5d6778',
    border: effectiveDarkMode ? '#444444' : '#e9ecef',
    card: effectiveDarkMode ? '#252525' : '#ffffff',
    cardBorder: effectiveDarkMode ? '#3a3a3a' : '#edf2f7',
    shadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.08)',
    accentShadow: `${accentColor}33`, // 20% transparent version of accent color
    accentLight: effectiveDarkMode ? `${accentColor}99` : `${accentColor}22`, // Lighter accent color variant
  };

  // Base styles with improved spacing and visual hierarchy
  const baseStyles = {
    container: {
      fontFamily,
      lineHeight: lineSpacing,
      backgroundColor: colors.background,
      color: colors.text,
      maxWidth: '850px',
      margin: '0 auto',
      padding: '0',
      boxShadow: `0 8px 30px ${colors.shadow}`,
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    
    // Modernized header with better visual balance
    header: {
      display: 'flex',
      padding: '35px 40px',
      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}DD)`,
      color: '#ffffff',
      position: 'relative',
    },
    headerLeft: {
      width: '150px',
      marginRight: '30px',
      flexShrink: 0,
      position: 'relative',
      zIndex: 2,
    },
    headerContent: {
      flex: '1',
      position: 'relative',
      zIndex: 2,
    },
    profileImageContainer: {
      marginBottom: '15px',
      display: 'flex',
      justifyContent: 'center',
    },
    profileImage: {
      width: '130px',
      height: '130px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid rgba(255, 255, 255, 0.35)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'scale(1.03)',
      },
    },
    name: {
      fontSize: '36px',
      fontWeight: 'bold',
      margin: '0 0 5px 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.5px' : '0.5px',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
    },
    title: {
      fontSize: '20px',
      fontWeight: '500',
      marginBottom: '15px',
      opacity: '0.95',
      letterSpacing: '0.5px',
    },
    contactGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px',
      marginTop: '20px',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      padding: '6px 10px',
      borderRadius: '4px',
      backdropFilter: 'blur(2px)',
      transition: 'background-color 0.2s ease',
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
      },
    },
    contactIcon: {
      marginRight: '8px',
      fontSize: '16px',
    },
    
    // Content layout with improved spacing
    contentLayout: {
      display: 'flex',
      flexDirection: 'row',
    },
    
    // Main column (left) with better card styling
    mainColumn: {
      flex: '1',
      padding: '25px',
      backgroundColor: colors.background,
    },
    section: {
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: accentColor,
      marginBottom: '15px',
      paddingBottom: '8px',
      borderBottom: `2px solid ${accentColor}`,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.2px' : '0.3px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      // Add a subtle accent element
      '::before': {
        content: '""',
        width: '40px',
        height: '2px',
        backgroundColor: accentColor,
        position: 'absolute',
        bottom: '-5px',
        left: '0',
      },
    },
    sectionContent: {
      marginLeft: '0',
    },
    summary: {
      fontSize: '15px',
      lineHeight: lineSpacing,
      padding: '5px 0',
      borderLeft: `3px solid ${colors.accentLight}`,
      paddingLeft: '15px',
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    
    // Enhanced experience items with better card styling
    expItem: {
      marginBottom: '15px',
      padding: '18px',
      borderRadius: '8px',
      backgroundColor: colors.card,
      boxShadow: `0 3px 8px ${colors.shadow}`,
      border: `1px solid ${colors.cardBorder}`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
      // Subtle accent indicator
      '::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        top: '0',
        height: '100%',
        width: '4px',
        backgroundColor: accentColor,
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
      },
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 5px 15px ${colors.shadow}`,
      },
    },
    expHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    expItemSecond: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px', 
      flexWrap: 'wrap',
    },
    expTitle: {
      fontWeight: 'bold',
      fontSize: '17px',
      color: accentColor,
    },
    expDate: {
      fontSize: '14px',
      color: colors.textSecondary,
      backgroundColor: colors.backgroundSecondary,
      padding: '3px 8px',
      borderRadius: '4px',
      fontWeight: '500',
    },
    expCompany: {
      fontSize: '15px',
      marginBottom: '5px',
      fontWeight: '500',
    },
    expLocation: {
      fontSize: '13px',
      color: colors.textSecondary,
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      // Add location icon
      '::before': {
        content: '"📍"',
        marginRight: '5px',
        fontSize: '12px',
      },
    },
    expDescription: {
      fontSize: '14px',
      marginTop: '10px',
      whiteSpace: 'pre-line',
      lineHeight: lineSpacing,
      color: colors.text,
      borderTop: `1px solid ${colors.border}`,
      paddingTop: '10px',
    },
    
    // Sidebar (right column) with improved styling
    sidebar: {
      flex: '0 0 30%',
      padding: '25px',
      backgroundColor: colors.backgroundSecondary,
      borderLeft: `1px solid ${colors.border}`,
    },
    sidebarSection: {
      marginBottom: '30px',
    },
    sidebarSectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: accentColor,
      marginBottom: '15px',
      paddingBottom: '8px',
      borderBottom: `2px solid ${accentColor}`,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : '0.3px',
      position: 'relative',
      // Add a subtle accent element
      '::after': {
        content: '""',
        width: '30px',
        height: '2px',
        backgroundColor: accentColor,
        position: 'absolute',
        bottom: '-1px',
        left: '0',
      },
    },
    personalDetails: {
      fontSize: '16px',  
      marginBottom: '15px',
      paddingBottom: '8px',
      borderBottom: `1px solid ${colors.border}`,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : 'normal',
      color: accentColor,
    },
    personalDetailItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      padding: '5px 0',
    },
    
    // Enhanced skills styles with better visualization
    skillsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    skillItem: {
      fontSize: '14px',
      position: 'relative',
    },
    skillName: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
      fontWeight: '500',
    },
    skillLevel: {
      height: '8px',
      backgroundColor: colors.border,
      borderRadius: '4px',
      overflow: 'hidden',
      position: 'relative',
    },
    skillLevelBar: {
      height: '100%',
      backgroundColor: accentColor,
      borderRadius: '4px',
      position: 'relative',
      transition: 'width 0.5s ease-out',
      // Add subtle gradient effect
      background: `linear-gradient(90deg, ${accentColor}BB, ${accentColor})`,
      // Add subtle shine effect
      '::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '50%',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.2), transparent)',
      },
    },
    
    // Enhanced languages styles
    languagesGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    languageItem: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '14px',
      padding: '8px 12px',
      borderRadius: '6px',
      backgroundColor: colors.card,
      alignItems: 'center',
    },
    languageName: {
      fontWeight: '600',
    },
    languageProficiency: {
      color: colors.textSecondary,
      fontSize: '13px',
      padding: '2px 8px',
      backgroundColor: colors.background,
      borderRadius: '4px',
    },
    
    // Enhanced hobbies styles
    hobbiesContainer: {
      fontSize: '14px',
    },
    hobbiesText: {
      margin: '0',
      lineHeight: lineSpacing,
    },
    hobbiesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    hobbyItem: {
      backgroundColor: accentColor,
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      color: '#ffffff',
      fontWeight: '500',
      boxShadow: `0 2px 5px ${colors.accentShadow}`,
      transition: 'transform 0.2s ease',
      ':hover': {
        transform: 'translateY(-2px)',
      },
    },
    
    // Enhanced referrals styles
    referralsText: {
      fontSize: '14px',
      fontStyle: 'italic',
      marginBottom: '15px',
      color: colors.textSecondary,
      borderLeft: `3px solid ${colors.accentLight}`,
      paddingLeft: '10px',
    },
    referralsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    referralItem: {
      fontSize: '14px',
      padding: '12px',
      borderRadius: '6px',
      backgroundColor: colors.card,
      border: `1px solid ${colors.cardBorder}`,
    },
    referralName: {
      fontWeight: 'bold',
      fontSize: '15px',
      color: accentColor,
    },
    referralPosition: {
      color: colors.textSecondary,
      marginBottom: '8px',
      fontSize: '13px',
      fontWeight: '500',
    },
    referralContact: {
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      // Add contact icon
      '::before': {
        content: '"📧"',
        marginRight: '5px',
        fontSize: '12px',
      },
    },
  };
  
  // PDF-specific adjustments
  if (isPdfMode) {
    // Adjust container for PDF
    baseStyles.container = {
      ...baseStyles.container,
      boxShadow: 'none', // Remove shadow in PDF
      maxWidth: '100%',  // Full width for PDF
      padding: '0',      // Reset padding for PDF
      margin: '0',       // Reset margin for PDF
      backgroundColor: '#ffffff', // Force white background for PDF
      color: '#2c3e50',  // Force dark text for PDF
      borderRadius: '0', // Remove border radius for PDF
    };
    
    // Adjust header for PDF
    baseStyles.header = {
      ...baseStyles.header,
      padding: '25px 35px', // Slightly reduced padding for PDF
      background: accentColor, // Simplified background for PDF
    };
    
    // Simplify experience item styling for PDF
    baseStyles.expItem = {
      ...baseStyles.expItem,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // Lighter shadow for PDF
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
      marginBottom: '15px',
      padding: '15px',
      // Replace pseudo-element with simple left border for PDF compatibility
      '::before': undefined,
      borderLeft: `4px solid ${accentColor}`,
    };
    
    // Adjust section title for PDF
    baseStyles.sectionTitle = {
      ...baseStyles.sectionTitle,
      '::before': undefined, // Remove pseudo elements for PDF
      paddingBottom: '8px',
      borderBottom: `2px solid ${accentColor}`,
      pageBreakAfter: 'avoid',
      breakAfter: 'avoid',
    };
    
    // Adjust sidebar section title for PDF
    baseStyles.sidebarSectionTitle = {
      ...baseStyles.sidebarSectionTitle,
      '::after': undefined, // Remove pseudo elements for PDF
    };
    
    // Adjust sidebar for PDF
    baseStyles.sidebar = {
      ...baseStyles.sidebar,
      backgroundColor: '#f8f9fa',
      flex: '0 0 30%',
    };
    
    // Adjust skill level bar for PDF
    baseStyles.skillLevelBar = {
      ...baseStyles.skillLevelBar,
      backgroundColor: accentColor,
      background: accentColor, // Simplified background for PDF
      '::after': undefined, // Remove pseudo elements for PDF
    };
    
    // Simplify hobby items for PDF
    baseStyles.hobbyItem = {
      ...baseStyles.hobbyItem,
      backgroundColor: accentColor,
      color: '#ffffff',
      boxShadow: 'none',
    };
    
    // Simplify contact items for PDF
    baseStyles.contactItem = {
      ...baseStyles.contactItem,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: undefined, // Remove unsupported properties for PDF
    };
    
    // Ensure sections don't break across pages
    baseStyles.section = {
      ...baseStyles.section,
      pageBreakInside: 'avoid-page',
      breakInside: 'avoid-page',
    };
    
    // Ensure sidebar sections don't break 
    baseStyles.sidebarSection = {
      ...baseStyles.sidebarSection,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    };
    
    // PDF-specific print properties
    baseStyles.container.WebkitPrintColorAdjust = 'exact';
    baseStyles.container.printColorAdjust = 'exact';
  }

  return baseStyles;
};

export default getStockholmStyles;