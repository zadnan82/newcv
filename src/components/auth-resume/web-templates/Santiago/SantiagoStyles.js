/**
 * Compact redesign of Santiago template
 * Reduced spacing for more efficient use of space
 * Maintains single-column layout with better density
 */
export const getSantiagoStyles = (darkMode, settings, isPdfMode = false) => {
  const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;

  // Use light mode colors for PDF
  const effectiveDarkMode = isPdfMode ? false : darkMode;

  // Create a complete color palette from the accent color
  const colors = createColorPalette(accentColor, effectiveDarkMode);

  // Base styles with more compact layout
  const baseStyles = {
    // CONTAINER & LAYOUT - single column design
    container: {
      fontFamily,
      backgroundColor: colors.background,
      color: colors.text,
      maxWidth: '850px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 5px 20px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
    },

    // COMPACT HEADER
    header: {
      padding: '25px 30px',
      position: 'relative',
      backgroundColor: colors.accent,
      color: '#ffffff',
      borderBottom: `1px solid ${colors.border}`,
      // Subtle pattern overlay
      '::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%)`,
        backgroundSize: '20px 20px',
        opacity: '0.3',
        zIndex: '1',
      }
    },
    
    // Compact header layout
    headerLeft: {
      float: 'left',
      marginRight: '20px',
      position: 'relative',
      zIndex: '2',
    },
    headerContent: {
      overflow: 'hidden',
      position: 'relative',
      zIndex: '2',
    },
    profileImageContainer: {
      display: 'inline-block',
      position: 'relative',
    },
    profileImage: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    },
    name: {
      fontSize: '30px',
      fontWeight: '700',
      margin: '0 0 3px 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.5px' : '0.3px',
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    },
    title: {
      fontSize: '17px',
      fontWeight: '400',
      marginBottom: '12px',
      opacity: '0.9',
      letterSpacing: '0.5px',
    },
    contactGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '13px',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      padding: '4px 8px',
      borderRadius: '3px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
    },
    contactIcon: {
      marginRight: '6px',
      fontSize: '14px',
      flexShrink: 0,
    },
    
    // MAIN CONTENT LAYOUT - single column with reduced margins
    contentLayout: {
      display: 'flex',
      flexDirection: 'column',
    },
    
    // COMPACT PERSONAL INFO STRIP
    personalInfoStrip: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '8px 20px',
      backgroundColor: colors.backgroundLight,
      borderBottom: `1px solid ${colors.border}`,
    },
    personalDetailItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '13px',
      marginRight: '15px',
      marginBottom: '0',
      color: colors.textSecondary,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    // MAIN CONTENT AREA WITH REDUCED PADDING
    mainContent: {
      padding: '20px 25px',
    },
    
    // COMPACT SECTION STYLING
    section: {
      marginBottom: '20px',
      position: 'relative',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: colors.accent,
      marginBottom: '12px',
      paddingBottom: '6px',
      borderBottom: `1px solid ${colors.border}`,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.2px' : '0.3px',
      position: 'relative',
      // Subtle underline accent
      '::after': {
        content: '""',
        position: 'absolute',
        left: '0',
        bottom: '-1px',
        width: '60px',
        height: '3px',
        backgroundColor: colors.accent,
        borderRadius: '2px',
      }
    },
    sectionContent: {
      width: '100%',
    },
    
    // COMPACT SUMMARY
    summary: {
      fontSize: '14px',
      lineHeight: lineSpacing,
      padding: '12px 15px',
      borderRadius: '4px',
      backgroundColor: colors.backgroundLight,
      border: `1px solid ${colors.border}`,
      position: 'relative',
      marginBottom: '20px',
      // Left border accent
      borderLeft: `4px solid ${colors.accent}`
    },
    
    // COMPACT EXPERIENCE ITEMS
    expItem: {
      marginBottom: '15px',
      padding: '0',
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'minmax(110px, auto) 1fr',
      gap: '12px',
      alignItems: 'start',
    },
    expHeader: {
      display: 'flex',
      flexDirection: 'column',
    },
    expDate: {
      fontSize: '13px',
      color: colors.background,
      backgroundColor: colors.accent,
      padding: '3px 8px',
      borderRadius: '3px',
      display: 'inline-block',
      marginBottom: '0',
      fontWeight: '500',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    },
    expItemSecond: {
      display: 'flex',
      flexDirection: 'column',
    },
    expTitle: {
      fontWeight: '700',
      fontSize: '16px',
      color: colors.accent,
      marginBottom: '3px',
    },
    expCompany: {
      fontSize: '15px',
      marginBottom: '3px',
      fontWeight: '600',
      color: colors.textHeading,
    },
    expLocation: {
      fontSize: '13px',
      color: colors.textSecondary,
      marginBottom: '5px',
      display: 'flex',
      alignItems: 'center',
      // Add location icon
      '::before': {
        content: '"📍"',
        marginRight: '4px',
        fontSize: '11px',
      },
    },
    expDescription: {
      fontSize: '14px',
      whiteSpace: 'pre-line',
      lineHeight: lineSpacing,
      color: colors.text,
      borderTop: `1px solid ${colors.border}`,
      paddingTop: '5px',
      marginTop: '5px',
    },
    
    // COMPACT SKILLS GRID
    skillsSection: {
      marginBottom: '20px',
    },
    skillsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
      gap: '10px',
    },
    skillItem: {
      fontSize: '14px',
      position: 'relative',
      backgroundColor: colors.backgroundLight,
      padding: '10px 12px',
      borderRadius: '4px',
      border: `1px solid ${colors.border}`,
    },
    skillName: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
      fontWeight: '600',
    },
    skillLevel: {
      height: '6px',
      backgroundColor: `${colors.border}`,
      borderRadius: '3px',
      overflow: 'hidden',
      position: 'relative',
    },
    skillLevelBar: {
      height: '100%',
      borderRadius: '3px',
      position: 'relative',
      backgroundColor: colors.accent,
    },
    
    // COMPACT LANGUAGES GRID
    languagesSection: {
      marginBottom: '20px',
    },
    languagesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '10px',
    },
    languageItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      padding: '8px 10px',
      backgroundColor: colors.backgroundLight,
      borderRadius: '4px',
      border: `1px solid ${colors.border}`,
    },
    languageName: {
      fontWeight: '600',
      fontSize: '14px',
    },
    languageProficiency: {
      color: colors.textSecondary,
      fontSize: '12px',
      padding: '2px 6px',
      backgroundColor: colors.background,
      borderRadius: '3px',
      border: `1px solid ${colors.border}`,
    },
    
    // COMPACT HOBBIES
    hobbiesSection: {
      marginBottom: '20px',
    },
    hobbiesContainer: {
      fontSize: '14px',
    },
    hobbiesText: {
      margin: '0',
      lineHeight: lineSpacing,
      backgroundColor: colors.backgroundLight,
      padding: '10px 12px',
      borderRadius: '4px',
      border: `1px solid ${colors.border}`,
    },
    hobbiesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    hobbyItem: {
      backgroundColor: colors.accent,
      padding: '5px 10px',
      borderRadius: '15px',
      fontSize: '13px',
      color: '#ffffff',
      display: 'inline-block',
      marginBottom: '5px',
      marginRight: '5px',
    },
    
    // COMPACT REFERENCES
    referralsSection: {
      marginBottom: '20px',
    },
    referralsText: {
      fontSize: '14px',
      fontStyle: 'italic',
      color: colors.textSecondary,
      padding: '10px 12px',
      backgroundColor: colors.backgroundLight,
      borderRadius: '4px',
      border: `1px solid ${colors.border}`,
    },
    referralsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '12px',
    },
    referralItem: {
      fontSize: '14px',
      padding: '10px 12px',
      backgroundColor: colors.backgroundLight,
      borderRadius: '4px',
      border: `1px solid ${colors.border}`,
    },
    referralName: {
      fontWeight: '700',
      fontSize: '15px',
      color: colors.accent,
      marginBottom: '3px',
    },
    referralRelation: {
      color: colors.textSecondary,
      marginBottom: '5px',
      fontSize: '13px',
      fontWeight: '500',
    },
    referralContact: {
      fontSize: '13px',
      marginBottom: '3px',
      display: 'flex',
      alignItems: 'center',
      color: colors.textSecondary,
      '::before': {
        content: '"📧"',
        marginRight: '4px',
        fontSize: '12px',
      },
    },
    
    // SIDEBAR SECTION TITLES (for compatibility)
    sidebarSectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: colors.accent,
      marginBottom: '12px',
      paddingBottom: '6px',
      borderBottom: `1px solid ${colors.border}`,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.2px' : '0.3px',
      position: 'relative',
      // Subtle underline accent
      '::after': {
        content: '""',
        position: 'absolute',
        left: '0',
        bottom: '-1px',
        width: '60px',
        height: '3px',
        backgroundColor: colors.accent,
        borderRadius: '2px',
      }
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
      backgroundColor: colors.accent,
      '::after': undefined,
    };
    
    // Adjust section titles for PDF
    baseStyles.sectionTitle = {
      ...baseStyles.sectionTitle,
      '::after': undefined,
      borderBottom: `2px solid ${colors.accent}`,
      pageBreakAfter: 'avoid',
      breakAfter: 'avoid',
    };
    
    baseStyles.sidebarSectionTitle = {
      ...baseStyles.sidebarSectionTitle,
      '::after': undefined,
      borderBottom: `2px solid ${colors.accent}`,
      pageBreakAfter: 'avoid',
      breakAfter: 'avoid',
    };
    
    // Ensure exp items don't break across pages
    baseStyles.expItem = {
      ...baseStyles.expItem,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    };
    
    // Ensure skills don't break
    baseStyles.skillItem = {
      ...baseStyles.skillItem,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    };
    
    // Ensure languages don't break
    baseStyles.languageItem = {
      ...baseStyles.languageItem,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    };
    
    // Ensure sections don't break
    baseStyles.section = {
      ...baseStyles.section,
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
    backgroundLight: isDarkMode ? '#252525' : '#f8f9fa',
    backgroundDark: isDarkMode ? '#111111' : '#e9ecef',
    
    // Text colors
    text: isDarkMode ? '#e0e0e0' : '#333333',
    textSecondary: isDarkMode ? '#b0b0b0' : '#5d6778',
    textHeading: isDarkMode ? '#ffffff' : '#212529',
    textLight: isDarkMode ? '#b0b0b0' : '#6c757d',
    
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

export default getSantiagoStyles;