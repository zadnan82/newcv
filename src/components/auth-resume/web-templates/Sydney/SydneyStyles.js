/**
 * Complete Redesign of Sydney Template Styles
 * Modern, asymmetric layout with bold design elements
 * All left column content using full width
 * Maintaining PDF compatibility
 */
export const getSydneyStyles = (darkMode, settings, isPdfMode = false) => {
  const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;

  // Use light mode colors for PDF
  const effectiveDarkMode = isPdfMode ? false : darkMode;

  // Create a complete color palette from the accent color
  const colors = createColorPalette(accentColor, effectiveDarkMode);

  // Base styles with completely transformed layout
  const baseStyles = {
    // CONTAINER & LAYOUT
    container: {
      fontFamily,
      backgroundColor: colors.background,
      color: colors.text,
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative',
      borderRadius: '0',
      overflow: 'hidden',
      boxShadow: `0 10px 40px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
    },
    
    // COMPLETELY REIMAGINED HEADER - asymmetric, modern design
    header: {
      display: 'flex',
      padding: '0',
      position: 'relative',
      backgroundColor: colors.background,
      color: colors.text,
      flexDirection: 'row',
      minHeight: '220px',
    },
    headerLeft: {
      flex: '0 0 38%', 
      backgroundColor: colors.accent,
      padding: '30px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      // Diagonal cut
      clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
    },
    headerContent: {
      flex: '1',
      padding: '30px 30px 30px 40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      zIndex: 1,
    },
    profileImageContainer: {
      marginBottom: '0',
      position: 'relative',
    },
    profileImage: {
      width: '150px',
      height: '150px',
      borderRadius: '6px',
      objectFit: 'cover',
      border: '4px solid rgba(255, 255, 255, 0.25)',
      boxShadow: '5px 5px 20px rgba(0, 0, 0, 0.2)',
      transform: 'rotate(-2deg)',
    },
    name: {
      fontSize: '38px',
      fontWeight: '800',
      margin: '0 0 5px 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      color: colors.accent,
      letterSpacing: '0.5px',
      lineHeight: '1.2',
    },
    title: {
      fontSize: '20px',
      fontWeight: '400',
      marginBottom: '20px',
      letterSpacing: '0.5px',
      position: 'relative',
      paddingBottom: '15px',
      // Accent underline
      '::after': {
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '50px',
        height: '3px',
        backgroundColor: colors.accent,
      }
    },
    contactGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '15px',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      backgroundColor: colors.backgroundSecondary,
      padding: '6px 12px',
      borderRadius: '4px',
      marginRight: '8px',
      marginBottom: '8px',
      border: `1px solid ${colors.border}`,
    },
    contactIcon: {
      marginRight: '8px',
      fontSize: '15px',
    },
    
    // RADICAL NEW CONTENT LAYOUT - asymmetric columns
    contentLayout: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      position: 'relative',
    },
    
    // MAIN COLUMN - completely redesigned
    mainColumn: {
      padding: '40px 40px 40px 40px',
      backgroundColor: colors.background,
      borderRight: `1px solid ${colors.border}`,
      position: 'relative',
    },
    section: {
      marginBottom: '40px',
      position: 'relative',
    },
    sectionTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: colors.accent,
      marginBottom: '20px',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.5px' : '0.3px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      // Left accent bar
      paddingLeft: '16px',
      '::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        top: '0',
        bottom: '0',
        width: '6px',
        backgroundColor: colors.accent,
        borderRadius: '3px',
      },
    },
    sectionContent: {
      position: 'relative',
      width: '100%',
    },
    summary: {
      fontSize: '16px',
      lineHeight: lineSpacing,
      padding: '25px 30px',
      borderRadius: '6px',
      backgroundColor: colors.backgroundSecondary,
      position: 'relative',
      marginBottom: '15px',
      color: colors.text,
      border: `1px solid ${colors.border}`,
      width: '100%',
    },
    
    // FIXED LAYOUT FOR ALL ITEMS - Full-width design for all sections
    expItem: {
      marginBottom: '30px',
      padding: '0',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      width: '100%',
    },
    expHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '0',
      marginBottom: '10px',
      flexWrap: 'wrap',
      width: '100%',
    },
    expItemSecond: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      flexWrap: 'wrap',
      width: '100%',
    },
    expTitle: {
      fontWeight: '700',
      fontSize: '18px',
      color: colors.accent,
      marginBottom: '8px',
      flex: '1',
    },
    expDate: {
      fontSize: '14px',
      color: colors.background,
      backgroundColor: colors.accent,
      padding: '5px 10px',
      borderRadius: '4px',
      display: 'inline-block',
      fontWeight: '500',
      minWidth: '120px',
      textAlign: 'center',
    },
    expCompany: {
      fontSize: '16px',
      marginBottom: '8px',
      fontWeight: '600',
      color: colors.textHeading,
      flex: '1',
    },
    expLocation: {
      fontSize: '14px',
      color: colors.textSecondary,
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      '::before': {
        content: '"📍"',
        marginRight: '5px',
        fontSize: '12px',
      },
    },
    expDescription: {
      fontSize: '15px',
      whiteSpace: 'pre-line',
      lineHeight: lineSpacing,
      color: colors.text,
      paddingTop: '12px',
      position: 'relative',
      borderTop: `1px solid ${colors.border}`,
      width: '100%',
    },
    
    // COMPLETELY REDESIGNED SIDEBAR
    sidebar: {
      padding: '40px 40px 40px 40px',
      backgroundColor: colors.backgroundSecondary,
      position: 'relative',
    },
    sidebarSection: {
      marginBottom: '35px',
      position: 'relative',
    },
    sidebarSectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: colors.accent,
      marginBottom: '20px',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.5px' : '0.3px',
      position: 'relative',
      paddingLeft: '16px',
      // Left accent bar
      '::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        top: '0',
        bottom: '0',
        width: '6px',
        backgroundColor: colors.accent,
        borderRadius: '3px',
      }
    },
    personalDetails: {
      margin: '0',
    },
    personalDetailItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      padding: '0',
      fontSize: '14px',
    },
    
    // REDESIGNED SKILLS - visual bars
    skillsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    skillItem: {
      fontSize: '15px',
      position: 'relative',
    },
    skillName: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontWeight: '500',
    },
    skillLevel: {
      height: '8px',
      backgroundColor: `${colors.border}`,
      borderRadius: '4px',
      overflow: 'hidden',
      position: 'relative',
    },
    skillLevelBar: {
      height: '100%',
      borderRadius: '4px',
      position: 'relative',
      backgroundColor: colors.accent,
    },
    
    // LANGUAGES GRID - redesigned
    languagesGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    languageItem: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '15px',
      padding: '0',
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: '10px',
    },
    languageName: {
      fontWeight: '600',
    },
    languageProficiency: {
      color: colors.textSecondary,
      fontSize: '14px',
      padding: '3px 8px',
      backgroundColor: colors.backgroundLight,
      borderRadius: '4px',
      border: `1px solid ${colors.border}`,
    },
    
    // COURSES - newly styled for sidebar
    coursesGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    courseItem: {
      backgroundColor: colors.background,
      padding: '12px 15px',
      borderRadius: '6px',
      marginBottom: '10px',
      border: `1px solid ${colors.border}`,
    },
    courseName: {
      fontWeight: '600',
      fontSize: '15px',
      color: colors.accent,
      marginBottom: '5px',
    },
    courseDate: {
      fontSize: '13px',
      color: colors.textSecondary,
      marginBottom: '5px',
      fontStyle: 'italic',
    },
    courseInstitution: {
      fontSize: '14px',
      color: colors.text,
    },
    
    // EXTRACURRICULAR ACTIVITIES - newly styled for sidebar
    extracurricularsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    activityItem: {
      backgroundColor: colors.background,
      padding: '12px 15px',
      borderRadius: '6px',
      marginBottom: '10px',
      border: `1px solid ${colors.border}`,
    },
    activityTitle: {
      fontWeight: '600',
      fontSize: '15px',
      color: colors.accent,
      marginBottom: '5px',
    },
    activityDescription: {
      fontSize: '14px',
      color: colors.text,
      lineHeight: lineSpacing,
    },
    
    // HOBBIES - redesigned
    hobbiesContainer: {
      fontSize: '15px',
    },
    hobbiesText: {
      margin: '0',
      lineHeight: lineSpacing,
    },
    hobbiesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    hobbyItem: {
      backgroundColor: colors.background,
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '14px',
      border: `1px solid ${colors.border}`,
      display: 'inline-block',
      marginBottom: '10px',
    },
    
    // REDESIGNED REFERRALS
    referralsContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    referralsText: {
      fontSize: '15px',
      fontStyle: 'italic',
      color: colors.textSecondary,
      padding: '15px 20px',
      backgroundColor: colors.background,
      borderRadius: '6px',
      border: `1px solid ${colors.border}`,
    },
    referralItem: {
      fontSize: '15px',
      padding: '15px 20px',
      backgroundColor: colors.background,
      borderRadius: '6px',
      border: `1px solid ${colors.border}`,
      marginBottom: '10px',
    },
    referralName: {
      fontWeight: '700',
      fontSize: '16px',
      color: colors.accent,
      marginBottom: '5px',
    },
    referralRelation: {
      color: colors.textSecondary,
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
    },
    referralContact: {
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      color: colors.textSecondary,
      marginBottom: '5px',
      '::before': {
        content: '"📧"',
        marginRight: '5px',
        fontSize: '14px',
      },
    },
  };
  
  // PDF-specific adjustments
  if (isPdfMode) {
    // Adjust container for PDF
    baseStyles.container = {
      ...baseStyles.container,
      boxShadow: 'none',
      border: 'none',
      maxWidth: '100%',
      margin: '0',
      backgroundColor: '#ffffff',
      color: '#333333',
    };
    
    // Adjust header for PDF
    baseStyles.header = {
      ...baseStyles.header,
      backgroundColor: '#ffffff',
    };
    
    baseStyles.headerLeft = {
      ...baseStyles.headerLeft,
      clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
    };
    
    // Adjust section titles for PDF
    baseStyles.sectionTitle = {
      ...baseStyles.sectionTitle,
      pageBreakAfter: 'avoid',
      breakAfter: 'avoid',
    };
    
    baseStyles.sidebarSectionTitle = {
      ...baseStyles.sidebarSectionTitle,
      pageBreakAfter: 'avoid',
      breakAfter: 'avoid',
    };
    
    // Ensure exp items don't break across pages
    baseStyles.expItem = {
      ...baseStyles.expItem,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    };
    
    // Ensure sidebar items don't break
    baseStyles.courseItem = {
      ...baseStyles.courseItem,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    };
    
    baseStyles.activityItem = {
      ...baseStyles.activityItem,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    };
    
    // Ensure sections don't break
    baseStyles.section = {
      ...baseStyles.section,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    };
    
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

// Helper function to create a complete color palette from accent color
function createColorPalette(accentColor, isDarkMode) {
  return {
    accent: accentColor,
    accentLight: adjustColorOpacity(accentColor, 0.2),
    accentDark: shadeColor(accentColor, -20),
    
    // Core colors
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    backgroundSecondary: isDarkMode ? '#252525' : '#f8f9fa',
    backgroundLight: isDarkMode ? '#333333' : '#f1f3f5',
    
    // Text colors
    text: isDarkMode ? '#e0e0e0' : '#333333',
    textSecondary: isDarkMode ? '#aaaaaa' : '#666666',
    textHeading: isDarkMode ? '#ffffff' : '#111111',
    
    // Borders and shadows
    border: isDarkMode ? '#333333' : '#e0e0e0',
    shadow: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
  };
}

// Helper function to darken or lighten a hex color
function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = (R > 0) ? R : 0;
  G = (G > 0) ? G : 0;
  B = (B > 0) ? B : 0;

  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
}

// Helper function to adjust opacity of a hex color
function adjustColorOpacity(hexColor, opacity) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Return rgba string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default getSydneyStyles;