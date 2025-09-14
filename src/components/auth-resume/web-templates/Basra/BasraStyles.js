/**
 * Basra - A bold, contemporary resume template
 * Features asymmetric layouts, striking typography, and modern design elements
 * Inspired by current design trends with vibrant accents and dramatic spacing
 */
export const getBasraStyles = (darkMode, settings, isPdfMode = false) => {
  const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;

  // Use light mode colors for PDF regardless of darkMode setting
  const effectiveDarkMode = isPdfMode ? false : darkMode;

  // Bold, contemporary color palette
  const colors = {
    // Main colors with high contrast
    background: effectiveDarkMode ? '#111111' : '#ffffff',
    backgroundAlt: effectiveDarkMode ? '#1a1a1a' : '#f5f5f5',
    card: effectiveDarkMode ? '#1e1e1e' : '#ffffff',
    text: effectiveDarkMode ? '#f2f2f2' : '#222222',
    textSecondary: effectiveDarkMode ? '#b0b0b0' : '#666666',
    
    // Accent color variations
    accent: accentColor,
    accentLight: effectiveDarkMode ? `${accentColor}33` : `${accentColor}22`,
    accentMedium: `${accentColor}99`,
    accentDark: `${accentColor}dd`,
    
    // Secondary accent for visual interest
    secondaryAccent: effectiveDarkMode ? '#E94560' : '#E94560',
    
    // Utility colors
    border: effectiveDarkMode ? '#333333' : '#e0e0e0',
    shadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
    shadowAccent: `${accentColor}33`,
  };

  // Base styles with contemporary elements
  const baseStyles = {
    // Main container with asymmetric design
    container: {
      fontFamily,
      lineHeight: lineSpacing,
      backgroundColor: colors.background,
      color: colors.text,
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '0',
      position: 'relative',
      overflow: 'hidden',
      // No border radius for modern edge-to-edge look
      borderRadius: '0',
    },
    
    // Bold header with asymmetric layout
    header: {
      background: colors.background,
      position: 'relative',
      padding: '0',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '38% 62%',
    },
    
    // Striking left side panel in header
    headerLeft: {
      background: colors.accent,
      padding: '40px 30px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      // Add clip path for geometric shape
      clipPath: isPdfMode ? 'none' : 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
    },
    
    // Right side content in header
    headerRight: {
      padding: '40px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    
    // Profile image with unique framing
    profileContainer: {
      width: '120px',
      height: '120px',
      position: 'relative',
      margin: '0 auto 20px',
    },
    profileImage: {
      width: '120px',
      height: '120px',
      objectFit: 'cover',
      border: `4px solid ${effectiveDarkMode ? '#ffffff' : '#ffffff'}`,
      borderRadius: '0',
      filter: 'grayscale(100%)',
      transition: 'all 0.3s ease',
      clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)', // Geometric clip
      ':hover': {
        filter: 'grayscale(0%)',
      },
    },
    
    // Bold name with striking typography
    name: {
      fontSize: '42px',
      fontWeight: '700',
      margin: '0 0 5px 0',
      color: effectiveDarkMode ? '#ffffff' : colors.accent,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '3px' : '1px',
      fontFamily: '"Montserrat", "Roboto", sans-serif',
      lineHeight: '1.1',
      position: 'relative',
    },
    
    // Job title with distinctive styling
    title: {
      fontSize: '20px',
      fontWeight: '300',
      color: effectiveDarkMode ? colors.textSecondary : colors.textSecondary,
      margin: '0 0 25px 0',
      textTransform: 'uppercase',
      letterSpacing: '3px',
    },
    
    // Bold summary statement
    summaryContainer: {
      marginTop: '20px',
    },
    summaryText: {
      fontSize: '16px',
      lineHeight: '1.6',
      fontWeight: '300',
      position: 'relative',
      borderLeft: `2px solid ${colors.accent}`,
      paddingLeft: '20px',
    },
    
    // Contact info with modern iconography
    contactGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: '15px',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: effectiveDarkMode ? '#ffffff' : '#ffffff',
      transition: 'all 0.3s ease',
      padding: '5px 0',
      fontWeight: '300',
    },
    contactIcon: {
      marginRight: '12px',
      fontSize: '16px',
    },
    
    // Main content layout with asymmetric design
    contentLayout: {
      display: 'grid',
      gridTemplateColumns: '38% 62%',
    },
    
    // Sidebar (left column) with distinct styling
    sidebar: {
      backgroundColor: colors.backgroundAlt,
      padding: '40px 30px',
      position: 'relative',
    },
    
    // Main column (right) with ample whitespace
    mainColumn: {
      padding: '40px',
      position: 'relative',
    },
    
    // Section containers with dramatic spacing
    section: {
      marginBottom: '40px',
      position: 'relative',
    },
    
    // Bold section titles with contemporary styling
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: colors.accent,
      marginBottom: '25px',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '2.5px' : '0.5px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      // Add modern underline
      paddingBottom: '10px',
      borderBottom: `2px solid ${colors.accentLight}`,
      // Add striking accent element
      '::before': {
        content: '""',
        width: '30px',
        height: '2px',
        backgroundColor: colors.accent,
        position: 'absolute',
        bottom: '-2px',
        left: '0',
      },
    },
    
    // Sidebar section titles
    sidebarSectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: effectiveDarkMode ? colors.accent : colors.accent,
      marginBottom: '25px',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '2.5px' : '0.5px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      // Add modern underline
      paddingBottom: '10px',
      borderBottom: `2px solid ${colors.accentLight}`,
      // Add striking accent element
      '::before': {
        content: '""',
        width: '30px',
        height: '2px',
        backgroundColor: colors.accent,
        position: 'absolute',
        bottom: '-2px',
        left: '0',
      },
    },
    
    // Experience items with distinctive layout
    expItem: {
      marginBottom: '30px',
      position: 'relative',
      padding: '0 0 0 20px',
      // Add vertical timeline element
      borderLeft: `2px solid ${colors.accentLight}`,
      // Add dot marker
      '::before': {
        content: '""',
        width: '12px',
        height: '12px',
        backgroundColor: colors.accent,
        position: 'absolute',
        left: '-7px',
        top: '0',
        borderRadius: '50%',
      },
    },
    
    // Experience item headers with bold typography
    expHeader: {
      marginBottom: '10px',
    },
    
    // Job title with striking styling
    expTitle: {
      fontWeight: '600',
      fontSize: '18px',
      color: colors.text,
      marginBottom: '5px',
      position: 'relative',
    },
    
    // Company with modern styling
    expCompany: {
      fontSize: '16px',
      marginBottom: '5px',
      fontWeight: '400',
      color: colors.accent,
      letterSpacing: '0.5px',
    },
    
    // Date range with distinctive badge
    expDate: {
      fontSize: '14px',
      color: colors.textSecondary,
      backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      padding: '3px 12px',
      display: 'inline-block',
      marginTop: '5px',
      marginBottom: '8px',
      fontWeight: '300',
    },
    
    // Location with subtle iconography
    expLocation: {
      fontSize: '14px',
      color: colors.textSecondary,
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      fontWeight: '300',
      '::before': {
        content: '"📍"',
        marginRight: '8px',
        fontSize: '12px',
      },
    },
    
    // Description with ample spacing
    expDescription: {
      fontSize: '14px',
      lineHeight: lineSpacing,
      color: colors.text,
      marginTop: '10px',
      fontWeight: '300',
    },
    
    // Skills with modern visualization
    skillsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    
    // Individual skill items
    skillItem: {
      fontSize: '14px',
      position: 'relative',
      marginBottom: '5px',
    },
    
    // Skill name with modern typography
    skillName: {
      fontWeight: '500',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      color: colors.text,
    },
    
    // Skill level with distinctive styling
    skillLevel: {
      height: '5px',
      backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      overflow: 'hidden',
      position: 'relative',
    },
    
    // Skill level progress bar
    skillLevelBar: {
      height: '100%',
      backgroundColor: colors.accent,
      transition: 'width 1s ease-out',
    },
    
    // Languages with modern styling
    languagesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '15px',
    },
    
    // Language item with distinctive badge
    languageItem: {
      padding: '10px 15px',
      backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      position: 'relative',
      textAlign: 'center',
    },
    
    // Language name with contemporary styling
    languageName: {
      fontWeight: '500',
      fontSize: '14px',
      marginBottom: '5px',
      color: colors.text,
    },
    
    // Language proficiency with subtle styling
    languageProficiency: {
      color: colors.accent,
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '300',
    },
    
    // Personal details with ample spacing
    personalDetails: {
      marginBottom: '15px',
    },
    
    // Personal detail item with distinctive styling
    personalDetailItem: {
      marginBottom: '12px',
      fontSize: '14px',
      color: colors.text,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '30px',
      fontWeight: '300',
      // Icon container styling
      '::before': {
        position: 'absolute',
        left: '0',
        fontSize: '16px',
      },
    },
    
    // Hobbies section
    hobbiesContainer: {
      fontSize: '14px',
    },
    
    // Hobbies text with contemporary styling
    hobbiesText: {
      margin: '0',
      lineHeight: lineSpacing,
      fontWeight: '300',
    },
    
    // Hobbies grid with modern layout
    hobbiesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    
    // Individual hobby item with distinctive badge
    hobbyItem: {
      backgroundColor: colors.accentLight,
      color: colors.text,
      padding: '6px 12px',
      fontSize: '13px',
      fontWeight: '300',
      display: 'inline-block',
    },
    
    // References with ample spacing
    referralsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '20px',
    },
    
    // Reference item with distinctive card styling
    referralItem: {
      backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      padding: '15px',
      position: 'relative',
    },
    
    // Reference name with bold typography
    referralName: {
      fontWeight: '600',
      fontSize: '15px',
      color: colors.accent,
      marginBottom: '5px',
    },
    
    // Reference position with contemporary styling
    referralPosition: {
      color: colors.textSecondary,
      fontSize: '13px',
      marginBottom: '10px',
      fontWeight: '300',
      fontStyle: 'italic',
    },
    
    // Reference contact with distinctive styling
    referralContact: {
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      color: colors.text,
      fontWeight: '300',
      // Add email icon
      '::before': {
        content: '"📧"',
        marginRight: '8px',
        fontSize: '13px',
      },
    },
    
    // Reference text with contemporary styling
    referralsText: {
      fontSize: '14px',
      fontStyle: 'italic',
      color: colors.textSecondary,
      fontWeight: '300',
    },
  };
  
  // PDF-specific adjustments
  if (isPdfMode) {
    // Reset container for PDF
    baseStyles.container = {
      ...baseStyles.container,
      maxWidth: '100%',
      margin: '0',
      backgroundColor: '#ffffff',
      color: '#222222',
    };
    
    // Simplify header for PDF
    baseStyles.header = {
      ...baseStyles.header,
      gridTemplateColumns: '33% 67%',
    };
    
    // Adjust header left for PDF
    baseStyles.headerLeft = {
      ...baseStyles.headerLeft,
      clipPath: 'none',
      background: accentColor,
    };
    
    // Adjust content layout for PDF
    baseStyles.contentLayout = {
      ...baseStyles.contentLayout,
      gridTemplateColumns: '33% 67%',
    };
    
    // Adjust sidebar for PDF
    baseStyles.sidebar = {
      ...baseStyles.sidebar,
      backgroundColor: '#f5f5f5',
      padding: '30px 25px',
    };
    
    // Adjust main column for PDF
    baseStyles.mainColumn = {
      ...baseStyles.mainColumn,
      padding: '30px 25px',
    };
    
    // Ensure sections don't break across pages
    baseStyles.section = {
      ...baseStyles.section,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    };
    
    // Simplify experience item for PDF
    baseStyles.expItem = {
      ...baseStyles.expItem,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    };
    
    // PDF-specific print properties
    baseStyles.container.WebkitPrintColorAdjust = 'exact';
    baseStyles.container.printColorAdjust = 'exact';
  }

  return baseStyles;
};

export default getBasraStyles;