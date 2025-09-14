/**
 * Styling for the Toronto template
 * Elegant pastel background with two-column layout
 * Enhanced with PDF compatibility - Fixed for proper PDF export
 * Properly handles custom settings application
 */
export const getTorontoStyles = (darkMode, settings, isPdfMode = false) => {
  const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;

  // Always use light mode for PDF export
  const effectiveDarkMode = isPdfMode ? false : darkMode;

  // Base color scheme
  const colors = {
    background: effectiveDarkMode ? '#222222' : '#f9f3e1', // Cream background
    text: effectiveDarkMode ? '#e6e6e6' : '#333333',
    textSecondary: effectiveDarkMode ? '#b8b8b8' : '#84605d', // Muted terracotta
    textAccent: effectiveDarkMode ? '#d3ab87' : accentColor, // Use accent color from settings
    sectionTitle: effectiveDarkMode ? '#d3ab87' : accentColor, // Use accent color from settings
    headerBackground: effectiveDarkMode ? '#1a1a1a' : 'transparent',
    sidebarBackground: effectiveDarkMode ? '#2a2a2a' : 'rgba(255, 255, 255, 0.4)', // Transparent white
    divider: effectiveDarkMode ? '#444444' : '#e6c9a0', // Light gold divider
    skillBar: effectiveDarkMode ? '#444444' : '#f1d5a8', // Light gold
    skillFill: effectiveDarkMode ? '#d3ab87' : accentColor, // Use accent color from settings
  };

  // PDF-specific color adjustments
  if (isPdfMode) {
    // Use solid colors for PDF
    colors.sidebarBackground = '#f5efe0'; // Solid light cream for sidebar
    colors.background = '#ffffff'; // White background for PDF
  }

  // Base styles
  const styles = {
    container: {
      fontFamily,
      lineHeight: lineSpacing,
      color: colors.text,
      maxWidth: '850px',
      margin: '0 auto',
      padding: '0',
      position: 'relative',
      backgroundColor: colors.background,
      // Only use texture background for non-PDF mode
      backgroundImage: (!isPdfMode && !effectiveDarkMode) ? 
        'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 2000 2000\' preserveAspectRatio=\'none\'%3E%3Cdefs%3E%3ClinearGradient id=\'a\' gradientUnits=\'userSpaceOnUse\' x1=\'0\' x2=\'0\' y1=\'0\' y2=\'100%25\' gradientTransform=\'rotate(241,800,600)\'%3E%3Cstop offset=\'0\' stop-color=\'%23f9f3e1\'/%3E%3Cstop offset=\'1\' stop-color=\'%23f9f3e1\'/%3E%3C/linearGradient%3E%3Cpattern patternUnits=\'userSpaceOnUse\' id=\'b\' width=\'580\' height=\'483\' x=\'0\' y=\'0\' viewBox=\'0 0 1080 900\'%3E%3Cg fill-opacity=\'0.08\'%3E%3Cpolygon fill=\'%23444\' points=\'90 150 0 300 180 300\'/%3E%3Cpolygon points=\'90 150 180 0 0 0\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'270 150 360 0 180 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'450 150 360 300 540 300\'/%3E%3Cpolygon fill=\'%23999\' points=\'450 150 540 0 360 0\'/%3E%3Cpolygon points=\'630 150 540 300 720 300\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'630 150 720 0 540 0\'/%3E%3Cpolygon fill=\'%23444\' points=\'810 150 720 300 900 300\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'810 150 900 0 720 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'990 150 900 300 1080 300\'/%3E%3Cpolygon fill=\'%23444\' points=\'990 150 1080 0 900 0\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'90 450 0 600 180 600\'/%3E%3Cpolygon points=\'90 450 180 300 0 300\'/%3E%3Cpolygon fill=\'%23666\' points=\'270 450 180 600 360 600\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'270 450 360 300 180 300\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'450 450 360 600 540 600\'/%3E%3Cpolygon fill=\'%23999\' points=\'450 450 540 300 360 300\'/%3E%3Cpolygon fill=\'%23999\' points=\'630 450 540 600 720 600\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'630 450 720 300 540 300\'/%3E%3Cpolygon points=\'810 450 720 600 900 600\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'810 450 900 300 720 300\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'990 450 900 600 1080 600\'/%3E%3Cpolygon fill=\'%23444\' points=\'990 450 1080 300 900 300\'/%3E%3Cpolygon fill=\'%23222\' points=\'90 750 0 900 180 900\'/%3E%3Cpolygon points=\'270 750 180 900 360 900\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'270 750 360 600 180 600\'/%3E%3Cpolygon points=\'450 750 540 600 360 600\'/%3E%3Cpolygon points=\'630 750 540 900 720 900\'/%3E%3Cpolygon fill=\'%23444\' points=\'630 750 720 600 540 600\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'810 750 720 900 900 900\'/%3E%3Cpolygon fill=\'%23666\' points=\'810 750 900 600 720 600\'/%3E%3Cpolygon fill=\'%23999\' points=\'990 750 900 900 1080 900\'/%3E%3Cpolygon fill=\'%23999\' points=\'180 0 90 150 270 150\'/%3E%3Cpolygon fill=\'%23444\' points=\'360 0 270 150 450 150\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'540 0 450 150 630 150\'/%3E%3Cpolygon points=\'900 0 810 150 990 150\'/%3E%3Cpolygon fill=\'%23222\' points=\'0 300 -90 450 90 450\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'0 300 90 150 -90 150\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'180 300 90 450 270 450\'/%3E%3Cpolygon fill=\'%23666\' points=\'180 300 270 150 90 150\'/%3E%3Cpolygon fill=\'%23222\' points=\'360 300 270 450 450 450\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'360 300 450 150 270 150\'/%3E%3Cpolygon fill=\'%23444\' points=\'540 300 450 450 630 450\'/%3E%3Cpolygon fill=\'%23222\' points=\'540 300 630 150 450 150\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'720 300 630 450 810 450\'/%3E%3Cpolygon fill=\'%23666\' points=\'720 300 810 150 630 150\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'900 300 810 450 990 450\'/%3E%3Cpolygon fill=\'%23999\' points=\'900 300 990 150 810 150\'/%3E%3Cpolygon points=\'0 600 -90 750 90 750\'/%3E%3Cpolygon fill=\'%23666\' points=\'0 600 90 450 -90 450\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'180 600 90 750 270 750\'/%3E%3Cpolygon fill=\'%23444\' points=\'180 600 270 450 90 450\'/%3E%3Cpolygon fill=\'%23444\' points=\'360 600 270 750 450 750\'/%3E%3Cpolygon fill=\'%23999\' points=\'360 600 450 450 270 450\'/%3E%3Cpolygon fill=\'%23666\' points=\'540 600 630 450 450 450\'/%3E%3Cpolygon fill=\'%23222\' points=\'720 600 630 750 810 750\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'900 600 810 750 990 750\'/%3E%3Cpolygon fill=\'%23222\' points=\'900 600 990 450 810 450\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'0 900 90 750 -90 750\'/%3E%3Cpolygon fill=\'%23444\' points=\'180 900 270 750 90 750\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'360 900 450 750 270 750\'/%3E%3Cpolygon fill=\'%23AAA\' points=\'540 900 630 750 450 750\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'720 900 810 750 630 750\'/%3E%3Cpolygon fill=\'%23222\' points=\'900 900 990 750 810 750\'/%3E%3Cpolygon fill=\'%23222\' points=\'1080 300 990 450 1170 450\'/%3E%3Cpolygon fill=\'%23FFF\' points=\'1080 300 1170 150 990 150\'/%3E%3Cpolygon points=\'1080 600 990 750 1170 750\'/%3E%3Cpolygon fill=\'%23666\' points=\'1080 600 1170 450 990 450\'/%3E%3Cpolygon fill=\'%23DDD\' points=\'1080 900 1170 750 990 750\'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect x=\'0\' y=\'0\' fill=\'url(%23a)\' width=\'100%25\' height=\'100%25\'/%3E%3Crect x=\'0\' y=\'0\' fill=\'url(%23b)\' width=\'100%25\' height=\'100%25\'/%3E%3C/svg%3E")' 
        : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflow: 'hidden',
    },
    // Header section - Adjust for PDF mode
    header: {
      padding: isPdfMode ? '25px 40px 20px 40px' : '40px 40px 30px 40px',
      textAlign: 'center',
      backgroundColor: colors.headerBackground,
      position: 'relative',
    },
    name: {
      fontSize: '48px',
      fontWeight: '300',
      margin: '0 0 5px 0',
      color: colors.text,
      textAlign: 'center',
      fontFamily: "'Times New Roman', serif",
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '6px' : '2px',
    },
    title: {
      fontSize: '16px',
      fontWeight: '400',
      marginBottom: '15px',
      color: colors.textAccent,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '3px',
    },
    contactInfo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '30px',
      margin: '15px 0',
      fontSize: '14px',
      color: colors.text,
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
    },
    contactIcon: {
      marginRight: '8px',
      color: colors.textAccent,
    },
    // Navigation links - Slim for PDF
    navBar: {
      display: 'flex',
      justifyContent: 'center',
      borderTop: `1px solid ${colors.divider}`,
      borderBottom: `1px solid ${colors.divider}`,
      margin: isPdfMode ? '15px 0' : '20px 0',
      padding: isPdfMode ? '8px 0' : '10px 0',
    },
    navItem: {
      padding: '0 20px',
      fontSize: '14px',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: '2px',
      color: colors.textAccent,
      borderRight: `1px solid ${colors.divider}`,
    },
    navItemLast: {
      padding: '0 20px',
      fontSize: '14px',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: '2px',
      color: colors.textAccent,
      borderRight: 'none',
    },
    // Main content layout - Adjusted for PDF
    contentLayout: {
      display: 'flex',
      padding: isPdfMode ? '0 40px 20px 40px' : '0 40px 40px 40px',
    },
    // Left column (sidebar) - Fixed width for PDF
    sidebar: {
      flex: isPdfMode ? '0 0 200px' : '0 0 220px',
      paddingRight: '40px',
      backgroundColor: colors.sidebarBackground,
    },
    sidebarSection: {
      marginBottom: isPdfMode ? '25px' : '35px',
    },
    sidebarTitle: {
      fontSize: '14px',
      fontWeight: '400',
      color: colors.textAccent,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: '2px',
      marginBottom: '15px',
      paddingBottom: '5px',
      borderBottom: `1px solid ${colors.divider}`,
    },
    // Personal details
    personalDetail: {
      marginBottom: '15px',
      fontSize: '14px',
    },
    personalDetailLabel: {
      color: colors.textAccent,
      marginBottom: '3px',
      fontSize: '12px',
    },
    personalDetailValue: {
      color: colors.text,
    },
    // Skills section
    skillsGrid: {
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
      height: '4px',
      backgroundColor: colors.skillBar,
      borderRadius: '2px',
      overflow: 'hidden',
      margin: '5px 0 10px 0',
    },
    skillLevelBar: {
      height: '100%',
      backgroundColor: colors.skillFill,
      borderRadius: '2px',
    },
    // Languages section
    languagesGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    languageItem: {
      marginBottom: '10px',
    },
    languageName: {
      fontSize: '14px',
      fontWeight: '500',
    },
    languageMeter: {
      display: 'flex',
      marginTop: '5px',
    },
    languageMeterFill: {
      height: '5px',
      backgroundColor: colors.textAccent,
      marginRight: '3px',
    },
    languageMeterEmpty: {
      height: '5px',
      backgroundColor: colors.skillBar,
      marginRight: '3px',
    },
    // Links section
    linksSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    linkItem: {
      fontSize: '14px',
      color: colors.textAccent,
      textDecoration: 'none',
      marginBottom: '5px',
    },
    // Main column (right side)
    mainColumn: {
      flex: '1',
    },
    section: {
      marginBottom: isPdfMode ? '25px' : '35px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '400',
      color: colors.sectionTitle,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: '2px',
      marginBottom: '20px',
      paddingBottom: '5px',
      borderBottom: `1px solid ${colors.divider}`,
      pageBreakAfter: 'avoid',
      breakAfter: 'avoid',
    },
    // Profile section
    profileText: {
      fontSize: '14px',
      lineHeight: lineSpacing,
      color: colors.text,
      textAlign: 'justify',
    },
    // Experience items - Reduced spacing for PDF
    experienceItem: {
      marginBottom: isPdfMode ? '20px' : '25px',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
    expHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '5px',
    },
    expTitle: {
      fontSize: '16px',
      fontWeight: '500',
      color: colors.text,
    },
    expDate: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    expCompany: {
      fontSize: '14px',
      color: colors.textAccent,
      marginBottom: '5px',
    },
    expLocation: {
      fontSize: '14px',
      color: colors.textSecondary,
      fontStyle: 'italic',
      marginBottom: '5px',
    },
    expDescription: {
      fontSize: '14px',
      color: colors.text,
      lineHeight: lineSpacing,
      whiteSpace: 'pre-line',
    },
    // Education items
    educationItem: {
      marginBottom: isPdfMode ? '20px' : '25px',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
    // Hobbies section
    hobbiesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    hobbyItem: {
      fontSize: '14px',
      padding: '5px 10px',
      backgroundColor: colors.sidebarBackground,
      color: colors.text,
      borderRadius: '4px',
    },
    // References section
    referenceItem: {
      marginBottom: '20px',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    },
    referenceName: {
      fontSize: '15px',
      fontWeight: '500',
      color: colors.text,
    },
    referenceTitle: {
      fontSize: '14px',
      color: colors.textAccent,
      marginBottom: '3px',
    },
    referenceContact: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    // Page number indicator - Hide for PDF
    pageIndicator: {
      position: 'absolute',
      bottom: '10px',
      right: '40px',
      fontSize: '12px',
      color: colors.textSecondary,
      display: isPdfMode ? 'none' : 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    pageNumber: {
      fontWeight: 'bold',
      color: colors.textAccent,
    },
    pageNav: {
      display: 'flex',
      gap: '10px',
    },
    pageNavButton: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: colors.sidebarBackground,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '10px',
      color: colors.textAccent,
    },
  };

  // Add PDF-specific print properties
  if (isPdfMode) {
    // Add print-color-adjust
    styles.container.WebkitPrintColorAdjust = 'exact';
    styles.container.printColorAdjust = 'exact';
    
    // Add crisp text rendering
    styles.container.WebkitFontSmoothing = 'antialiased';
    styles.container.MozOsxFontSmoothing = 'grayscale';
    
    // Page break controls
    styles.experienceItem.pageBreakInside = 'avoid';
    styles.experienceItem.breakInside = 'avoid';
    styles.educationItem.pageBreakInside = 'avoid';
    styles.educationItem.breakInside = 'avoid';
    styles.referenceItem.pageBreakInside = 'avoid';
    styles.referenceItem.breakInside = 'avoid';
    
    // Section titles should not break
    styles.sectionTitle.pageBreakAfter = 'avoid';
    styles.sectionTitle.breakAfter = 'avoid';
    
    // Prevent orphans and widows
    styles.expDescription.orphans = 2;
    styles.expDescription.widows = 2;
    styles.profileText.orphans = 2;
    styles.profileText.widows = 2;
  }

  return styles;
};

export default getTorontoStyles;