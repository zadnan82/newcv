/**
 * Eridu - A bold, funky resume template inspired by ancient Eriduian aesthetics with modern execution
 * Features diagonal elements, bold typography, and layered design
 * Distinctive layout with zigzag elements and dimensional effects
 */
export const getEriduStyles = (darkMode, settings, isPdfMode = false) => {
    const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;
  
    // Use light mode colors for PDF regardless of darkMode setting
    const effectiveDarkMode = isPdfMode ? false : darkMode;
  
    // Funky, vibrant color palette
    const colors = {
      // Main colors with striking contrast
      background: effectiveDarkMode ? '#191923' : '#f8f8f8',
      backgroundAlt: effectiveDarkMode ? '#262636' : '#ffffff',
      cardBackground: effectiveDarkMode ? '#262636' : '#ffffff',
      text: effectiveDarkMode ? '#e9e9e9' : '#232323',
      textSecondary: effectiveDarkMode ? '#a7a7a7' : '#636363',
      
      // Primary accent color and variations
      accent: accentColor,
      accentLight: effectiveDarkMode ? `${accentColor}33` : `${accentColor}22`,
      accentMedium: `${accentColor}88`,
      accentDark: `${accentColor}cc`,
      
      // Secondary accent colors for funky effect
      accent2: effectiveDarkMode ? '#FF8066' : '#FF8066', // Coral/orange
      accent3: effectiveDarkMode ? '#4ECDC4' : '#4ECDC4', // Turquoise
      
      // Utility colors
      border: effectiveDarkMode ? '#333344' : '#e2e2e2',
      shadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.08)',
      shadowAccent: `${accentColor}33`,
    };
  
    // Base styles with funky, distinctive elements
    const baseStyles = {
      // Main container with funky diagonal background
      container: {
        fontFamily,
        lineHeight: lineSpacing,
        backgroundColor: colors.background,
        color: colors.text,
        maxWidth: '950px',
        margin: '0 auto',
        padding: '0',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '0',
        // Add subtle zigzag pattern
        backgroundImage: effectiveDarkMode
          ? `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20L20 0L40 20L20 40Z' fill='%23${accentColor.slice(1)}11' fill-rule='evenodd'/%3E%3C/svg%3E")`
          : `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20L20 0L40 20L20 40Z' fill='%23${accentColor.slice(1)}11' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      },
      
      // Funky diagonal header with layered design
      header: {
        position: 'relative',
        padding: '0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.backgroundAlt,
        // Add distinctive diagonal cut
        clipPath: isPdfMode ? 'none' : 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        // Add funky wave pattern as pseudo element
        '::before': isPdfMode ? undefined : {
          content: '""',
          position: 'absolute',
          width: '140%',
          height: '100px',
          bottom: '-20px',
          left: '-20%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23${accentColor.slice(1)}'/%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%23${accentColor.slice(1)}'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }
      },
      
      // Funky upper header with profile and name
      headerUpper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '35px 40px 20px',
        position: 'relative',
        zIndex: 2,
      },
      
      // Funky lower header with contact details
      headerLower: {
        padding: '0 40px 50px',
        position: 'relative',
        zIndex: 2,
      },
      
      // Profile section with bold styling
      profileSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '25px',
        flexWrap: 'wrap',
      },
      
      // Profile image with funky frame
      profileContainer: {
        width: '120px',
        height: '120px',
        position: 'relative',
        // Add distinctive zigzag border
        '::before': {
          content: '""',
          position: 'absolute',
          top: '-8px',
          left: '-8px',
          right: '-8px',
          bottom: '-8px',
          background: colors.accent,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
          zIndex: -1,
        },
      },
      
      profileImage: {
        width: '120px',
        height: '120px',
        objectFit: 'cover',
        border: `4px solid ${colors.backgroundAlt}`,
        transition: 'all 0.3s ease',
        // Unusual shape for funky effect
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
      },
      
      // Name and title with bold styling
      nameSection: {
        flex: '1',
        minWidth: '300px',
      },
      
      // Bold name with distinctive styling
      name: {
        fontSize: '42px',
        fontWeight: '900',
        margin: '0 0 5px 0',
        color: colors.accent,
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '2px' : '0px',
        // Text stroke for funky effect
        WebkitTextStroke: effectiveDarkMode ? '1px rgba(255,255,255,0.2)' : '1px rgba(0,0,0,0.08)',
        textShadow: `2px 2px 0 ${colors.accentLight}`,
        // Add zigzag underline
        position: 'relative',
        paddingBottom: '10px',
        '::after': {
          content: '""',
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '100px',
          height: '5px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='5' viewBox='0 0 100 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L10 5 L20 0 L30 5 L40 0 L50 5 L60 0 L70 5 L80 0 L90 5 L100 0' stroke='%23${accentColor.slice(1)}' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        },
      },
      
      // Job title with distinctive styling
      title: {
        fontSize: '20px',
        fontWeight: '300',
        color: colors.textSecondary,
        letterSpacing: '1px',
        position: 'relative',
        display: 'inline-block',
        padding: '5px 10px',
        // Background badge for funky effect
        backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        borderLeft: `3px solid ${colors.accent}`,
        transform: 'skew(-5deg)',
      },
      
      // Summary with distinctive styling
      summary: {
        fontSize: '16px',
        lineHeight: '1.6',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: `1px dashed ${colors.border}`,
        fontWeight: '300',
        maxWidth: '800px',
        position: 'relative',
        // Add unique quote marks
        '::before': {
          content: '"❝"',
          position: 'absolute',
          top: '5px',
          left: '-10px',
          color: colors.accent,
          fontSize: '24px',
          opacity: '0.5',
        },
        '::after': {
          content: '"❞"',
          position: 'absolute',
          bottom: '-20px',
          right: '0',
          color: colors.accent,
          fontSize: '24px',
          opacity: '0.5',
        },
      },
      
      // Contact details with funky badge layout
      contactGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: '15px',
      },
      
      // Individual contact item with badge styling
      contactItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        color: colors.text,
        padding: '8px 15px',
        borderRadius: '4px',
        // Add subtle transformation
        transform: 'skew(-5deg)',
        transition: 'all 0.3s ease',
        ':hover': {
          transform: 'skew(0deg) scale(1.05)',
          backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
        },
      },
      
      contactIcon: {
        marginRight: '10px',
        color: colors.accent,
      },
      
      // Main content area with funky layout
      contentLayout: {
        display: 'flex',
        flexDirection: 'column',
      },
      
      // Two column content with funky staggered layout
      contentColumns: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '30px',
        padding: '40px',
        backgroundColor: colors.background,
        position: 'relative',
      },
      
      // Main column content
      column: {
        display: 'flex',
        flexDirection: 'column',
        gap: '35px',
      },
      
      // Distinctive section styling
      section: {
        position: 'relative',
        backgroundColor: colors.cardBackground,
        padding: '30px',
        // Distinctive angled corner
        clipPath: isPdfMode ? 'none' : 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)',
        // Distinctive border
        borderTop: `4px solid ${colors.accent}`,
        boxShadow: `0 6px 15px ${colors.shadow}`,
      },
      
      // Bold section titles with distinctive styling
      sectionTitle: {
        fontSize: '22px',
        fontWeight: '800',
        color: colors.accent,
        marginBottom: '25px',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '2px' : '0px',
        // Text stroke for funky effect
        WebkitTextStroke: effectiveDarkMode ? '0.5px rgba(255,255,255,0.1)' : '0.5px rgba(0,0,0,0.05)',
        // Add geometric shape
        display: 'flex',
        alignItems: 'center',
        '::before': {
          content: '""',
          display: 'inline-block',
          width: '14px',
          height: '14px',
          backgroundColor: colors.accent,
          marginRight: '10px',
          // Distinctive triangle shape
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        },
      },
      
      // Experience items with funky card styling
      expItem: {
        marginBottom: '25px',
        borderLeft: `2px dashed ${colors.accent}`,
        paddingLeft: '20px',
        position: 'relative',
        // Add distinctive dot marker
        '::before': {
          content: '""',
          position: 'absolute',
          left: '-10px',
          top: '0',
          width: '18px',
          height: '18px',
          backgroundColor: colors.background,
          border: `2px solid ${colors.accent}`,
          borderRadius: '50%',
        },
        // Add second dot marker for funkiness
        '::after': {
          content: '""',
          position: 'absolute',
          left: '-6px',
          top: '4px',
          width: '10px',
          height: '10px',
          backgroundColor: colors.accent,
          borderRadius: '50%',
        },
      },
      
      // Experience item headers
      expHeader: {
        marginBottom: '12px',
      },
      
      // Job title with distinctive styling
      expTitle: {
        fontWeight: '700',
        fontSize: '18px',
        color: colors.text,
        marginBottom: '5px',
        // Add subtle accent
        borderBottom: `2px solid ${colors.accentLight}`,
        paddingBottom: '4px',
        display: 'inline-block',
      },
      
      // Company with funky badge
      expCompany: {
        fontSize: '16px',
        fontWeight: '500',
        color: colors.accent,
        display: 'inline-block',
        padding: '2px 8px',
        backgroundColor: colors.accentLight,
        marginRight: '10px',
        // Add subtle transformation
        transform: 'skew(-5deg)',
      },
      
      // Date badge with distinctive styling
      expDate: {
        fontSize: '14px',
        color: colors.textSecondary,
        display: 'inline-block',
        padding: '2px 8px',
        backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        marginTop: '8px',
        fontWeight: '300',
      },
      
      // Location with funky icon
      expLocation: {
        fontSize: '14px',
        color: colors.textSecondary,
        marginTop: '8px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: '300',
        // Add pin icon
        '::before': {
          content: '"📍"',
          marginRight: '8px',
          fontSize: '12px',
        },
      },
      
      // Description with clean styling
      expDescription: {
        fontSize: '14px',
        lineHeight: lineSpacing,
        color: colors.text,
        fontWeight: '300',
        borderTop: `1px dashed ${colors.border}`,
        paddingTop: '10px',
        marginTop: '10px',
      },
      
      // Skills with funky visualization
      skillsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '15px',
      },
      
      // Individual skill with distinctive styling
      skillItem: {
        backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        padding: '15px',
        position: 'relative',
        // Distinctive angled corner
        clipPath: isPdfMode ? 'none' : 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
        // Add subtle border
        borderLeft: `2px solid ${colors.accent}`,
      },
      
      // Skill name with distinctive styling
      skillName: {
        fontWeight: '600',
        fontSize: '15px',
        marginBottom: '10px',
        color: colors.text,
        // Add subtle accent
        borderBottom: `1px dashed ${colors.border}`,
        paddingBottom: '8px',
      },
      
      // Skill level with funky visualization
      skillLevel: {
        height: '8px',
        backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        position: 'relative',
        // Add zigzag pattern
        clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)',
      },
      
      // Skill level bar
      skillLevelBar: {
        height: '100%',
        backgroundColor: colors.accent,
        transition: 'width 1s ease-out',
      },
      
      // Languages with funky grid
      languagesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '15px',
      },
      
      // Language item with distinctive badge styling
      languageItem: {
        padding: '8px 12px',
        backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        borderLeft: `2px solid ${colors.accent}`,
        // Distinctive angled corner
        clipPath: isPdfMode ? 'none' : 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
        transition: 'all 0.3s ease',
        ':hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 5px 10px ${colors.shadow}`,
        },
      },
      
      // Language name with distinctive styling
      languageName: {
        fontWeight: '600',
        fontSize: '14px',
        marginBottom: '5px',
        color: colors.text,
      },
      
      // Language proficiency badge
      languageProficiency: {
        color: colors.accent,
        fontSize: '12px',
        fontWeight: '300',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        // Add subtle background
        backgroundColor: colors.accentLight,
        padding: '1px 5px',
        display: 'inline-block',
      },
      
      // Hobbies with funky visualization
      hobbiesGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
      },
      
      // Hobby item with distinctive badge styling
      hobbyItem: {
        backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        color: colors.text,
        padding: '6px 12px',
        fontSize: '13px',
        fontWeight: '400',
        // Add transformation and border
        transform: 'skew(-5deg)',
        borderLeft: `2px solid ${colors.accent}`,
        transition: 'all 0.3s ease',
        ':hover': {
          transform: 'skew(0deg) scale(1.05)',
          backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
        },
      },
      
      // Hobbies text
      hobbiesText: {
        fontSize: '14px',
        lineHeight: lineSpacing,
        fontWeight: '300',
        color: colors.text,
      },
      
      // Personal details
      personalDetails: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '15px',
      },
      
      // Personal detail item with distinctive styling
      personalDetailItem: {
        fontSize: '14px',
        color: colors.text,
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        borderLeft: `2px solid ${colors.accent}`,
        fontWeight: '300',
        // Distinctive angled corner
        clipPath: isPdfMode ? 'none' : 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
      },
      
      // Icon in personal detail
      personalDetailIcon: {
        marginRight: '10px',
        color: colors.accent,
      },
      
      // References grid with distinctive layout
      referralsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '15px',
      },
      
      // Reference item with distinctive styling
      referralItem: {
        padding: '15px',
        backgroundColor: effectiveDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        borderLeft: `2px solid ${colors.accent}`,
        // Distinctive angled corner
        clipPath: isPdfMode ? 'none' : 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
        transition: 'all 0.3s ease',
        ':hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 5px 10px ${colors.shadow}`,
        },
      },
      
      // Reference name with distinctive styling
      referralName: {
        fontWeight: '600',
        fontSize: '15px',
        color: colors.accent,
        marginBottom: '5px',
        // Add subtle underline
        borderBottom: `1px dashed ${colors.border}`,
        paddingBottom: '5px',
      },
      
      // Reference position
      referralPosition: {
        color: colors.textSecondary,
        fontSize: '13px',
        marginBottom: '10px',
        fontWeight: '300',
        fontStyle: 'italic',
      },
      
      // Reference contact with distinctive icon
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
          color: colors.accent,
        },
      },
      
      // Reference text
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
        color: '#232323',
        backgroundImage: 'none',
      };
      
      // Simplify header for PDF
      baseStyles.header = {
        ...baseStyles.header,
        clipPath: 'none',
        backgroundColor: '#ffffff',
        '::before': undefined,
      };
      
      // Simplify content for PDF
      baseStyles.contentColumns = {
        ...baseStyles.contentColumns,
        backgroundColor: '#ffffff',
      };
      
      // Simplify section for PDF
      baseStyles.section = {
        ...baseStyles.section,
        clipPath: 'none',
        boxShadow: 'none',
        border: `1px solid ${colors.border}`,
        borderTop: `4px solid ${accentColor}`,
      };
      
      // Simplify skill item for PDF
      baseStyles.skillItem = {
        ...baseStyles.skillItem,
        clipPath: 'none',
      };
      
      // Simplify language item for PDF
      baseStyles.languageItem = {
        ...baseStyles.languageItem,
        clipPath: 'none',
      };
      
      // Simplify personal detail item for PDF
      baseStyles.personalDetailItem = {
        ...baseStyles.personalDetailItem,
        clipPath: 'none',
      };
      
      // Simplify referral item for PDF
      baseStyles.referralItem = {
        ...baseStyles.referralItem,
        clipPath: 'none',
      };
      
      // Ensure sections don't break across pages
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
  
  export default getEriduStyles;