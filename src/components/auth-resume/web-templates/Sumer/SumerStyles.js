/**
 * Styles for the Sumer resume template
 * Inspired by ancient Sumerian clay tablets and cylinder seals
 */

export const getSumerStyles = (darkMode, settings, isPdfMode = false) => {
    // Base colors with earthy clay tones
    const colors = {
      clay: darkMode ? '#231F1B' : '#F3EAD8', // Dark or light clay background
      text: darkMode ? '#F5E9D4' : '#352E27', // Text color
      accent: settings.accentColor || '#B05F36', // Terracotta clay color as default
      border: darkMode ? '#483C31' : '#D4BFA0', // Border color
      headerBg: darkMode ? '#2A261F' : '#E8DBBD', // Header background
      contentBg: darkMode ? '#29241D' : '#EFE5D3', // Content background
      sectionBg: darkMode ? 'rgba(45, 38, 31, 0.6)' : 'rgba(247, 241, 223, 0.6)' // Section background
    };
  
    // Apply text transform based on settings
    const headingTextTransform = settings.headingsUppercase ? 'uppercase' : 'none';
  
    return {
      container: {
        fontFamily: settings.fontFamily || '"EB Garamond", "Book Antiqua", Georgia, serif',
        lineHeight: settings.lineSpacing || 1.6,
        color: colors.text,
        backgroundColor: colors.clay,
        padding: '0',
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        boxShadow: darkMode ? '0 0 15px rgba(0, 0, 0, 0.4)' : '0 0 20px rgba(0, 0, 0, 0.15)',
        backgroundImage: darkMode ? 
          `linear-gradient(rgba(35, 31, 27, 0.97), rgba(35, 31, 27, 0.97)), url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L40 20 M20 0 L20 40' stroke='%23483C31' stroke-width='1' fill='none' stroke-opacity='0.1'/%3E%3C/svg%3E")` : 
          `linear-gradient(rgba(243, 234, 216, 0.96), rgba(243, 234, 216, 0.96)), url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L40 20 M20 0 L20 40' stroke='%23D4BFA0' stroke-width='1' fill='none' stroke-opacity='0.1'/%3E%3C/svg%3E")`,
        borderRadius: '4px',
        overflow: 'hidden',
        border: `8px double ${colors.border}`,
      },
      headerBanner: {
        backgroundColor: colors.headerBg,
        padding: '0',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: darkMode ?
          `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' stroke='%23483C31' stroke-width='1' fill='none' stroke-opacity='0.1'/%3E%3C/svg%3E")` :
          `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' stroke='%23D4BFA0' stroke-width='1' fill='none' stroke-opacity='0.1'/%3E%3C/svg%3E")`,
      },
      headerContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px 30px',
        position: 'relative',
        textAlign: 'center',
      },
      profileArea: {
        margin: '0 auto 20px',
        position: 'relative',
      },
      decorativeBorder: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '10px',
        backgroundImage: darkMode ?
          `url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L10,10 L20,0' fill='%23483C31' /%3E%3C/svg%3E")` :
          `url("data:image/svg+xml,%3Csvg width='20' height='10' viewBox='0 0 20 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L10,10 L20,0' fill='%23D4BFA0' /%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: '20px 10px',
      },
      profileImageOuterRing: {
        width: '130px',
        height: '130px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.border} 30%, transparent 31%), 
                     radial-gradient(circle, ${colors.border} 30%, transparent 31%)`,
        backgroundSize: '30px 30px',
        backgroundPosition: '0 0, 15px 15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto',
      },
      profileImageInnerCircle: {
        width: '110px',
        height: '110px',
        borderRadius: '50%',
        backgroundColor: darkMode ? '#2A261F' : '#E8DBBD',
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        border: `4px solid ${colors.accent}`,
      },
      profileImage: {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        objectFit: 'cover',
      },
      name: {
        fontFamily: '"Cinzel Decorative", "EB Garamond", serif',
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '5px 0',
        color: colors.accent,
        position: 'relative',
        padding: '5px 40px',
        display: 'inline-block',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          width: '30px',
          height: '1px',
          backgroundColor: colors.accent,
        },
        '&::before': {
          left: 0,
        },
        '&::after': {
          right: 0,
        }
      },
      title: {
        fontSize: '18px',
        marginBottom: '15px',
        fontStyle: 'italic',
        letterSpacing: '1px',
        position: 'relative',
        display: 'inline-block',
        padding: '0 20px',
      },
      contactBar: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '15px',
        padding: '15px 0',
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
        marginTop: '15px',
        width: '100%',
        backgroundColor: darkMode ? 'rgba(40, 35, 30, 0.6)' : 'rgba(244, 237, 223, 0.6)',
      },
      contactItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        whiteSpace: 'nowrap',
      },
      contactIcon: {
        marginRight: '8px',
        color: colors.accent,
      },
      contentContainer: {
        display: 'flex',
        flexDirection: isPdfMode ? 'column' : (window.innerWidth < 700 ? 'column' : 'row'),
        width: '100%',
      },
      mainContentArea: {
        flex: '1 1 100%',
        padding: '30px',
        backgroundColor: colors.contentBg,
      },
      sidebarColumns: {
        display: 'flex',
        flexDirection: isPdfMode || window.innerWidth < 700 ? 'row' : 'column',
        flexWrap: 'wrap',
      },
      leftSidebar: {
        flex: '1 1 50%',
        padding: '25px',
        backgroundColor: colors.headerBg,
        borderRight: isPdfMode || window.innerWidth < 700 ? `1px solid ${colors.border}` : 'none',
        borderBottom: isPdfMode || window.innerWidth < 700 ? 'none' : `1px solid ${colors.border}`,
      },
      rightSidebar: {
        flex: '1 1 50%',
        padding: '25px',
        backgroundColor: colors.headerBg,
      },
      sectionHeadingOuter: {
        position: 'relative',
        textAlign: 'center',
        marginBottom: '25px',
        paddingBottom: '15px',
      },
      sectionHeading: {
        fontSize: '22px',
        color: colors.accent,
        fontFamily: '"Cinzel Decorative", "EB Garamond", serif',
        fontWeight: 'bold',
        position: 'relative',
        textTransform: headingTextTransform,
        letterSpacing: '1.5px',
        display: 'inline-block',
        padding: '0 20px',
        margin: '0',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '8px',
          backgroundColor: colors.accent,
          borderRadius: '50%',
        },
        '&::before': {
          left: 0,
        },
        '&::after': {
          right: 0,
        }
      },
      sectionHeadingBorder: {
        position: 'absolute',
        bottom: 0,
        left: '20%',
        right: '20%',
        height: '5px',
        backgroundImage: darkMode ?
          `url("data:image/svg+xml,%3Csvg width='20' height='5' viewBox='0 0 20 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 5 L 5 0 L 10 5 L 15 0 L 20 5' stroke='%23483C31' stroke-width='1' fill='none'/%3E%3C/svg%3E")` :
          `url("data:image/svg+xml,%3Csvg width='20' height='5' viewBox='0 0 20 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 5 L 5 0 L 10 5 L 15 0 L 20 5' stroke='%23D4BFA0' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: '20px 5px',
      },
      sidebarSectionHeadingOuter: {
        position: 'relative',
        textAlign: 'center',
        marginBottom: '20px',
        paddingBottom: '12px',
      },
      sidebarSectionHeading: {
        fontSize: '18px',
        color: colors.accent,
        fontFamily: '"Cinzel Decorative", "EB Garamond", serif',
        fontWeight: 'bold',
        position: 'relative',
        textTransform: headingTextTransform,
        letterSpacing: '1.2px',
        display: 'inline-block',
        padding: '0 15px',
        margin: '0',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '6px',
          height: '6px',
          backgroundColor: colors.accent,
          borderRadius: '50%',
        },
        '&::before': {
          left: 0,
        },
        '&::after': {
          right: 0,
        }
      },
      sidebarSectionHeadingBorder: {
        position: 'absolute',
        bottom: 0,
        left: '15%',
        right: '15%',
        height: '3px',
        backgroundImage: darkMode ?
          `url("data:image/svg+xml,%3Csvg width='14' height='3' viewBox='0 0 14 3' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 3 L 3.5 0 L 7 3 L 10.5 0 L 14 3' stroke='%23483C31' stroke-width='1' fill='none'/%3E%3C/svg%3E")` :
          `url("data:image/svg+xml,%3Csvg width='14' height='3' viewBox='0 0 14 3' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 3 L 3.5 0 L 7 3 L 10.5 0 L 14 3' stroke='%23D4BFA0' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: '14px 3px',
      },
      experienceItem: {
        position: 'relative',
        marginBottom: '25px',
        paddingBottom: '20px',
        borderBottom: `1px dashed ${colors.border}`,
        '&:last-child': {
          borderBottom: 'none',
          paddingBottom: '0',
          marginBottom: '0',
        }
      },
      experienceItemInner: {
        position: 'relative',
        paddingLeft: '15px',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '5px',
          bottom: '5px',
          width: '2px',
          backgroundColor: colors.accent,
          opacity: 0.7,
        }
      },
      expHeader: {
        marginBottom: '10px',
      },
      expTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '4px',
        color: darkMode ? '#F5E9D4' : '#2D2820',
      },
      expCompany: {
        fontSize: '16px',
        fontStyle: 'italic',
        marginBottom: '4px',
      },
      expDateLocation: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '14px',
        color: darkMode ? '#D8C9AA' : '#645C4F',
      },
      expDate: {
        display: 'flex',
        alignItems: 'center',
      },
      expLocation: {
        display: 'flex',
        alignItems: 'center',
      },
      expDescription: {
        fontSize: '14px',
        lineHeight: '1.6',
        whiteSpace: 'pre-line',
        marginTop: '8px',
      },
      summary: {
        fontSize: '15px',
        lineHeight: '1.8',
        marginBottom: '15px',
        position: 'relative',
        padding: '15px 20px',
        backgroundColor: colors.sectionBg,
        borderLeft: `2px solid ${colors.accent}`,
        borderRight: `2px solid ${colors.accent}`,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          left: '10px',
          right: '10px',
          height: '1px',
          backgroundColor: colors.border,
        },
        '&::before': {
          top: '5px',
        },
        '&::after': {
          bottom: '5px',
        }
      },
      skillsGrid: {
        display: 'grid',
        gridGap: '10px',
      },
      skillItem: {
        marginBottom: '10px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        borderBottom: `1px dotted ${colors.border}`,
        paddingBottom: '8px',
        '&:last-child': {
          borderBottom: 'none',
          paddingBottom: '0',
          marginBottom: '0',
        }
      },
      skillNameLevel: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      skillName: {
        fontSize: '15px',
        fontWeight: '600',
      },
      skillLevelText: {
        fontSize: '13px',
        color: darkMode ? '#D8C9AA' : '#645C4F',
        fontStyle: 'italic',
      },
      skillLevel: {
        height: '4px',
        backgroundColor: darkMode ? 'rgba(72, 60, 49, 0.6)' : 'rgba(212, 191, 160, 0.6)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginTop: '2px',
      },
      skillLevelBar: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: '2px',
      },
      languagesGrid: {
        display: 'grid',
        gridGap: '8px',
      },
      languageItem: {
        padding: '6px 0',
        borderBottom: `1px dotted ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '&:last-child': {
          borderBottom: 'none',
        }
      },
      languageName: {
        fontSize: '15px',
        fontWeight: '600',
      },
      languageProficiency: {
        fontSize: '13px',
        color: darkMode ? '#D8C9AA' : '#645C4F',
        fontStyle: 'italic',
      },
      hobbiesGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      },
      hobbyItem: {
        fontSize: '14px',
        padding: '5px 12px',
        backgroundColor: darkMode ? 'rgba(72, 60, 49, 0.5)' : 'rgba(212, 191, 160, 0.3)',
        borderRadius: '15px',
        display: 'inline-block',
        border: `1px solid ${colors.border}`,
      },
      hobbiesText: {
        fontSize: '14px',
        lineHeight: '1.6',
      },
      personalDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      },
      personalDetailItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        padding: '4px 0',
        borderBottom: `1px dotted ${colors.border}`,
        '&:last-child': {
          borderBottom: 'none',
        }
      },
      personalDetailIcon: {
        marginRight: '8px',
        color: colors.accent,
      },
      referralsGrid: {
        display: 'grid',
        gridGap: '12px',
      },
      referralItem: {
        padding: '10px',
        backgroundColor: darkMode ? 'rgba(72, 60, 49, 0.3)' : 'rgba(212, 191, 160, 0.2)',
        border: `1px solid ${colors.border}`,
        borderRadius: '4px',
      },
      referralName: {
        fontSize: '15px',
        fontWeight: 'bold',
        marginBottom: '2px',
      },
      referralPosition: {
        fontSize: '14px',
        fontStyle: 'italic',
        marginBottom: '5px',
        color: darkMode ? '#D8C9AA' : '#645C4F',
      },
      referralContact: {
        fontSize: '13px',
      },
      referralsText: {
        fontSize: '14px',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: '5px',
      },
      dateLocationIcon: {
        display: 'inline-block',
        width: '14px',
        height: '14px',
        marginRight: '5px',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.9,
      }
    };
  };
  
  export default getSumerStyles;