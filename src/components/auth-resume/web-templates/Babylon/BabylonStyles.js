/**
 * Babylon - A luxurious, elegant resume template
 * Features rich textures, elegant typography, and sophistication
 * Inspired by ancient Babylonian aesthetics with modern execution
 */
export const getBabylonStyles = (darkMode, settings, isPdfMode = false) => {
    const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;
  
    // Use light mode colors for PDF regardless of darkMode setting
    const effectiveDarkMode = isPdfMode ? false : darkMode;
  
    // Rich, luxurious color palette
    const colors = {
      // Main colors
      background: effectiveDarkMode ? '#1a1610' : '#fcf7f1',
      card: effectiveDarkMode ? '#241f18' : '#ffffff',
      text: effectiveDarkMode ? '#e0d8c9' : '#33302a',
      textSecondary: effectiveDarkMode ? '#a19983' : '#6d6a61',
      
      // Accent color variations
      accent: accentColor,
      accentLight: effectiveDarkMode ? `${accentColor}33` : `${accentColor}22`,
      accentMedium: `${accentColor}99`,
      accentDark: `${accentColor}dd`,
      
      // Gold palette for luxurious feel
      gold: effectiveDarkMode ? '#d4af37' : '#d4af37',
      goldLight: effectiveDarkMode ? '#e2c158' : '#e5ca7b',
      goldDark: effectiveDarkMode ? '#b18f29' : '#b18f29',
      
      // Utility colors for borders, shadows, etc.
      border: effectiveDarkMode ? '#312a22' : '#e9e2d6',
      shadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)',
      shadowAccent: `${accentColor}33`,
    };
  
    // Base styles with elegant, luxurious elements
    const baseStyles = {
      // Main container with texture and golden accents
      container: {
        fontFamily,
        lineHeight: lineSpacing,
        backgroundColor: colors.background,
        color: colors.text,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0',
        position: 'relative',
        borderRadius: '0',
        overflow: 'hidden',
        boxShadow: `0 10px 30px ${colors.shadow}`,
        // Add subtle texture pattern
        backgroundImage: effectiveDarkMode
          ? 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          : 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        border: `1px solid ${colors.goldLight}`,
        // Add subtle gold border top/bottom for elegance
        borderTop: `4px solid ${colors.gold}`,
        borderBottom: `4px solid ${colors.gold}`,
      },
      
      // Header with luxurious gradient and pattern
      header: {
        background: effectiveDarkMode 
          ? `linear-gradient(to right, #241f18, #2c261e)`
          : `linear-gradient(to right, #f8f3ea, #ffffff)`,
        position: 'relative',
        padding: '35px 40px',
        overflow: 'hidden',
        borderBottom: `1px solid ${colors.goldLight}`,
        // Add Babylonian-inspired pattern overlay
        '::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          opacity: '0.07',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23d4af37' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          zIndex: 0,
        },
      },
      
      // Header content layout
      headerContent: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      },
      
      // Profile image with elegant frame
      profileContainer: {
        width: '150px',
        marginRight: '40px',
        position: 'relative',
        padding: '10px',
        background: effectiveDarkMode ? '#241f18' : '#ffffff',
        boxShadow: `0 5px 15px ${colors.shadow}`,
        // Add gold border
        border: `1px solid ${colors.goldLight}`,
        // Add decorative corner elements
        '::before': {
          content: '""',
          position: 'absolute',
          top: '-6px',
          left: '-6px',
          width: '20px',
          height: '20px',
          borderTop: `2px solid ${colors.gold}`,
          borderLeft: `2px solid ${colors.gold}`,
        },
        '::after': {
          content: '""',
          position: 'absolute',
          bottom: '-6px',
          right: '-6px',
          width: '20px',
          height: '20px',
          borderBottom: `2px solid ${colors.gold}`,
          borderRight: `2px solid ${colors.gold}`,
        },
      },
      profileImage: {
        width: '130px',
        height: '130px',
        objectFit: 'cover',
        filter: effectiveDarkMode ? 'grayscale(20%) contrast(110%)' : 'grayscale(0%)',
        transition: 'all 0.3s ease',
        border: `1px solid ${colors.goldLight}`,
        ':hover': {
          filter: 'grayscale(0%)',
        },
      },
      
      // Name with elegant typography
      nameContainer: {
        flex: '1',
        minWidth: '300px',
      },
      name: {
        fontSize: '38px',
        fontWeight: '300', // Lighter weight for elegance
        margin: '0 0 5px 0',
        color: effectiveDarkMode ? colors.goldLight : colors.accent,
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '3px' : '1px',
        fontFamily: '"Cinzel", "Trajan Pro", "Times New Roman", serif',
        borderBottom: `1px solid ${effectiveDarkMode ? colors.goldLight : colors.accentLight}`,
        paddingBottom: '5px',
        display: 'inline-block',
      },
      
      // Job title with elegant styling
      title: {
        fontSize: '18px',
        fontWeight: '400',
        color: effectiveDarkMode ? colors.textSecondary : colors.textSecondary,
        letterSpacing: '1px',
        marginTop: '10px',
        fontStyle: 'italic',
        textTransform: 'uppercase',
      },
      
      // Contact info with elegant icons
      contactGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: '20px',
        width: '100%',
      },
      contactItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        color: effectiveDarkMode ? colors.textSecondary : colors.textSecondary,
        padding: '6px 0',
        borderBottom: `1px solid ${effectiveDarkMode ? colors.goldLight + '33' : colors.goldLight + '33'}`,
        transition: 'all 0.3s ease',
        marginRight: '20px',
        ':hover': {
          color: effectiveDarkMode ? colors.goldLight : colors.accent,
          borderBottom: `1px solid ${effectiveDarkMode ? colors.goldLight : colors.accent}`,
        },
      },
      contactIcon: {
        marginRight: '8px',
        fontSize: '16px',
        color: effectiveDarkMode ? colors.goldLight : colors.gold,
      },
      
      // Main content layout with elegant structure
      contentLayout: {
        display: 'flex',
        flexWrap: 'wrap',
        position: 'relative',
      },
      
      // Main column (experience, education)
      mainColumn: {
        flex: '1 1 65%',
        padding: '35px 40px',
        minWidth: '300px',
        position: 'relative',
        zIndex: 1,
        // Add subtle texture to main content
        background: colors.background,
        // Add subtle right border
        borderRight: effectiveDarkMode ? `1px solid ${colors.border}` : 'none',
      },
      
      // Sidebar column (skills, languages, etc)
      sidebar: {
        flex: '1 1 35%',
        padding: '35px 30px',
        minWidth: '250px',
        backgroundColor: effectiveDarkMode ? 'rgba(36, 31, 24, 0.6)' : 'rgba(248, 243, 234, 0.6)',
        position: 'relative',
        // Add subtle left border
        borderLeft: `1px solid ${colors.goldLight}`,
      },
      
      // Section containers with elegant spacing
      section: {
        marginBottom: '35px',
        position: 'relative',
        paddingBottom: '10px',
      },
      
      // Section titles with elegant typography and ornament
      sectionTitle: {
        fontSize: '22px',
        fontWeight: '400',
        color: effectiveDarkMode ? colors.goldLight : colors.accent,
        marginBottom: '20px',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '2px' : '0.5px',
        position: 'relative',
        display: 'inline-block',
        fontFamily: '"Cinzel", "Trajan Pro", serif',
        // Add elegant divider
        '::after': {
          content: '""',
          position: 'absolute',
          left: '0',
          bottom: '-5px',
          width: '100%',
          height: '1px',
          backgroundImage: `linear-gradient(to right, ${colors.gold}, ${colors.goldLight}, transparent)`,
        },
        // Add decorative ornament
        '::before': {
          content: '""',
          position: 'absolute',
          left: '-15px',
          top: '50%',
          width: '5px',
          height: '5px',
          transform: 'translateY(-50%)',
          backgroundColor: colors.gold,
        },
      },
      
      // Sidebar section titles
      sidebarSectionTitle: {
        fontSize: '20px',
        fontWeight: '400',
        color: effectiveDarkMode ? colors.goldLight : colors.accent,
        marginBottom: '20px',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '2px' : '0.5px',
        position: 'relative',
        display: 'inline-block',
        fontFamily: '"Cinzel", "Trajan Pro", serif',
        // Add elegant divider
        '::after': {
          content: '""',
          position: 'absolute',
          left: '0',
          bottom: '-5px',
          width: '100%',
          height: '1px',
          backgroundImage: `linear-gradient(to right, ${colors.gold}, ${colors.goldLight}, transparent)`,
        },
        // Add decorative ornament
        '::before': {
          content: '""',
          position: 'absolute',
          left: '-15px',
          top: '50%',
          width: '5px',
          height: '5px',
          transform: 'translateY(-50%)',
          backgroundColor: colors.gold,
        },
      },
      
      // Experience items with elegant card design
      expItem: {
        marginBottom: '25px',
        backgroundColor: effectiveDarkMode ? 'rgba(36, 31, 24, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        padding: '20px 25px',
        position: 'relative',
        transition: 'all 0.3s ease',
        // Add subtle border and shadow
        border: `1px solid ${effectiveDarkMode ? colors.border : colors.border}`,
        boxShadow: `0 3px 10px ${colors.shadow}`,
        // Add elegant left border accent
        borderLeft: `3px solid ${colors.gold}`,
        ':hover': {
          boxShadow: `0 5px 15px ${colors.shadow}`,
          borderLeft: `3px solid ${colors.accent}`,
        },
      },
      
      // Experience item headers
      expHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      },
      
      // Job title with elegant typography
      expTitle: {
        fontWeight: '600',
        fontSize: '17px',
        color: effectiveDarkMode ? colors.goldLight : colors.accent,
        marginBottom: '5px',
        letterSpacing: '0.5px',
      },
      
      // Date with elegant styling
      expDate: {
        fontSize: '14px',
        color: effectiveDarkMode ? colors.textSecondary : colors.textSecondary,
        fontStyle: 'italic',
        letterSpacing: '0.5px',
      },
      
      // Company name with refined styling
      expCompany: {
        fontSize: '16px',
        fontWeight: '500',
        marginBottom: '5px',
        color: effectiveDarkMode ? colors.text : colors.text,
        letterSpacing: '0.5px',
      },
      
      // Location with elegant icon
      expLocation: {
        fontSize: '14px',
        color: effectiveDarkMode ? colors.textSecondary : colors.textSecondary,
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        fontStyle: 'italic',
        // Add location pin icon
        '::before': {
          content: '"📍"',
          marginRight: '5px',
          fontSize: '12px',
          color: effectiveDarkMode ? colors.goldLight : colors.gold,
        },
      },
      
      // Description text with refined typography
      expDescription: {
        fontSize: '14px',
        whiteSpace: 'pre-line',
        lineHeight: lineSpacing,
        color: effectiveDarkMode ? colors.text : colors.text,
        borderTop: `1px solid ${effectiveDarkMode ? colors.border : colors.border}`,
        paddingTop: '12px',
        marginTop: '10px',
        letterSpacing: '0.3px',
      },
      
      // Summary text with elegant styling
      summary: {
        fontSize: '15px',
        lineHeight: lineSpacing,
        padding: '0 0 0 20px',
        color: effectiveDarkMode ? colors.text : colors.text,
        fontStyle: 'italic',
        position: 'relative',
        marginBottom: '20px',
        letterSpacing: '0.3px',
        borderLeft: `2px solid ${colors.gold}`,
        '::before': {
          content: '"❝"',
          position: 'absolute',
          left: '-12px',
          top: '-5px',
          color: colors.gold,
          fontSize: '18px',
        },
        '::after': {
          content: '"❞"',
          position: 'absolute',
          right: '0',
          bottom: '-15px',
          color: colors.gold,
          fontSize: '18px',
        },
      },
      
      // Skills with elegant visualization
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
      
      // Skill name with refined typography
      skillName: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontWeight: '500',
        color: effectiveDarkMode ? colors.text : colors.text,
        letterSpacing: '0.5px',
      },
      
      // Skill level bar container
      skillLevel: {
        height: '4px',
        backgroundColor: effectiveDarkMode ? 'rgba(36, 31, 24, 0.5)' : 'rgba(230, 230, 230, 0.5)',
        overflow: 'hidden',
        position: 'relative',
      },
      
      // Skill level fill bar with elegant gradient
      skillLevelBar: {
        height: '100%',
        backgroundImage: `linear-gradient(to right, ${colors.gold}, ${colors.accent})`,
        position: 'relative',
        transition: 'width 1s ease-out',
      },
      
      // Languages grid
      languagesGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
      
      // Language item with elegant styling
      languageItem: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        padding: '8px 0',
        borderBottom: `1px solid ${effectiveDarkMode ? colors.border : colors.border}`,
        alignItems: 'center',
      },
      
      // Language name with refined typography
      languageName: {
        fontWeight: '500',
        color: effectiveDarkMode ? colors.text : colors.text,
        letterSpacing: '0.5px',
      },
      
      // Language proficiency with elegant styling
      languageProficiency: {
        color: effectiveDarkMode ? colors.goldLight : colors.gold,
        fontSize: '13px',
        fontStyle: 'italic',
        letterSpacing: '0.5px',
      },
      
      // Personal details section
      personalDetails: {
        marginBottom: '20px',
      },
      
      // Personal detail item with elegant icon
      personalDetailItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
        fontSize: '14px',
        color: effectiveDarkMode ? colors.text : colors.text,
        borderBottom: `1px solid ${effectiveDarkMode ? colors.border : colors.border}`,
        paddingBottom: '8px',
        transition: 'all 0.3s ease',
        ':hover': {
          borderBottom: `1px solid ${colors.gold}`,
        },
      },
      
      // Hobbies section
      hobbiesContainer: {
        fontSize: '14px',
      },
      
      // Hobbies text
      hobbiesText: {
        margin: '0',
        lineHeight: lineSpacing,
        letterSpacing: '0.3px',
        color: effectiveDarkMode ? colors.text : colors.text,
      },
      
      // Hobbies items grid
      hobbiesGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
      },
      
      // Individual hobby item with elegant tag
      hobbyItem: {
        borderBottom: `1px solid ${colors.gold}`,
        color: effectiveDarkMode ? colors.text : colors.text,
        padding: '5px 10px',
        fontSize: '13px',
        display: 'inline-block',
        transition: 'all 0.3s ease',
        ':hover': {
          color: effectiveDarkMode ? colors.goldLight : colors.accent,
          borderBottom: `1px solid ${colors.accent}`,
        },
      },
      
      // References section
      referralsText: {
        fontSize: '14px',
        fontStyle: 'italic',
        marginBottom: '15px',
        color: effectiveDarkMode ? colors.textSecondary : colors.textSecondary,
        borderLeft: `2px solid ${colors.gold}`,
        paddingLeft: '10px',
        letterSpacing: '0.3px',
      },
      
      // References grid
      referralsGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      },
      
      // Individual reference item with elegant card
      referralItem: {
        fontSize: '14px',
        padding: '15px',
        backgroundColor: effectiveDarkMode ? 'rgba(36, 31, 24, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        border: `1px solid ${effectiveDarkMode ? colors.border : colors.border}`,
        borderLeft: `2px solid ${colors.gold}`,
        position: 'relative',
        transition: 'all 0.3s ease',
        ':hover': {
          borderLeft: `2px solid ${colors.accent}`,
        },
      },
      
      // Reference name with elegant typography
      referralName: {
        fontWeight: '600',
        fontSize: '15px',
        color: effectiveDarkMode ? colors.goldLight : colors.accent,
        marginBottom: '3px',
        letterSpacing: '0.5px',
      },
      
      // Reference position with refined styling
      referralPosition: {
        color: effectiveDarkMode ? colors.textSecondary : colors.textSecondary,
        marginBottom: '10px',
        fontSize: '13px',
        fontWeight: '500',
        fontStyle: 'italic',
        letterSpacing: '0.3px',
      },
      
      // Reference contact with elegant icon
      referralContact: {
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        color: effectiveDarkMode ? colors.text : colors.text,
        letterSpacing: '0.3px',
        // Add email icon
        '::before': {
          content: '"📧"',
          marginRight: '5px',
          fontSize: '12px',
          color: effectiveDarkMode ? colors.goldLight : colors.gold,
        },
      },
    };
    
    // PDF-specific adjustments
    if (isPdfMode) {
      // Reset container for PDF
      baseStyles.container = {
        ...baseStyles.container,
        boxShadow: 'none',
        maxWidth: '100%',
        padding: '0',
        margin: '0',
        backgroundColor: '#ffffff',
        color: '#33302a',
        borderRadius: '0',
        borderTop: `4px solid ${colors.gold}`,
        borderBottom: `4px solid ${colors.gold}`,
        border: 'none',
        // Simplify background pattern for PDF
        backgroundImage: 'none',
      };
      
      // Simplify header for PDF
      baseStyles.header = {
        ...baseStyles.header,
        background: '#f8f3ea',
        padding: '25px',
        '::before': undefined, // Remove pattern for PDF
      };
      
      // Adjust main column for PDF
      baseStyles.mainColumn = {
        ...baseStyles.mainColumn,
        background: '#ffffff',
        padding: '25px',
        borderRight: 'none',
      };
      
      // Adjust sidebar for PDF
      baseStyles.sidebar = {
        ...baseStyles.sidebar,
        backgroundColor: '#f8f3ea',
        padding: '25px',
        borderLeft: `1px solid ${colors.border}`,
      };
      
      // Ensure sections don't break across pages
      baseStyles.section = {
        ...baseStyles.section,
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
      };
      
      // Simplify section title for PDF
      baseStyles.sectionTitle = {
        ...baseStyles.sectionTitle,
        '::before': undefined, // Remove ornament for PDF
      };
      
      // Simplify sidebar section title for PDF
      baseStyles.sidebarSectionTitle = {
        ...baseStyles.sidebarSectionTitle,
        '::before': undefined, // Remove ornament for PDF
      };
      
      // Simplify experience item for PDF
      baseStyles.expItem = {
        ...baseStyles.expItem,
        boxShadow: 'none',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
        backgroundColor: '#ffffff',
        border: `1px solid #e9e2d6`,
        borderLeft: `3px solid ${colors.gold}`,
      };
      
      // Simplify reference item for PDF
      baseStyles.referralItem = {
        ...baseStyles.referralItem,
        backgroundColor: '#ffffff',
        border: `1px solid #e9e2d6`,
        borderLeft: `2px solid ${colors.gold}`,
      };
      
      // PDF-specific print properties
      baseStyles.container.WebkitPrintColorAdjust = 'exact';
      baseStyles.container.printColorAdjust = 'exact';
    }
  
    return baseStyles;
  };
  
  export default getBabylonStyles;