/**
 * Osaka template styles
 * A bold, modern resume template with Japanese-inspired design elements
 * Features minimalist layout with strong typographic hierarchy and asymmetric elements
 * Now with proper RTL (right-to-left) language support
 */
export const getOsakaStyles = (darkMode, settings, isPdfMode = false, isRTL = false) => {
  const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;

  // Use light mode colors for PDF regardless of darkMode setting
  const effectiveDarkMode = isPdfMode ? false : darkMode;

  // Modern Japanese-inspired color palette
  const colors = {
    // Base colors
    background: effectiveDarkMode ? '#0f0f0f' : '#fafafa',
    backgroundAlt: effectiveDarkMode ? '#1a1a1a' : '#f0f0f0',
    text: effectiveDarkMode ? '#f0f0f0' : '#1a1a1a',
    textSecondary: effectiveDarkMode ? '#b0b0b0' : '#4a4a4a',
    textMuted: effectiveDarkMode ? '#707070' : '#6e6e6e',
    
    // Structure and division colors
    divider: effectiveDarkMode ? '#303030' : '#e0e0e0',
    cardBg: effectiveDarkMode ? '#1a1a1a' : '#ffffff',
    cardBorder: effectiveDarkMode ? '#2a2a2a' : '#e8e8e8',
    
    // Accent colors and variations
    accent: accentColor,
    accentLight: effectiveDarkMode ? `${accentColor}40` : `${accentColor}20`,
    accentDark: effectiveDarkMode ? `${accentColor}` : `${accentColor}dd`,
    accentContrast: effectiveDarkMode ? '#ffffff' : '#ffffff',
    
    // Shadows and depth
    shadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
    deepShadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.15)',
  };

  // Base styles with unique Japanese-inspired design elements
  const baseStyles = {
    // Main container with clean lines and subtle texture
    container: {
      fontFamily,
      lineHeight: lineSpacing,
      backgroundColor: colors.background,
      color: colors.text,
      margin: '0 auto',
      padding: '0',
      position: 'relative',
      overflow: 'hidden',
      maxWidth: '210mm', // A4 width
      boxSizing: 'border-box',
    },
    
    // Header with asymmetrical design inspired by Japanese aesthetics
    headerContainer: {
      position: 'relative',
      paddingBottom: '4rem',
    },
    
    headerBackground: {
      position: 'absolute',
      top: 0,
      right: isRTL ? 'auto' : 0,
      left: isRTL ? 0 : 'auto',
      width: '85%',
      height: '100%',
      backgroundColor: colors.accent,
      clipPath: isRTL
        ? 'polygon(calc(100% - 120px) 0, 0 0, 0 100%, 100% 100%)'
        : 'polygon(120px 0, 100% 0, 100% 100%, 0 100%)',
      zIndex: 1,
    },
    
    headerContent: {
      position: 'relative',
      padding: '3rem 3rem 1rem 3rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      zIndex: 2,
    },
    
    nameTitle: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: '1.5rem',
    },
    
    name: {
      fontSize: '3rem',
      fontWeight: 900,
      color: colors.accentColor,
      margin: '0 0 0.2rem 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '2px' : '0',
      position: 'relative',
      paddingRight: isRTL ? 0 : '2rem',
      paddingLeft: isRTL ? '2rem' : 0,
    },
    
    title: {
      fontSize: '1.3rem',
      fontWeight: 400,
      color: colors.accentContrast,
      opacity: 0.9,
      margin: '0',
      padding: '0.2rem 1rem',
      borderLeft: isRTL ? 'none' : `3px solid ${colors.accentContrast}`,
      borderRight: isRTL ? `3px solid ${colors.accentContrast}` : 'none',
      paddingLeft: isRTL ? 0 : '1rem',
      paddingRight: isRTL ? '1rem' : 0,
    },
    
    // Contact info with modern icon design
    contactContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.2rem',
      marginTop: '1.5rem',
    },
    
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      color: colors.accentContrast,
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
    },
    
    
    contactItemHeader: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      color: colors.accentColor,
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
    },
    
    contactIcon: {
      marginRight: isRTL ? 0 : '0.5rem',
      marginLeft: isRTL ? '0.5rem' : 0,
      fontSize: '1rem',
    },
    
    // Profile image with modern, clean styling - positioned on opposite side for RTL
    profileContainer: {
      position: 'absolute',
      top: '3rem',
      right: isRTL ? 'auto' : '3rem',
      left: isRTL ? '3rem' : 'auto',
      zIndex: 3,
    },
    
    profileImage: {
      width: '130px',
      height: '130px',
      borderRadius: '0', // Square, Japanese inspired
      objectFit: 'cover',
      border: `3px solid ${colors.accentContrast}`,
      boxShadow: `0 10px 20px ${colors.shadow}`,
    },
    
    // Main content layout with asymmetrical grid
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr 280px',
      gap: '2rem',
      padding: '0 3rem 3rem 3rem',
      position: 'relative',
      direction: isRTL ? 'rtl' : 'ltr',
    },
    
    // Left column (main content)
    leftColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem',
    },
    
    // Section styling with Japanese-inspired design elements
    section: {
      position: 'relative',
    },
    
    sectionTitle: {
      fontSize: '1.6rem',
      fontWeight: 800,
      color: colors.text,
      marginBottom: '1.5rem',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.5px' : '0',
      paddingBottom: '0.8rem',
      borderBottom: `1px solid ${colors.divider}`,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    
    sectionTitleAccent: {
      position: 'absolute',
      bottom: '-1px',
      left: isRTL ? 'auto' : '0',
      right: isRTL ? '0' : 'auto',
      width: '40px',
      height: '3px',
      backgroundColor: colors.accent,
    },
    
    // Experience items with clean card design
    cardsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem',
    },
    
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: '4px',
      padding: '1.5rem',
      boxShadow: `0 3px 8px ${colors.shadow}`,
      border: `1px solid ${colors.cardBorder}`,
      position: 'relative',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      borderLeft: isRTL ? 'none' : null,
      borderRight: isRTL ? null : 'none',
    },
    
    cardWithAccent: {
      borderLeft: isRTL ? 'none' : `3px solid ${colors.accent}`,
      borderRight: isRTL ? `3px solid ${colors.accent}` : 'none',
    },
    
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.8rem',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    
    cardTitle: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: colors.text,
      margin: 0,
    },
    
    cardDateBadge: {
      fontSize: '0.8rem',
      color: colors.textSecondary,
      padding: '0.3rem 0.6rem',
      backgroundColor: colors.backgroundAlt,
      borderRadius: '4px',
      display: 'inline-block',
    },
    
    cardSubtitle: {
      fontSize: '1rem',
      fontWeight: 600,
      color: colors.accent,
      margin: '0 0 0.3rem 0',
    },
    
    cardLocation: {
      fontSize: '0.9rem',
      color: colors.textMuted,
      margin: '0 0 1rem 0',
      display: 'flex',
      alignItems: 'center',
    },
    
    cardContent: {
      fontSize: '0.95rem',
      color: colors.text,
      lineHeight: '1.5',
      whiteSpace: 'pre-line',
      borderTop: `1px solid ${colors.divider}`,
      paddingTop: '0.8rem',
      marginTop: '0.4rem',
    },
    
    // Summary section with Japanese-inspired design
    summary: {
      backgroundColor: colors.backgroundAlt,
      padding: '1.5rem',
      borderRadius: '4px',
      fontSize: '1rem',
      lineHeight: '1.6',
      color: colors.text,
      position: 'relative',
      boxShadow: `0 3px 8px ${colors.shadow}`,
      margin: '0.5rem 0 0 0',
    },
    
    summaryInner: {
      position: 'relative',
      zIndex: 2,
    },
    
    summaryBackground: {
      position: 'absolute',
      top: 0,
      left: isRTL ? 'auto' : 0,
      right: isRTL ? 0 : 'auto',
      width: '8px',
      height: '100%',
      backgroundColor: colors.accent,
      zIndex: 1,
    },
    
    // Right column (sidebar)
    rightColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem',
      paddingTop: '1rem',
    },
    
    sidebarSection: {
      position: 'relative',
    },
    
    sidebarTitle: {
      fontSize: '1.3rem',
      fontWeight: 700,
      color: colors.text,
      marginBottom: '1.2rem',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : '0',
      paddingBottom: '0.6rem',
      borderBottom: `1px solid ${colors.divider}`,
      position: 'relative',
    },
    
    sidebarTitleAccent: {
      position: 'absolute',
      bottom: '-1px',
      left: isRTL ? 'auto' : '0',
      right: isRTL ? '0' : 'auto',
      width: '30px',
      height: '3px',
      backgroundColor: colors.accent,
    },
    
    // Personal details styling
    detailsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
    },
    
    detailItem: {
      display: 'flex',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: '0.7rem',
      fontSize: '0.9rem',
      padding: '0.6rem 0.8rem',
      backgroundColor: colors.cardBg,
      borderRadius: '4px',
      border: `1px solid ${colors.cardBorder}`,
      transition: 'all 0.3s ease',
    },
    
    detailIcon: {
      fontSize: '0.9rem',
      color: colors.accent,
      marginTop: '0.1rem',
      marginRight: isRTL ? 0 : null,
      marginLeft: isRTL ? '0.7rem' : null, 
    },
    
    detailContent: {
      flex: 1,
      color: colors.text,
    },
    
    detailLabel: {
      fontWeight: 600,
      marginRight: isRTL ? 0 : '0.3rem',
      marginLeft: isRTL ? '0.3rem' : 0,
    },
    
    // Skills styling with Japanese-inspired design
    skillsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    
    skillItem: {
      position: 'relative',
    },
    
    skillHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.4rem',
    },
    
    skillName: {
      fontSize: '0.95rem',
      fontWeight: 600,
      color: colors.text,
    },
    
    skillLevel: {
      height: '6px',
      backgroundColor: colors.backgroundAlt,
      borderRadius: '3px',
      overflow: 'hidden',
      position: 'relative',
    },
    
    skillLevelBar: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: '3px',
      position: 'relative',
      float: isRTL ? 'right' : 'left', // For RTL support in skill bars
    },
    
    // Languages styling
    languagesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
    },
    
    languageItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.6rem 1rem',
      backgroundColor: colors.cardBg,
      borderRadius: '4px',
      border: `1px solid ${colors.cardBorder}`,
      transition: 'all 0.3s ease',
    },
    
    languageName: {
      fontSize: '0.95rem',
      fontWeight: 600,
      color: colors.text,
    },
    
    languageProficiency: {
      fontSize: '0.8rem',
      color: colors.accentContrast,
      backgroundColor: colors.accent,
      padding: '0.25rem 0.7rem',
      borderRadius: '3px',
    },
    
    // Hobbies styling with Japanese-inspired design
    hobbiesList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.6rem',
    },
    
    hobbyItem: {
      fontSize: '0.85rem',
      color: colors.text,
      backgroundColor: colors.backgroundAlt,
      padding: '0.5rem 0.8rem',
      borderRadius: '4px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: `1px solid ${colors.cardBorder}`,
    },
    
    hobbyItemAccent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '2px',
      backgroundColor: colors.accent,
    },
    
    // References styling
    referencesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    
    referenceItem: {
      padding: '1.2rem',
      backgroundColor: colors.cardBg,
      borderRadius: '4px',
      border: `1px solid ${colors.cardBorder}`,
      boxShadow: `0 2px 6px ${colors.shadow}`,
      transition: 'all 0.3s ease',
    },
    
    referenceName: {
      fontSize: '1rem',
      fontWeight: 700,
      color: colors.text,
      marginBottom: '0.4rem',
    },
    
    referencePosition: {
      fontSize: '0.9rem',
      color: colors.textMuted,
      marginBottom: '0.8rem',
    },
    
    referenceContact: {
      fontSize: '0.85rem',
      color: colors.textSecondary,
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      marginTop: '0.5rem',
    },
    
    // Decorative elements
    decorativeSquare: {
      position: 'absolute',
      width: '180px',
      height: '180px',
      border: `30px solid ${colors.accentLight}`,
      bottom: '-90px',
      left: isRTL ? 'auto' : '-90px',
      right: isRTL ? '-90px' : 'auto',
      zIndex: 0,
      opacity: 0.6,
    }
  };
  
  // Adjust styles for PDF
  if (isPdfMode) {
    baseStyles.container = {
      ...baseStyles.container,
      boxShadow: 'none',
      margin: 0,
      padding: 0,
      maxWidth: '100%',
    };
    
    baseStyles.headerBackground = {
      ...baseStyles.headerBackground,
      clipPath: isRTL 
        ? 'polygon(calc(100% - 80px) 0, 0 0, 0 100%, 100% 100%)' 
        : 'polygon(80px 0, 100% 0, 100% 100%, 0 100%)', // Simpler for PDF
    };
    
    baseStyles.card = {
      ...baseStyles.card,
      boxShadow: 'none',
      breakInside: 'avoid',
      pageBreakInside: 'avoid',
    };
    
    baseStyles.section = {
      ...baseStyles.section,
      breakInside: 'avoid-page',
      pageBreakInside: 'avoid-page',
    };
    
    baseStyles.sidebarSection = {
      ...baseStyles.sidebarSection,
      breakInside: 'avoid',
      pageBreakInside: 'avoid',
    };
    
    baseStyles.summary = {
      ...baseStyles.summary,
      boxShadow: 'none',
    };
    
    baseStyles.decorativeSquare = {
      ...baseStyles.decorativeSquare,
      display: 'none', // Remove decorative elements for PDF
    };
    
    // PDF-specific print properties
    baseStyles.container.WebkitPrintColorAdjust = 'exact';
    baseStyles.container.printColorAdjust = 'exact';
  }
  
  return baseStyles;
};

export default getOsakaStyles;