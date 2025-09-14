/**
 * Baghdad template styles
 * A sophisticated resume template with Middle Eastern-inspired design aesthetics
 * Features ornamental elements, rich textures, and cultural motifs
 */
export const getBaghdadStyles = (darkMode, settings, isPdfMode = false) => {
    const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;
  
    // Use light mode colors for PDF regardless of darkMode setting
    const effectiveDarkMode = isPdfMode ? false : darkMode;
  
    // Rich Middle Eastern-inspired color palette
    const colors = {
      // Base colors
      background: effectiveDarkMode ? '#1a1a1a' : '#f9f6f0', // Parchment-like for light mode
      text: effectiveDarkMode ? '#e0e0e0' : '#2c2417', // Dark sepia for light mode
      textSecondary: effectiveDarkMode ? '#b0b0b0' : '#5d4a31', // Rich brown for light mode
      textMuted: effectiveDarkMode ? '#808080' : '#8a7a65', // Muted brown for light mode
      
      // Structure colors
      divider: effectiveDarkMode ? '#333333' : '#d4c9b8', // Soft dividers for light mode
      cardBg: effectiveDarkMode ? '#252525' : '#ffffff',
      cardBorder: effectiveDarkMode ? '#333333' : '#e8e0d0', // Soft border for light mode
      
      // Accent colors
      accent: accentColor,
      accentLight: effectiveDarkMode ? `${accentColor}40` : `${accentColor}20`,
      accentDark: effectiveDarkMode ? `${accentColor}` : `${accentColor}dd`,
      accentContrast: effectiveDarkMode ? '#ffffff' : '#ffffff',
      
      // Shadows
      shadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
      deepShadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.2)',
    };
  
    // Base styles with Middle Eastern aesthetics
    const baseStyles = {
      // Main container with parchment-like texture
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
        backgroundImage: effectiveDarkMode 
          ? 'none' 
          : 'repeating-linear-gradient(45deg, rgba(0,0,0,0.01) 0px, rgba(0,0,0,0.01) 2px, transparent 2px, transparent 4px)',
      },
      
      // Ornamental header with Middle Eastern arches
      header: {
        position: 'relative',
        padding: '0',
        backgroundColor: colors.accent,
        color: colors.accentContrast,
        borderBottom: `8px solid ${colors.accentDark}`,
        overflow: 'hidden',
      },
      
      // Header content with cultural motifs
      headerInner: {
        position: 'relative',
        padding: '2.5rem 3rem',
        display: 'flex',
        zIndex: 2,
      },
      
      // Ornamental patterns
      headerPattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.12,
        backgroundSize: '20px 20px',
        backgroundImage: `repeating-linear-gradient(0deg, ${colors.accentContrast}, ${colors.accentContrast} 1px, transparent 1px, transparent 20px),
                          repeating-linear-gradient(90deg, ${colors.accentContrast}, ${colors.accentContrast} 1px, transparent 1px, transparent 20px)`,
        zIndex: 1,
      },
      
      // Left section for name and title
      headerLeft: {
        flex: '1',
        paddingRight: '2rem',
      },
      
      // Right section for profile image
      headerRight: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
      
      // Name styling with ornamental border
      name: {
        fontSize: '2.8rem',
        fontWeight: 700,
        margin: '0 0 0.6rem 0',
        color: colors.accentContrast,
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '2px' : '0',
        position: 'relative',
        paddingBottom: '0.8rem',
        borderBottom: `1px solid ${colors.accentContrast}30`,
      },
      
      // Professional title with ornamental styling
      title: {
        fontSize: '1.3rem',
        fontWeight: 400,
        margin: '0.2rem 0 1.5rem 0',
        color: colors.accentContrast,
        opacity: 0.9,
        position: 'relative',
      },
      
      // Contact information with distinctive styling
      contactContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '0.8rem',
        marginTop: '1.5rem',
      },
      
      contactItem: {
        display: 'flex',
        alignItems: 'center',
        color: colors.accentContrast,
        fontSize: '0.95rem',
        padding: '0.4rem 0',
        transition: 'transform 0.3s ease',
      },
      
      contactIcon: {
        marginRight: '0.7rem',
        fontSize: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.4rem',
        height: '1.4rem',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
      },
      
      // Profile image with ornamental border
      profileContainer: {
        position: 'relative',
        width: '140px',
        height: '140px',
        padding: '10px',
        borderRadius: '50%',
      },
      
      profileContainerInner: {
        position: 'relative',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: `3px solid ${colors.accentContrast}`,
        boxShadow: `0 0 0 3px ${colors.accentDark}`,
      },
      
      profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '50%',
      },
      
      // Main content layout with two columns
      mainContent: {
        display: 'flex',
        padding: '2.5rem',
        backgroundColor: colors.background,
        gap: '2.5rem',
      },
      
      // Left column (main content) with ornamental borders
      leftColumn: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
      },
      
      // Right column (sidebar) with ornamental background
      rightColumn: {
        width: '220px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        position: 'relative',
      },
      
      // Section styling with ornamental headers
      section: {
        position: 'relative',
      },
      
      sectionTitle: {
        fontSize: '1.4rem',
        fontWeight: 700,
        color: colors.accent,
        margin: '0 0 1.5rem 0',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1.5px' : '0',
        position: 'relative',
        paddingBottom: '0.6rem',
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${colors.divider}`,
      },
      
      sectionTitleIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.8rem',
        height: '1.8rem',
        backgroundColor: colors.accent,
        borderRadius: '50%',
        color: colors.accentContrast,
        marginRight: '0.7rem',
        fontSize: '0.9rem',
      },
      
      // Summary section with decorative border
      summary: {
        backgroundColor: colors.cardBg,
        padding: '1.5rem',
        borderRadius: '8px',
        fontSize: '1rem',
        lineHeight: '1.6',
        color: colors.text,
        position: 'relative',
        boxShadow: `0 2px 6px ${colors.shadow}`,
        borderLeft: `4px solid ${colors.accent}`,
      },
      
      // Experience items with decorative styling
      cardsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
      },
      
      card: {
        backgroundColor: colors.cardBg,
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: `0 2px 6px ${colors.shadow}`,
        border: `1px solid ${colors.cardBorder}`,
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      },
      
      cardWithAccent: {
        borderTop: `3px solid ${colors.accent}`,
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
        fontSize: '1.15rem',
        fontWeight: 700,
        color: colors.text,
        margin: 0,
      },
      
      cardDate: {
        fontSize: '0.85rem',
        color: colors.textSecondary,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
      },
      
      cardDateIcon: {
        fontSize: '0.9rem',
        opacity: 0.8,
      },
      
      cardCompany: {
        fontSize: '1rem',
        fontWeight: 600,
        color: colors.accent,
        margin: '0 0 0.4rem 0',
      },
      
      cardLocation: {
        fontSize: '0.9rem',
        color: colors.textMuted,
        margin: '0 0 0.8rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
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
      
      // Sidebar section styling
      sidebarSection: {
        position: 'relative',
        backgroundColor: colors.cardBg,
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: `0 2px 6px ${colors.shadow}`,
        border: `1px solid ${colors.cardBorder}`,
      },
      
      sidebarTitle: {
        fontSize: '1.2rem',
        fontWeight: 700,
        color: colors.accent,
        margin: '0 0 1.2rem 0',
        paddingBottom: '0.6rem',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : '0',
        borderBottom: `1px solid ${colors.divider}`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      },
      
      sidebarTitleIcon: {
        fontSize: '1rem',
        color: colors.accent,
      },
      
      // Personal details styling
      detailsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
      },
      
      detailItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.7rem',
        fontSize: '0.9rem',
        padding: '0.3rem 0',
        borderBottom: `1px dashed ${colors.divider}`,
        paddingBottom: '0.6rem',
      },
      
      detailIcon: {
        fontSize: '0.9rem',
        color: colors.accent,
        marginTop: '0.2rem',
      },
      
      detailContent: {
        flex: 1,
        color: colors.text,
      },
      
      detailLabel: {
        display: 'block',
        fontWeight: 600,
        marginBottom: '0.2rem',
        color: colors.textSecondary,
      },
      
      // Skills styling with ornamental indicators
      skillsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
      },
      
      skillItem: {
        position: 'relative',
        marginBottom: '0.5rem',
      },
      
      skillName: {
        fontSize: '0.95rem',
        fontWeight: 600,
        color: colors.text,
        marginBottom: '0.4rem',
        display: 'flex',
        justifyContent: 'space-between',
      },
      
      skillLevel: {
        display: 'flex',
        gap: '0.15rem',
      },
      
      skillDot: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: colors.divider,
        transition: 'background-color 0.3s ease',
      },
      
      skillDotFilled: {
        backgroundColor: colors.accent,
      },
      
      // Languages styling
      languagesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
      },
      
      languageItem: {
        marginBottom: '0.5rem',
      },
      
      languageName: {
        fontSize: '0.95rem',
        fontWeight: 600,
        color: colors.text,
        marginBottom: '0.3rem',
      },
      
      languageBar: {
        height: '6px',
        backgroundColor: colors.divider,
        borderRadius: '3px',
        overflow: 'hidden',
      },
      
      languageProgress: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: '3px',
      },
      
      // Hobbies styling
      hobbiesList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.6rem',
      },
      
      hobbyItem: {
        fontSize: '0.9rem',
        color: colors.text,
        backgroundColor: colors.background,
        padding: '0.4rem 0.8rem',
        borderRadius: '4px',
        border: `1px solid ${colors.accent}50`,
        position: 'relative',
        transition: 'all 0.3s ease',
      },
      
      // Decorative elements for the template
      decorativeArc: {
        position: 'absolute',
        width: '80px',
        height: '40px',
        border: `2px solid ${colors.accent}40`,
        borderTop: 'none',
        borderRadius: '0 0 40px 40px',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0.5,
      },
      
      // Ornamental corner
      ornamentalCorner: {
        position: 'absolute',
        width: '40px',
        height: '40px',
        border: `2px solid ${colors.accent}40`,
        borderTop: 'none',
        borderLeft: 'none',
        bottom: '5px',
        right: '5px',
        opacity: 0.7,
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
        backgroundImage: 'none',
      };
      
      baseStyles.card = {
        ...baseStyles.card,
        boxShadow: 'none',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      };
      
      baseStyles.sidebarSection = {
        ...baseStyles.sidebarSection,
        boxShadow: 'none',
      };
      
      baseStyles.section = {
        ...baseStyles.section,
        breakInside: 'avoid-page',
        pageBreakInside: 'avoid-page',
      };
      
      baseStyles.summary = {
        ...baseStyles.summary,
        boxShadow: 'none',
      };
      
      // PDF-specific print properties
      baseStyles.container.WebkitPrintColorAdjust = 'exact';
      baseStyles.container.printColorAdjust = 'exact';
    }
    
    return baseStyles;
  };
  
  export default getBaghdadStyles;