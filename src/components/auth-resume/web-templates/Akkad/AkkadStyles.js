/**
 * Complete redesign of Akkad template
 * Modern, fancy, professional layout with visual appeal
 * Enhanced with sleek design elements and better typography
 */
export const getAkkadStyles = (darkMode, settings, isPdfMode = false) => {
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
      maxWidth: '880px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 15px 50px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
    },
    
    // INNOVATIVE HEADER DESIGN - asymmetric split with accent color
    header: {
      position: 'relative',
      backgroundColor: colors.background,
      color: colors.text,
      display: 'grid',
      gridTemplateColumns: '38% 62%',
    },
    
    // Creative left header panel with full accent color
    headerLeft: {
      backgroundColor: colors.accent,
      padding: '35px 25px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      // Decorative triangle shape for visual interest
      '::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: '-30px',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '0 0 100% 30px',
        borderColor: `transparent transparent transparent ${colors.accent}`,
        zIndex: 1
      }
    },
    
    // Modern right header panel with clean design
    headerContent: {
      padding: '35px 30px 35px 40px',
      position: 'relative',
      zIndex: 0,
      // Subtle background pattern for depth
      '::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.03,
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        zIndex: -1
      }
    },
    
    // Stylish profile image container
    profileImageContainer: {
      marginBottom: '20px',
      position: 'relative',
      // Decorative rings around the profile image
      '::before': {
        content: '""',
        position: 'absolute',
        top: -10,
        left: -10,
        right: -10,
        bottom: -10,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.2)',
        zIndex: 0
      },
      '::after': {
        content: '""',
        position: 'absolute',
        top: -20,
        left: -20,
        right: -20,
        bottom: -20,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.1)',
        zIndex: 0
      }
    },
    
    // Elegant profile image
    profileImage: {
      width: '130px',
      height: '130px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid rgba(255,255,255,0.8)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      backgroundColor: 'rgba(255,255,255,0.2)',
      position: 'relative',
      zIndex: 1
    },
    
    // Stylish name display
    name: {
      fontSize: '32px',
      fontWeight: '800',
      margin: '0 0 5px 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '2px' : '0.5px',
      position: 'relative',
      // Modern underline accent for name
      '::after': {
        content: '""',
        display: 'block',
        width: '70px',
        height: '4px',
        marginTop: '10px',
        background: `linear-gradient(to right, ${colors.accent}, ${colors.accentLight})`,
        borderRadius: '2px'
      }
    },
    
    // Professional title styling
    title: {
      fontSize: '18px',
      fontWeight: '500',
      marginTop: '15px',
      marginBottom: '15px',
      color: colors.textSecondary,
      letterSpacing: '0.5px',
    },
    
    // Modern contact information layout
    contactGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '20px',
    },
    
    // Sleek contact items
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      padding: '8px 12px',
      borderRadius: '6px',
      marginRight: '5px',
      marginBottom: '8px',
      transition: 'all 0.2s ease',
      backgroundColor: colors.backgroundSecondary,
      border: `1px solid ${colors.border}`,
      // Color accents and hover effects
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 5px 10px ${colors.shadow}`,
        borderColor: colors.accent
      }
    },
    
    // Contact icons
    contactIcon: {
      marginRight: '8px',
      fontSize: '16px',
      color: colors.accent
    },
    
    // MAIN LAYOUT STRUCTURE - modern two-column
    contentLayout: {
      display: 'grid',
      gridTemplateColumns: '62% 38%',
      position: 'relative',
    },
    
    // MAIN CONTENT COLUMN with clean design
    mainColumn: {
      padding: '30px 35px',
      backgroundColor: colors.background,
      position: 'relative',
      borderRight: `1px solid ${colors.border}`,
    },
    
    // Modern section styling
    section: {
      marginBottom: '28px',
      position: 'relative',
    },
    
    // Innovative section titles
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: colors.accent,
      marginBottom: '20px',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.2px' : '0.4px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      // Modern underline with dot accent
      paddingBottom: '8px',
      borderBottom: `1px solid ${colors.border}`,
      '::after': {
        content: '""',
        position: 'absolute',
        left: '0',
        bottom: '-2px',
        width: '50px',
        height: '3px',
        borderRadius: '3px',
        backgroundColor: colors.accent,
      },
      '::before': {
        content: '""',
        position: 'absolute',
        left: '55px',
        bottom: '-3px',
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        backgroundColor: colors.accent,
      }
    },
    
    // Section content container
    sectionContent: {
      width: '100%',
    },
    
    // Stylish summary block
    summary: {
      fontSize: '15px',
      lineHeight: lineSpacing,
      padding: '18px 22px',
      borderRadius: '8px',
      backgroundColor: colors.backgroundSecondary,
      color: colors.text,
      position: 'relative',
      marginBottom: '20px',
      borderLeft: `4px solid ${colors.accent}`,
      boxShadow: `0 3px 10px ${colors.shadow}`,
      // Quote styling for summary
      '::before': {
        content: '"""',
        position: 'absolute',
        top: '8px',
        left: '10px',
        fontSize: '40px',
        color: `${colors.accent}20`,
        fontFamily: 'Georgia, serif',
        lineHeight: '1'
      }
    },
    
    // REDESIGNED EXPERIENCE ITEMS - modern card design
    expItem: {
      marginBottom: '20px',
      padding: '18px 22px',
      borderRadius: '8px',
      backgroundColor: colors.backgroundSecondary,
      boxShadow: `0 3px 12px ${colors.shadow}`,
      border: `1px solid ${colors.border}`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
      // Subtle accent visual
      '::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        top: '0',
        height: '100%',
        width: '3px',
        backgroundColor: colors.accent,
      }
    },
    
    // Modern experience header
    expHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
      flexWrap: 'wrap',
    },
    
    // Secondary experience information row
    expItemSecond: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      flexWrap: 'wrap',
    },
    
    // Job title styling
    expTitle: {
      fontWeight: '700',
      fontSize: '17px',
      color: colors.accent,
      marginBottom: '5px',
    },
    
    // Date badge styling
    expDate: {
      fontSize: '13px',
      color: colors.background,
      backgroundColor: colors.accent,
      padding: '4px 10px',
      borderRadius: '20px',
      fontWeight: '500',
      display: 'inline-block',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    
    // Company name styling
    expCompany: {
      fontSize: '15px',
      marginBottom: '5px',
      fontWeight: '600',
      color: colors.textHeading,
    },
    
    // Location styling
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
    
    // Description styling
    expDescription: {
      fontSize: '14px',
      lineHeight: lineSpacing,
      color: colors.text,
      paddingTop: '10px',
      borderTop: `1px solid ${colors.border}`,
    },
    
    // SIDEBAR STYLING - modern with visual hierarchy
    sidebar: {
      padding: '30px 25px',
      backgroundColor: colors.backgroundAlt,
      position: 'relative',
    },
    
    // Sidebar sections
    sidebarSection: {
      marginBottom: '25px',
      position: 'relative',
    },
    
    // Sidebar section titles
    sidebarSectionTitle: {
      fontSize: '17px',
      fontWeight: '700',
      color: colors.accent,
      marginBottom: '15px',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : '0.3px',
      position: 'relative',
      paddingBottom: '8px',
      borderBottom: `1px solid ${colors.border}`,
      // Accent for sidebar titles
      '::before': {
        content: '""',
        display: 'inline-block',
        width: '8px',
        height: '8px',
        backgroundColor: colors.accent,
        borderRadius: '50%',
        marginRight: '8px',
        verticalAlign: 'middle'
      }
    },
    
    // Personal details section
    personalDetails: {
      marginBottom: '15px',
    },
    
    // Personal detail items
    personalDetailItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      marginBottom: '12px',
      padding: '5px 0',
      borderBottom: `1px dashed ${colors.borderLight}`,
      paddingBottom: '8px',
    },
    
    // SKILLS SECTION - modern visualization
    skillsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    },
    
    // Skill items
    skillItem: {
      fontSize: '14px',
      position: 'relative',
      padding: '5px 0',
    },
    
    // Skill name
    skillName: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '6px',
      fontWeight: '600',
    },
    
    // Skill level bar container
    skillLevel: {
      height: '6px',
      backgroundColor: `${colors.border}80`,
      borderRadius: '3px',
      overflow: 'hidden',
      position: 'relative',
    },
    
    // Skill level indicator
    skillLevelBar: {
      height: '100%',
      borderRadius: '3px',
      position: 'relative',
      background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentLight})`,
      // Animated shimmer effect
      '::after': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '30px',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        animation: 'shimmer 1.5s infinite',
      }
    },
    
    // LANGUAGES SECTION - modern badges
    languagesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    
    // Language item
    languageItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: '14px',
      padding: '10px',
      borderRadius: '8px',
      backgroundColor: colors.backgroundSecondary,
      border: `1px solid ${colors.border}`,
      width: 'calc(50% - 5px)',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: `0 5px 15px ${colors.shadow}`,
        borderColor: colors.accent
      }
    },
    
    // Language name
    languageName: {
      fontWeight: '600',
      marginBottom: '5px',
    },
    
    // Language proficiency badge
    languageProficiency: {
      color: '#ffffff',
      fontSize: '12px',
      padding: '3px 8px',
      backgroundColor: colors.accent,
      borderRadius: '12px',
      fontWeight: '500',
    },
    
    // HOBBIES SECTION - modern visualization
    hobbiesContainer: {
      fontSize: '14px',
    },
    
    // Hobbies text paragraph
    hobbiesText: {
      margin: '0',
      lineHeight: lineSpacing,
      padding: '12px 15px',
      borderRadius: '8px',
      backgroundColor: colors.backgroundSecondary,
      border: `1px solid ${colors.border}`,
    },
    
    // Hobbies grid
    hobbiesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    
    // Hobby item
    hobbyItem: {
      backgroundColor: colors.backgroundSecondary,
      padding: '7px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      color: colors.text,
      border: `1px solid ${colors.border}`,
      marginBottom: '8px',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: colors.accent,
        color: '#ffffff',
        borderColor: colors.accent
      }
    },
    
    // REFERENCES SECTION
    referralsSection: {
      marginBottom: '25px',
    },
    
    // References provided upon request
    referralsText: {
      fontSize: '14px',
      fontStyle: 'italic',
      padding: '12px 15px',
      borderRadius: '8px',
      backgroundColor: colors.backgroundSecondary,
      border: `1px solid ${colors.border}`,
    },
    
    // References grid
    referralsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    
    // Reference item
    referralItem: {
      fontSize: '14px',
      padding: '12px 15px',
      borderRadius: '8px',
      backgroundColor: colors.backgroundSecondary,
      border: `1px solid ${colors.border}`,
      marginBottom: '10px',
    },
    
    // Reference name
    referralName: {
      fontWeight: '700',
      fontSize: '15px',
      color: colors.accent,
      marginBottom: '5px',
    },
    
    // Reference relation/position
    referralRelation: {
      color: colors.textSecondary,
      marginBottom: '8px',
      fontSize: '13px',
      fontWeight: '500',
    },
    
    // Reference contact
    referralContact: {
      fontSize: '13px',
      marginBottom: '5px',
      display: 'flex',
      alignItems: 'center',
      color: colors.textSecondary,
      '::before': {
        content: '"📧"',
        marginRight: '5px',
        fontSize: '12px',
      },
    },
    
    // Animation keyframes
    '@keyframes shimmer': {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' }
    }
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
      gridTemplateColumns: '35% 65%',
    };
    
    baseStyles.headerLeft = {
      ...baseStyles.headerLeft,
      backgroundColor: colors.accent,
      '::after': undefined,
    };
    
    baseStyles.headerContent = {
      ...baseStyles.headerContent,
      '::before': undefined,
    };
    
    baseStyles.profileImageContainer = {
      ...baseStyles.profileImageContainer,
      '::before': undefined,
      '::after': undefined,
    };
    
    // Adjust section titles for PDF
    baseStyles.sectionTitle = {
      ...baseStyles.sectionTitle,
      '::after': undefined,
      '::before': undefined,
      borderBottom: `2px solid ${colors.accent}`,
      pageBreakAfter: 'avoid',
      breakAfter: 'avoid',
    };
    
    baseStyles.sidebarSectionTitle = {
      ...baseStyles.sidebarSectionTitle,
      '::before': undefined,
      borderBottom: `2px solid ${colors.accent}`,
      pageBreakAfter: 'avoid',
      breakAfter: 'avoid',
    };
    
    // Adjust skill level bar for PDF
    baseStyles.skillLevelBar = {
      ...baseStyles.skillLevelBar,
      backgroundColor: colors.accent,
      background: colors.accent,
      '::after': undefined,
    };
    
    // Simplify experience item styling for PDF
    baseStyles.expItem = {
      ...baseStyles.expItem,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
      '::before': undefined,
      borderLeft: `3px solid ${colors.accent}`,
    };
    
    // Ensure languages don't break
    baseStyles.languageItem = {
      ...baseStyles.languageItem,
      '&:hover': undefined,
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
    };
    
    // Ensure hobby items don't break
    baseStyles.hobbyItem = {
      ...baseStyles.hobbyItem,
      '&:hover': undefined,
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
  const accentDark = shadeColor(accentColor, -20);
  const accentLight = shadeColor(accentColor, 30);
  
  return {
    accent: accentColor,
    accentDark: accentDark,
    accentLight: accentLight,
    
    // Core colors
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    backgroundSecondary: isDarkMode ? '#252525' : '#f8f9fa',
    backgroundAlt: isDarkMode ? '#212121' : '#f5f7fa',
    
    // Text colors
    text: isDarkMode ? '#e0e0e0' : '#3a3a3a',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    textHeading: isDarkMode ? '#ffffff' : '#222222',
    
    // Borders and shadows
    border: isDarkMode ? '#333333' : '#e0e0e0',
    borderLight: isDarkMode ? '#2a2a2a' : '#eaeaea',
    shadow: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.08)',
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

export default getAkkadStyles;