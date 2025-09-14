/**
 * Styles for the Assur resume template
 * Inspired by Assyrian aesthetics with bold geometric patterns and stone tablet design
 */

export const getAssurStyles = (darkMode, settings, isPdfMode = false) => {
    // Base colors - more stone-like with deeper accent colors
    const colors = {
      stone: darkMode ? '#2A2A2C' : '#E5E0D5', // Dark or light stone background
      text: darkMode ? '#E0DBCB' : '#333333', // Text color
      accent: settings.accentColor || '#9D2C25', // Default is deep Assyrian red
      border: darkMode ? '#4A4A4D' : '#C5BBA9', // Border color for sections
      headerBg: darkMode ? '#252526' : '#D8D0BE', // Header background
      sidebarBg: darkMode ? '#2F2F31' : '#DED8C9', // Sidebar background
      patternColor: darkMode ? 'rgba(180, 160, 120, 0.07)' : 'rgba(100, 80, 60, 0.05)', // Color for patterns
      sectionBg: darkMode ? 'rgba(45, 45, 48, 0.6)' : 'rgba(235, 230, 220, 0.6)' // Section background
    };
  
    // Apply text transform based on settings
    const headingTextTransform = settings.headingsUppercase ? 'uppercase' : 'none';
  
    return {
      container: {
        fontFamily: settings.fontFamily || '"Trajan Pro", "Palatino Linotype", "Book Antiqua", serif',
        lineHeight: settings.lineSpacing || 1.6,
        color: colors.text,
        backgroundColor: colors.stone,
        padding: '0',
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        boxShadow: darkMode ? '0 0 20px rgba(0, 0, 0, 0.3)' : '0 0 25px rgba(0, 0, 0, 0.15)',
        backgroundImage: `repeating-linear-gradient(0deg, ${colors.patternColor}, ${colors.patternColor} 1px, transparent 1px, transparent 20px), 
                           repeating-linear-gradient(90deg, ${colors.patternColor}, ${colors.patternColor} 1px, transparent 1px, transparent 20px)`,
        borderRadius: '0',
        overflow: 'hidden',
        border: `8px solid ${colors.border}`,
        borderImage: darkMode ? 
          'linear-gradient(45deg, #4A4A4D, #2F2F31, #4A4A4D, #2F2F31) 1' : 
          'linear-gradient(45deg, #C5BBA9, #D8D0BE, #C5BBA9, #D8D0BE) 1',
      },
      header: {
        backgroundColor: colors.headerBg,
        backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.patternColor} 10%, transparent 10.5%, transparent 20%, ${colors.patternColor} 20.5%, ${colors.patternColor} 21%, transparent 21.5%, transparent 30%, ${colors.patternColor} 30.5%, ${colors.patternColor} 31%, transparent 31.5%)`,
        backgroundSize: '40px 40px',
        padding: '30px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        flexWrap: 'wrap',
        borderBottom: `5px solid ${colors.accent}`,
      },
      headerLeft: {
        flex: '1 1 65%',
        paddingRight: '30px',
      },
      headerRight: {
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      },
      profileContainer: {
        width: '110px',
        height: '110px',
        border: `4px solid ${colors.accent}`,
        borderRadius: '0',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: darkMode ? '#303033' : '#F0EBE0',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          border: `1px solid ${colors.border}`,
          margin: '4px',
        }
      },
      profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
      name: {
        fontFamily: '"Trajan Pro", "Times New Roman", serif',
        fontSize: '36px',
        fontWeight: 'bold',
        margin: '0 0 8px 0',
        color: colors.accent,
        position: 'relative',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        borderBottom: `2px solid ${colors.accent}`,
        paddingBottom: '8px',
        display: 'inline-block',
      },
      title: {
        fontSize: '18px',
        marginBottom: '20px',
        letterSpacing: '0.5px',
        fontWeight: '500',
        color: darkMode ? '#C0B8A3' : '#666055',
      },
      contactGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gridGap: '12px',
        marginTop: '15px',
      },
      contactItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        padding: '6px 10px',
        backgroundColor: darkMode ? 'rgba(60, 60, 65, 0.5)' : 'rgba(255, 255, 255, 0.3)',
        borderLeft: `3px solid ${colors.accent}`,
      },
      contactIcon: {
        marginRight: '12px',
        color: colors.accent,
      },
      contentLayout: {
        display: 'flex',
        flexDirection: isPdfMode ? 'column' : 'row',
        flexWrap: 'wrap',
      },
      mainColumn: {
        flex: '1 1 65%',
        padding: '35px',
        order: isPdfMode ? 2 : 1,
        position: 'relative',
      },
      sidebar: {
        flex: '1 1 30%',
        backgroundColor: colors.sidebarBg,
        padding: '35px',
        order: isPdfMode ? 1 : 2,
        borderLeft: `5px solid ${colors.border}`,
        position: 'relative',
        backgroundImage: `linear-gradient(45deg, ${colors.patternColor} 25%, transparent 25%, transparent 75%, ${colors.patternColor} 75%, ${colors.patternColor}), 
                           linear-gradient(45deg, ${colors.patternColor} 25%, transparent 25%, transparent 75%, ${colors.patternColor} 75%, ${colors.patternColor})`,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
      },
      section: {
        marginBottom: '35px',
        position: 'relative',
        paddingBottom: '15px',
      },
      sectionTitle: {
        fontSize: '24px',
        marginBottom: '20px',
        color: colors.accent,
        fontFamily: '"Trajan Pro", "Times New Roman", serif',
        fontWeight: 'bold',
        paddingBottom: '10px',
        position: 'relative',
        textTransform: headingTextTransform,
        letterSpacing: '1.5px',
        borderBottom: `2px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-2px',
          left: '0',
          width: '60px',
          height: '2px',
          backgroundColor: colors.accent,
        }
      },
      sidebarSectionTitle: {
        fontSize: '22px',
        marginBottom: '20px',
        color: colors.accent,
        fontFamily: '"Trajan Pro", "Times New Roman", serif',
        fontWeight: 'bold',
        paddingBottom: '10px',
        position: 'relative',
        textTransform: headingTextTransform,
        letterSpacing: '1.5px',
        borderBottom: `2px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-2px',
          left: '0',
          width: '60px',
          height: '2px',
          backgroundColor: colors.accent,
        }
      },
      expItem: {
        marginBottom: '25px',
        padding: '20px',
        backgroundColor: colors.sectionBg,
        position: 'relative',
        borderLeft: `4px solid ${colors.accent}`,
        boxShadow: darkMode ? '0 2px 5px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundImage: `repeating-linear-gradient(0deg, ${colors.patternColor}, ${colors.patternColor} 1px, transparent 1px, transparent 10px)`,
          pointerEvents: 'none',
          opacity: '0.5',
          zIndex: '-1',
        }
      },
      expHeader: {
        marginBottom: '12px',
        borderBottom: `1px solid ${darkMode ? 'rgba(180, 160, 120, 0.2)' : 'rgba(100, 80, 60, 0.1)'}`,
        paddingBottom: '10px',
      },
      expTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '6px',
        color: darkMode ? '#D6CFBF' : '#4A4030',
      },
      expCompany: {
        fontSize: '16px',
        marginBottom: '6px',
        fontWeight: '600',
      },
      expDate: {
        fontSize: '14px',
        color: darkMode ? '#B0A68A' : '#7B6F5A',
        marginBottom: '5px',
        fontStyle: 'italic',
      },
      expLocation: {
        fontSize: '14px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        color: darkMode ? '#ADA58B' : '#8A7D63',
      },
      expDescription: {
        fontSize: '14px',
        lineHeight: '1.6',
        whiteSpace: 'pre-line',
        marginTop: '10px',
      },
      summary: {
        fontSize: '16px',
        lineHeight: '1.8',
        marginBottom: '20px',
        textAlign: 'justify',
        padding: '15px 20px',
        backgroundColor: colors.sectionBg,
        position: 'relative',
        borderLeft: `4px solid ${colors.accent}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundImage: `repeating-linear-gradient(0deg, ${colors.patternColor}, ${colors.patternColor} 1px, transparent 1px, transparent 10px)`,
          pointerEvents: 'none',
          opacity: '0.5',
          zIndex: '-1',
        }
      },
      personalDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      },
      personalDetailItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        padding: '8px 12px',
        backgroundColor: darkMode ? 'rgba(60, 60, 65, 0.3)' : 'rgba(255, 255, 255, 0.3)',
        borderLeft: `3px solid ${colors.accent}`,
      },
      skillsGrid: {
        display: 'grid',
        gridGap: '16px',
      },
      skillItem: {
        marginBottom: '12px',
        position: 'relative',
      },
      skillName: {
        fontSize: '15px',
        marginBottom: '8px',
        fontWeight: '600',
      },
      skillLevel: {
        height: '8px',
        backgroundColor: darkMode ? 'rgba(60, 60, 65, 0.5)' : 'rgba(200, 180, 140, 0.3)',
        position: 'relative',
        overflow: 'hidden',
      },
      skillLevelBar: {
        height: '100%',
        backgroundColor: colors.accent,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255, 255, 255, 0.1) 5px, rgba(255, 255, 255, 0.1) 10px)`,
        }
      },
      languagesGrid: {
        display: 'grid',
        gridGap: '14px',
      },
      languageItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: darkMode ? 'rgba(60, 60, 65, 0.3)' : 'rgba(255, 255, 255, 0.3)',
        borderLeft: `3px solid ${colors.accent}`,
      },
      languageName: {
        fontSize: '15px',
        fontWeight: '600',
      },
      languageProficiency: {
        fontSize: '13px',
        color: darkMode ? '#ADA58B' : '#8A7D63',
        fontStyle: 'italic',
      },
      hobbiesContainer: {
        marginTop: '15px',
      },
      hobbiesGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
      },
      hobbyItem: {
        fontSize: '14px',
        padding: '6px 12px',
        backgroundColor: darkMode ? 'rgba(60, 60, 65, 0.5)' : 'rgba(255, 255, 255, 0.3)',
        borderLeft: `3px solid ${colors.accent}`,
        display: 'inline-block',
        margin: '0 6px 6px 0',
      },
      hobbiesText: {
        fontSize: '14px',
        lineHeight: '1.6',
        padding: '10px 15px',
        backgroundColor: darkMode ? 'rgba(60, 60, 65, 0.3)' : 'rgba(255, 255, 255, 0.3)',
        borderLeft: `3px solid ${colors.accent}`,
      },
      referralsGrid: {
        display: 'grid',
        gridGap: '15px',
      },
      referralItem: {
        padding: '15px',
        backgroundColor: darkMode ? 'rgba(60, 60, 65, 0.3)' : 'rgba(255, 255, 255, 0.3)',
        borderLeft: `3px solid ${colors.accent}`,
        position: 'relative',
      },
      referralName: {
        fontSize: '15px',
        fontWeight: 'bold',
        marginBottom: '5px',
      },
      referralPosition: {
        fontSize: '14px',
        fontStyle: 'italic',
        marginBottom: '8px',
        color: darkMode ? '#ADA58B' : '#8A7D63',
      },
      referralContact: {
        fontSize: '13px',
      },
      referralsText: {
        fontSize: '14px',
        fontStyle: 'italic',
        padding: '10px',
      },
      sectionIcon: {
        display: 'inline-block',
        width: '24px',
        height: '24px',
        marginRight: '10px',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    };
  };
  
  export default getAssurStyles;