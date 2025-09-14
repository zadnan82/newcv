/**
 * Completely redesigned styling for the Ur template
 * Inspired by Stockholm's data organization with a fresh visual approach
 * Enhanced with better spacing, typography, and visual hierarchy
 */
export const getUrStyles = (darkMode, settings, isPdfMode = false) => {
  const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;

  // Use light mode for PDF regardless of darkMode setting
  const effectiveDarkMode = isPdfMode ? false : darkMode;

  // Modern color scheme with higher contrast and better visual hierarchy
  const colors = {
    background: effectiveDarkMode ? '#121212' : '#f9f9f9',
    surface: effectiveDarkMode ? '#1e1e1e' : '#ffffff',
    text: effectiveDarkMode ? '#e2e2e2' : '#333333',
    textSecondary: effectiveDarkMode ? '#b0b0b0' : '#555555',
    textLight: effectiveDarkMode ? '#888888' : '#777777',
    border: effectiveDarkMode ? '#333333' : '#e5e5e5',
    borderLight: effectiveDarkMode ? '#2a2a2a' : '#f0f0f0',
    accent: accentColor,
    accentTransparent: `${accentColor}22`, // 13% opacity
    accentLight: `${accentColor}40`, // 25% opacity
    shadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.08)',
    headerBg: effectiveDarkMode ? '#1a1a1a' : '#ffffff',
    cardBg: effectiveDarkMode ? '#252525' : '#ffffff',
    sidebarBg: effectiveDarkMode ? '#1c1c1c' : '#f5f5f5',
  };

  // Base styles with improved spacing and layout
  const styles = {
    // Container with modern card design
    container: {
      fontFamily,
      lineHeight: lineSpacing,
      backgroundColor: colors.background,
      color: colors.text,
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '10px',
      boxShadow: `0 10px 25px ${colors.shadow}`,
    },

    // Two-column header design
    header: {
      display: 'flex',
      padding: '0',
      position: 'relative',
      flexDirection: 'row',
      backgroundColor: colors.headerBg,
      borderBottom: `1px solid ${colors.border}`,
    },
    
    // Left side of header with name and title
    headerMain: {
      flex: '1',
      padding: '40px 35px',
      position: 'relative',
      zIndex: '1',
    },
    
    // Right side of header with contact info
    headerContact: {
      width: '270px',
      backgroundColor: colors.accent,
      padding: '40px 25px',
      color: '#fff',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      // Add a subtle pattern overlay
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.1) 21%, transparent 22%, transparent 70%, rgba(0,0,0,0.1) 71%, transparent 72%)',
        backgroundSize: '10px 10px',
        opacity: '0.3',
      }
    },
    
    // Name with enhanced typography
    name: {
      fontSize: '38px',
      fontWeight: '700',
      margin: '0 0 8px 0',
      color: colors.accent,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '2px' : '0',
      lineHeight: '1.1',
      position: 'relative',
      paddingBottom: '12px',
      // Add decorative line under name
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '60px',
        height: '4px',
        backgroundColor: colors.accent,
        borderRadius: '2px',
      }
    },
    
    // Job title with better styling
    title: {
      fontSize: '18px',
      fontWeight: '500',
      margin: '15px 0 0 0',
      color: colors.textSecondary,
      letterSpacing: '0.5px',
    },
    
    // Contact items in header
    contactContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      position: 'relative',
      zIndex: '1',
    },
    
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(2px)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    
    contactIcon: {
      marginRight: '12px',
      fontSize: '18px',
      width: '22px',
      height: '22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
    },
    
    contactText: {
      flex: '1',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    
    // Main content with better layout
    mainContainer: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: colors.surface,
    },
    
    // Left content area (main column)
    leftColumn: {
      flex: '1',
      padding: '35px 35px',
    },
    
    // Right sidebar area
    rightColumn: {
      width: '270px',
      backgroundColor: colors.sidebarBg,
      padding: '35px 25px',
      borderLeft: `1px solid ${colors.border}`,
    },
    
    // Section styling with better spacing
    section: {
      marginBottom: '35px',
      position: 'relative',
    },
    
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: colors.accent,
      marginBottom: '20px',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.5px' : '0.5px',
      position: 'relative',
      paddingBottom: '8px',
      borderBottom: `2px solid ${colors.accentLight}`,
      display: 'flex',
      alignItems: 'center',
      // Add accent marker 
      '&::before': {
        content: '""',
        display: 'block',
        width: '30px',
        height: '3px',
        backgroundColor: colors.accent,
        position: 'absolute',
        bottom: '-2px',
        left: '0',
      }
    },
    
    summaryContent: {
      fontSize: '15px',
      lineHeight: lineSpacing,
      color: colors.textSecondary,
      padding: '0 0 0 15px',
      borderLeft: `3px solid ${colors.accentTransparent}`,
      margin: '0',
    },
    
    // Experience items with card design
    expItem: {
      marginBottom: '22px',
      padding: '20px',
      backgroundColor: colors.cardBg,
      borderRadius: '8px',
      boxShadow: `0 3px 8px ${colors.shadow}`,
      border: `1px solid ${colors.borderLight}`,
      position: 'relative',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      // Add decorative accent element
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        top: '0',
        height: '100%',
        width: '4px',
        backgroundColor: colors.accent,
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
      },
      // Animation on hover
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: `0 8px 16px ${colors.shadow}`,
      }
    },
    
    expHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginBottom: '8px',
      alignItems: 'flex-start',
    },
    
    expTitle: {
      fontSize: '17px',
      fontWeight: '600',
      color: colors.accent,
      marginBottom: '4px',
    },
    
    expDate: {
      fontSize: '14px',
      color: colors.textLight,
      fontWeight: '500',
      padding: '4px 10px',
      backgroundColor: colors.accentTransparent,
      borderRadius: '15px',
      display: 'inline-block',
    },
    
    expCompany: {
      fontSize: '16px',
      fontWeight: '500',
      color: colors.text,
      marginBottom: '6px',
    },
    
    expLocation: {
      fontSize: '14px',
      color: colors.textLight,
      marginBottom: '10px',
      fontStyle: 'normal',
      display: 'flex',
      alignItems: 'center',
      // Add location icon prefix
      '&::before': {
        content: '"📍"',
        marginRight: '6px',
        fontSize: '14px',
      }
    },
    
    expDescription: {
      fontSize: '14px',
      color: colors.textSecondary,
      lineHeight: lineSpacing,
      whiteSpace: 'pre-line',
      marginTop: '10px',
      padding: '10px 0 0 0',
      borderTop: `1px solid ${colors.borderLight}`,
    },
    
    // Sidebar section styling
    sideSection: {
      marginBottom: '30px',
    },
    
    sideSectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: colors.accent,
      marginBottom: '15px',
      paddingBottom: '8px',
      borderBottom: `2px solid ${colors.accentLight}`,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : '0.3px',
      position: 'relative',
      // Add accent marker
      '&::after': {
        content: '""',
        display: 'block',
        width: '20px',
        height: '3px',
        backgroundColor: colors.accent,
        position: 'absolute',
        bottom: '-2px',
        left: '0',
      }
    },
    
    // Personal details styling
    detailsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    
    detailItem: {
      marginBottom: '5px',
    },
    
    detailLabel: {
      fontSize: '13px',
      fontWeight: '600',
      color: colors.textLight,
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      // Add small dot before labels
      '&::before': {
        content: '""',
        display: 'inline-block',
        width: '6px',
        height: '6px',
        backgroundColor: colors.accent,
        borderRadius: '50%',
        marginRight: '8px',
      }
    },
    
    detailValue: {
      fontSize: '14px',
      color: colors.text,
      paddingLeft: '14px',
    },
    
    // Skills section styling
    skillsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    
    skillItem: {
      marginBottom: '12px',
    },
    
    skillHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '6px',
    },
    
    skillName: {
      fontSize: '14px',
      fontWeight: '500',
      color: colors.text,
    },
    
    skillLevelText: {
      fontSize: '12px',
      color: colors.textLight,
    },
    
    skillBar: {
      height: '6px',
      backgroundColor: colors.borderLight,
      borderRadius: '3px',
      overflow: 'hidden',
    },
    
    skillProgress: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: '3px',
      position: 'relative',
      // Add subtle gradient effect
      background: `linear-gradient(90deg, ${colors.accentLight}, ${colors.accent})`,
      // Add shine effect
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '30px',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        animation: 'shine 2s infinite',
        transform: 'skewX(-20deg)',
      }
    },
    
    // Languages section styling
    languagesContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    
    languageItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      backgroundColor: colors.surface,
      borderRadius: '5px',
      border: `1px solid ${colors.borderLight}`,
      marginBottom: '8px',
    },
    
    languageName: {
      fontSize: '14px',
      fontWeight: '500',
    },
    
    languageLevel: {
      fontSize: '12px',
      color: colors.textLight,
      padding: '3px 8px',
      backgroundColor: colors.accentTransparent,
      borderRadius: '10px',
    },
    
    // Hobbies section styling
    hobbiesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    
    hobbiesText: {
      fontSize: '14px',
      lineHeight: lineSpacing,
      color: colors.textSecondary,
    },
    
    hobbyItem: {
      backgroundColor: colors.accentTransparent,
      color: colors.accent,
      padding: '6px 12px',
      borderRadius: '15px',
      fontSize: '13px',
      display: 'inline-block',
      fontWeight: '500',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
      // Hover animation
      '&:hover': {
        backgroundColor: colors.accentLight,
        transform: 'translateY(-2px)',
      }
    },
    
    // References section styling
    referencesGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    
    referenceItem: {
      padding: '12px 15px',
      backgroundColor: colors.surface,
      borderRadius: '6px',
      border: `1px solid ${colors.borderLight}`,
      marginBottom: '12px',
    },
    
    referenceName: {
      fontSize: '15px',
      fontWeight: '600',
      color: colors.accent,
      marginBottom: '4px',
    },
    
    referenceTitle: {
      fontSize: '13px',
      color: colors.textLight,
      marginBottom: '6px',
    },
    
    referenceContact: {
      fontSize: '13px',
      color: colors.textSecondary,
      display: 'flex',
      alignItems: 'center',
      margin: '5px 0',
      // Add icon for contact
      '&::before': {
        content: '"📧"',
        marginRight: '6px',
        fontSize: '13px',
      }
    },
    
    referenceText: {
      fontSize: '14px',
      fontStyle: 'italic',
      color: colors.textLight,
      padding: '8px 12px',
      backgroundColor: colors.accentTransparent,
      borderRadius: '5px',
      position: 'relative',
      // Add quote styling
      '&::before': {
        content: '"\\201C"', // opening quote
        position: 'absolute',
        top: '2px',
        left: '5px',
        fontSize: '24px',
        color: colors.accent,
        opacity: '0.5',
      },
      '&::after': {
        content: '"\\201D"', // closing quote
        position: 'absolute',
        bottom: '-10px',
        right: '5px',
        fontSize: '24px',
        color: colors.accent,
        opacity: '0.5',
      }
    }
  };

  // PDF-specific adjustments
  if (isPdfMode) {
    // Ensure container is properly optimized for PDF
    styles.container = {
      ...styles.container,
      boxShadow: 'none',
      maxWidth: '100%',
      margin: '0',
      backgroundColor: '#ffffff',
      color: '#333333',
      borderRadius: '0',
    };
    
    // Adjust header for PDF
    styles.header = {
      ...styles.header,
      backgroundColor: '#ffffff',
    };
    
    styles.headerContact = {
      ...styles.headerContact,
      backgroundColor: accentColor,
      // Remove dynamic effects for PDF
      '&::after': undefined,
    };
    
    // Remove animations and transitions for PDF
    styles.expItem = {
      ...styles.expItem,
      transition: undefined,
      // Remove hover effect for PDF
      '&:hover': undefined,
      // Convert pseudo element to simple border for PDF
      '&::before': undefined,
      borderLeft: `4px solid ${accentColor}`,
      // Add page break controls
      pageBreakInside: 'avoid',
      breakInside: 'avoid', 
    };
    
    // Simplify section titles for PDF
    styles.sectionTitle = {
      ...styles.sectionTitle,
      '&::before': undefined,
      borderBottom: `2px solid ${accentColor}`,
      // Add page break controls
      pageBreakAfter: 'avoid',
      breakAfter: 'avoid',
    };
    
    styles.sideSectionTitle = {
      ...styles.sideSectionTitle,
      '&::after': undefined,
      borderBottom: `2px solid ${accentColor}`,
    };
    
    // Simplify name styling for PDF
    styles.name = {
      ...styles.name,
      '&::after': undefined,
      borderBottom: `4px solid ${accentColor}`,
      paddingBottom: '10px',
    };
    
    // Simplify skill bars for PDF
    styles.skillProgress = {
      ...styles.skillProgress,
      backgroundColor: accentColor,
      background: accentColor,
      '&::after': undefined,
    };
    
    // Simplify hobby items for PDF
    styles.hobbyItem = {
      ...styles.hobbyItem,
      transition: undefined,
      '&:hover': undefined,
    };
    
    // Simplify references for PDF
    styles.referenceText = {
      ...styles.referenceText,
      '&::before': undefined,
      '&::after': undefined,
    };
    
    // Simplify detail labels for PDF
    styles.detailLabel = {
      ...styles.detailLabel,
      '&::before': undefined,
      color: '#555555',
    };
    
    // Adjust spacing for PDF
    styles.expItem.marginBottom = '20px';
    styles.sideSection.marginBottom = '25px';
    styles.section.marginBottom = '30px';
    
    // Add page break controls for PDF
    styles.section.pageBreakInside = 'avoid';
    styles.section.breakInside = 'avoid';
    
    // Prevent orphans and widows
    styles.expDescription.orphans = 2;
    styles.expDescription.widows = 2;
    styles.summaryContent.orphans = 2;
    styles.summaryContent.widows = 2;
    
    // Add color adjustment properties for PDF
    styles.container.WebkitPrintColorAdjust = 'exact';
    styles.container.printColorAdjust = 'exact';
    styles.headerContact.WebkitPrintColorAdjust = 'exact';
    styles.headerContact.printColorAdjust = 'exact';
  }

  return styles;
};

export default getUrStyles;