/**
 * Styles for the Nineveh resume template
 * Inspired by ancient Mesopotamian aesthetics with parchment styling
 */

export const getNinevehStyles = (darkMode, settings, isPdfMode = false) => {
    // Base colors
    const colors = {
      parchment: darkMode ? '#2C2117' : '#E8DCC9', // Dark or light parchment background
      text: darkMode ? '#E8DCC9' : '#3E2E1E', // Text color
      accent: settings.accentColor || '#8B4513', // Default is earthy brown
      border: darkMode ? '#594D3F' : '#B29D7C', // Border color for sections
      headerBg: darkMode ? '#3E321F' : '#D5C4A1', // Header background
      sidebarBg: darkMode ? '#382D1E' : '#DED2B6', // Sidebar background
    };
  
    // Apply text transform based on settings
    const headingTextTransform = settings.headingsUppercase ? 'uppercase' : 'none';
  
    return {
      container: {
        fontFamily: settings.fontFamily || '"Cinzel", "Times New Roman", serif',
        lineHeight: settings.lineSpacing || 1.7,
        color: colors.text,
        backgroundColor: colors.parchment,
        padding: '30px',
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
        backgroundImage: darkMode ? 
          'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'smallGrid\' width=\'20\' height=\'20\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 20 0 L 0 0 0 20\' fill=\'none\' stroke=\'%23594D3F\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%232C2117\'/%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23smallGrid)\'/%3E%3C/svg%3E")' :
          'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'smallGrid\' width=\'20\' height=\'20\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 20 0 L 0 0 0 20\' fill=\'none\' stroke=\'%23B29D7C\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23E8DCC9\'/%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23smallGrid)\'/%3E%3C/svg%3E")',
        borderRadius: '5px',
        borderLeft: `10px solid ${colors.border}`,
        borderRight: `10px solid ${colors.border}`,
        overflow: 'hidden',
      },
      header: {
        backgroundColor: colors.headerBg,
        borderBottom: `3px solid ${colors.border}`,
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        flexWrap: 'wrap',
      },
      headerLeft: {
        flex: '1 1 65%',
        paddingRight: '20px',
      },
      headerRight: {
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      profileContainer: {
        width: '90px',
        height: '90px',
        border: `3px solid ${colors.accent}`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: darkMode ? '#352A1C' : '#F5EFE0',
      },
      profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
      name: {
        fontFamily: '"Cinzel Decorative", serif',
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '0 0 5px 0',
        color: colors.accent,
        position: 'relative',
        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
      },
      title: {
        fontSize: '18px',
        marginBottom: '15px',
        fontStyle: 'italic',
        letterSpacing: '1px',
      },
      contactGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gridGap: '10px',
        marginTop: '10px',
      },
      contactItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
      },
      contactIcon: {
        marginRight: '10px',
        color: colors.accent,
      },
      contentLayout: {
        display: 'flex',
        flexDirection: isPdfMode ? 'column' : 'row',
        flexWrap: 'wrap',
      },
      mainColumn: {
        flex: '1 1 65%',
        padding: '25px',
        order: isPdfMode ? 2 : 1,
      },
      sidebar: {
        flex: '1 1 30%',
        backgroundColor: colors.sidebarBg,
        padding: '25px',
        order: isPdfMode ? 1 : 2,
        borderLeft: `3px solid ${colors.border}`,
      },
      section: {
        marginBottom: '30px',
        position: 'relative',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '20px',
      },
      sectionTitle: {
        fontSize: '22px',
        marginBottom: '15px',
        color: colors.accent,
        fontFamily: '"Cinzel Decorative", serif',
        fontWeight: 'bold',
        paddingBottom: '8px',
        position: 'relative',
        textTransform: headingTextTransform,
        letterSpacing: '1px',
        borderBottom: `1px solid ${colors.border}`,
      },
      sidebarSectionTitle: {
        fontSize: '20px',
        marginBottom: '15px',
        color: colors.accent,
        fontFamily: '"Cinzel Decorative", serif',
        fontWeight: 'bold',
        paddingBottom: '8px',
        position: 'relative',
        textTransform: headingTextTransform,
        letterSpacing: '1px',
        borderBottom: `1px solid ${colors.border}`,
      },
      expItem: {
        marginBottom: '20px',
        padding: '15px',
        background: darkMode ? 'rgba(43, 33, 23, 0.3)' : 'rgba(255, 255, 255, 0.1)',
        borderRadius: '5px',
        borderLeft: `3px solid ${colors.accent}`,
        position: 'relative',
      },
      expHeader: {
        marginBottom: '8px',
      },
      expTitle: {
        fontSize: '17px',
        fontWeight: 'bold',
        marginBottom: '4px',
      },
      expCompany: {
        fontStyle: 'italic',
        fontSize: '16px',
        marginBottom: '4px',
      },
      expDate: {
        fontSize: '14px',
        color: darkMode ? '#B9AD9A' : '#7D6B4E',
        marginBottom: '5px',
      },
      expLocation: {
        fontSize: '14px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
      },
      expDescription: {
        fontSize: '14px',
        lineHeight: '1.6',
        whiteSpace: 'pre-line',
      },
      summary: {
        fontSize: '15px',
        lineHeight: '1.8',
        fontStyle: 'italic',
        marginBottom: '10px',
        textAlign: 'justify',
        borderLeft: `3px solid ${colors.accent}`,
        padding: '10px 0 10px 15px',
        background: darkMode ? 'rgba(43, 33, 23, 0.3)' : 'rgba(255, 255, 255, 0.1)',
        borderRadius: '5px',
      },
      summaryContainer: {
        marginTop: '15px',
      },
      summaryText: {
        fontSize: '15px',
        lineHeight: '1.7',
      },
      personalDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      },
      personalDetailItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
      },
      skillsGrid: {
        display: 'grid',
        gridGap: '12px',
      },
      skillItem: {
        marginBottom: '5px',
      },
      skillName: {
        fontSize: '15px',
        marginBottom: '4px',
      },
      skillLevel: {
        height: '6px',
        backgroundColor: darkMode ? '#3D3224' : '#D9CAB3',
        borderRadius: '3px',
        overflow: 'hidden',
      },
      skillLevelBar: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: '3px',
      },
      languagesGrid: {
        display: 'grid',
        gridGap: '10px',
      },
      languageItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 0',
      },
      languageName: {
        fontSize: '15px',
      },
      languageProficiency: {
        fontSize: '13px',
        color: darkMode ? '#B9AD9A' : '#7D6B4E',
        fontStyle: 'italic',
      },
      hobbiesContainer: {
        marginTop: '10px',
      },
      hobbiesGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
      },
      hobbyItem: {
        fontSize: '14px',
        padding: '5px 12px',
        borderRadius: '15px',
        backgroundColor: darkMode ? '#3D3224' : '#D9CAB3',
        display: 'inline-block',
        marginRight: '5px',
        marginBottom: '5px',
      },
      hobbiesText: {
        fontSize: '14px',
        lineHeight: '1.6',
      },
      referralsGrid: {
        display: 'grid',
        gridGap: '15px',
      },
      referralItem: {
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: darkMode ? 'rgba(43, 33, 23, 0.3)' : 'rgba(255, 255, 255, 0.1)',
      },
      referralName: {
        fontSize: '15px',
        fontWeight: 'bold',
        marginBottom: '4px',
      },
      referralPosition: {
        fontSize: '14px',
        fontStyle: 'italic',
        marginBottom: '5px',
      },
      referralContact: {
        fontSize: '13px',
      },
      referralsText: {
        fontSize: '14px',
        fontStyle: 'italic',
      }
    };
  };
  
  export default getNinevehStyles;