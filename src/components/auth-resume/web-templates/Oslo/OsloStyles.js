/**
 * Styling for the Oslo template
 * Classical corporate design with full-width header and clear section demarcation
 * Enhanced with PDF compatibility using inline styles (compatible with Tailwind)
 * Fixed to properly apply custom settings
 */
export const getOsloStyles = (darkMode, settings, isPdfMode = false) => {
  const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;

  // Use light mode colors for PDF regardless of darkMode setting
  const effectiveDarkMode = isPdfMode ? false : darkMode;

  const colors = {
    background: effectiveDarkMode ? '#1a1a1a' : '#ffffff',
    backgroundAlt: effectiveDarkMode ? '#2d2d2d' : '#f8f9fa',
    text: effectiveDarkMode ? '#e6e6e6' : '#333333',
    textSecondary: effectiveDarkMode ? '#b8b8b8' : '#6c757d',
    border: effectiveDarkMode ? '#3d3d3d' : '#dee2e6',
    shadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
    headerBg: effectiveDarkMode ? '#252525' : '#f0f2f5',
  };

  // Base styles
  const baseStyles = {
    container: {
      fontFamily,
      lineHeight: lineSpacing,
      backgroundColor: colors.background,
      color: colors.text,
      maxWidth: '850px',
      margin: '0 auto',
      padding: '0',
      boxShadow: `0 4px 10px ${colors.shadow}`,
      position: 'relative',
    },
    header: {
      padding: '30px 50px',
      backgroundColor: colors.headerBg,
      borderBottom: `3px solid ${accentColor}`,
    },
    headerContent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerLeft: {
      flex: '3',
    },
    headerRight: {
      flex: '2',
      textAlign: 'right',
    },
    name: {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: '0 0 5px 0',
      color: accentColor,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : 'normal',
    },
    title: {
      fontSize: '18px',
      fontWeight: '500',
      marginBottom: '15px',
      color: colors.text,
    },
    contactInfo: {
      marginTop: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      fontSize: '14px',
    },
    contactItem: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    contactIcon: {
      marginLeft: '8px',
    },
    mainContainer: {
      padding: '30px 50px',
      display: 'flex',
      gap: '40px',
    },
    mainColumn: {
      flex: '3',
    },
    sideColumn: {
      flex: '1',
    },
    section: {
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: accentColor,
      marginBottom: '15px',
      paddingBottom: '8px',
      borderBottom: `1px solid ${colors.border}`,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : 'normal',
    },
    summary: {
      marginBottom: '20px',
      fontSize: '15px',
      lineHeight: lineSpacing,
    },
    // Experience items
    expItem: {
      marginBottom: '22px',
      padding: '15px',
      backgroundColor: colors.backgroundAlt,
      borderLeft: `3px solid ${accentColor}`,
      borderRadius: '0 3px 3px 0',
    },
    expHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
      flexWrap: 'wrap',
    },
    expTitle: {
      fontWeight: 'bold',
      fontSize: '16px',
    },
    expDate: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    expCompany: {
      fontSize: '15px',
      marginBottom: '5px',
      color: accentColor,
    },
    expLocation: {
      fontSize: '14px',
      color: colors.textSecondary,
      marginBottom: '8px',
      fontStyle: 'italic',
    },
    expDescription: {
      fontSize: '14px',
      marginTop: '10px',
      whiteSpace: 'pre-line',
      lineHeight: lineSpacing,
    },
    // Skills section
    skillsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    skillItem: {
      position: 'relative',
    },
    skillInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
      fontSize: '14px',
    },
    skillName: {
      fontWeight: '500',
    },
    skillLevel: {
      color: colors.textSecondary,
    },
    skillBar: {
      height: '6px',
      backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderRadius: '3px',
      overflow: 'hidden',
    },
    skillProgress: {
      height: '100%',
      backgroundColor: accentColor,
    },
    // Languages section
    languageItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      fontSize: '14px',
    },
    languageName: {
      fontWeight: '500',
    },
    languageLevel: {
      color: colors.textSecondary,
    },
    // Hobbies section
    hobbiesContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    hobby: {
      backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      padding: '5px 10px',
      borderRadius: '3px',
      fontSize: '13px',
    },
    // Personal details
    personalInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    personalItem: {
      display: 'flex',
      fontSize: '14px',
      lineHeight: lineSpacing,
    },
    personalIcon: {
      marginRight: '8px',
      color: accentColor,
    },
    personalLabel: {
      fontWeight: '500',
      marginRight: '8px',
    },
    // References
    referencesContainer: {
      fontSize: '14px',
    },
    referencesText: {
      fontStyle: 'italic',
      lineHeight: lineSpacing,
    },
    referenceItem: {
      marginBottom: '12px',
    },
    referenceName: {
      fontWeight: 'bold',
    },
    referenceTitle: {
      color: colors.textSecondary,
      marginBottom: '3px',
    },
    referenceContact: {
      fontSize: '13px',
      lineHeight: lineSpacing,
    }
  };

  // PDF-specific adjustments
  if (isPdfMode) {
    // Adjust container for PDF
    baseStyles.container = {
      ...baseStyles.container,
      boxShadow: 'none',     // Remove shadow in PDF
      maxWidth: '100%',      // Full width for PDF
      padding: '0',          // Reset padding for PDF
      margin: '0',           // Reset margin for PDF
      backgroundColor: '#ffffff', // Force white background for PDF
      color: '#000000',      // Force black text for PDF
    };
    
    // Adjust header for PDF
    baseStyles.header = {
      ...baseStyles.header,
      paddingTop: '15px',    // Less top padding in PDF
      paddingBottom: '15px', // Less bottom padding in PDF
      backgroundColor: '#f0f2f5', // Force consistent header bg for PDF
    };
    
    // Adjust main container for PDF
    baseStyles.mainContainer = {
      ...baseStyles.mainContainer,
      padding: '20px 40px',  // Slightly reduced padding for PDF
    };
    
    // Reduce overall margins and padding for better page fit
    baseStyles.section.marginBottom = '20px';  // Reduce section spacing
    
    // Reduce experience item padding and margins
    baseStyles.expItem.padding = '12px';
    baseStyles.expItem.marginBottom = '15px';
    
    // Keep accent colors consistent in PDF
    baseStyles.name.color = accentColor;
    baseStyles.sectionTitle.color = accentColor;
    baseStyles.expCompany.color = accentColor;
    baseStyles.personalIcon.color = accentColor;
    baseStyles.skillProgress.backgroundColor = accentColor;
    
    // Improve contrast for secondary text in PDF
    baseStyles.expDate.color = '#555555';
    baseStyles.expLocation.color = '#555555';
    baseStyles.skillLevel.color = '#555555';
    baseStyles.languageLevel.color = '#555555';
    baseStyles.referenceTitle.color = '#555555';
    
    // Enhance borders for better definition in PDF
    baseStyles.sectionTitle.borderBottom = `1px solid #dddddd`;
    baseStyles.header.borderBottom = `3px solid ${accentColor}`;
    
    // PDF-specific layout improvements
    baseStyles.expItem.backgroundColor = '#f8f9fa'; // Lighter background for items
    
    // Add PDF-specific style properties
    baseStyles.container.WebkitPrintColorAdjust = 'exact';
    baseStyles.container.printColorAdjust = 'exact';
    
    // Ensure text is crisp in PDF
    baseStyles.container.WebkitFontSmoothing = 'antialiased';
    baseStyles.container.MozOsxFontSmoothing = 'grayscale';
    
    // Ensure proper layout in PDF
    baseStyles.expItem.pageBreakInside = 'avoid';
    baseStyles.expItem.breakInside = 'avoid';
    baseStyles.sectionTitle.pageBreakAfter = 'avoid';
    baseStyles.sectionTitle.breakAfter = 'avoid';
    
    // Prevent orphans and widows
    baseStyles.expDescription.orphans = 2;
    baseStyles.expDescription.widows = 2;
    baseStyles.summary.orphans = 2;
    baseStyles.summary.widows = 2;
    
    // Improve side column in PDF
    baseStyles.sideColumn.flex = '1.2'; // Slightly increase side column width for PDF
  }

  return baseStyles;
};

export default getOsloStyles;