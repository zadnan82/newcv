/**
 * Styling for the Boston template
 * Sophisticated, classic design with subtle accents and generous whitespace
 * Fixed to properly apply custom settings
 */
export const getBostonStyles = (darkMode, settings) => {
  const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;

  const colors = {
    background: darkMode ? '#1c1c1c' : '#ffffff',
    backgroundAlt: darkMode ? '#2a2a2a' : '#f8f9fa',
    text: darkMode ? '#e0e0e0' : '#333333',
    textMuted: darkMode ? '#aaaaaa' : '#777777',
    headerBg: darkMode ? '#252525' : '#ffffff',
    headerBorder: darkMode ? '#333333' : '#f0f0f0',
    divider: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
  };

  return {
    container: {
      fontFamily,
      lineHeight: lineSpacing,
      backgroundColor: colors.background,
      color: colors.text,
      maxWidth: '850px',
      margin: '0 auto',
      padding: '0',
      boxShadow: darkMode ? 'none' : '0 1px 15px rgba(0, 0, 0, 0.08)',
      position: 'relative',
    },
    header: {
      padding: '50px 60px 40px',
      borderBottom: `1px solid ${colors.headerBorder}`,
      backgroundColor: colors.headerBg,
    },
    headerGrid: {
      display: 'grid',
      gridTemplateColumns: '4fr 1fr',
      gap: '30px',
    },
    headerContent: {},
    profileImageContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    profileImage: {
      width: '120px',
      height: '120px',
      borderRadius: '60px',
      objectFit: 'cover',
      border: `2px solid ${accentColor}`,
    },
    name: {
      fontSize: '36px',
      fontWeight: '300',
      color: darkMode ? '#ffffff' : '#222222',
      margin: '0 0 4px 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '2px' : '0',
    },
    title: {
      fontSize: '18px',
      fontWeight: '300',
      marginBottom: '20px',
      color: accentColor,
    },
    contactGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px 40px',
      marginTop: '20px',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
    },
    contactIcon: {
      marginRight: '8px',
      opacity: '0.7',
    },
    // Content layout
    content: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '40px',
      padding: '50px 60px',
    },
    // Main column
    mainColumn: {},
    section: {
      marginBottom: '35px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '400',
      color: accentColor,
      margin: '0 0 20px 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.5px' : '0',
      position: 'relative',
      paddingBottom: '8px',
      borderBottom: `1px solid ${colors.divider}`,
    },
    summary: {
      fontSize: '15px',
      lineHeight: lineSpacing,
      marginBottom: '15px',
    },
    // Experience items
    expItem: {
      marginBottom: '25px',
      paddingBottom: '25px',
      borderBottom: `1px solid ${colors.divider}`,
    },
    lastItem: {
      borderBottom: 'none',
    },
    expHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
      flexWrap: 'wrap',
    },
    expTitle: {
      fontWeight: '500',
      fontSize: '16px',
      color: darkMode ? '#ffffff' : '#222222',
    },
    expDate: {
      fontSize: '14px',
      color: colors.textMuted,
    },
    expCompany: {
      fontSize: '15px',
      marginBottom: '5px',
      color: accentColor,
    },
    expLocation: {
      fontSize: '14px',
      color: colors.textMuted,
      marginBottom: '10px',
      fontStyle: 'italic',
    },
    expDescription: {
      fontSize: '14px',
      marginTop: '10px',
      whiteSpace: 'pre-line',
      lineHeight: lineSpacing,
    },
    // Sidebar
    sidebar: {},
    // Sidebar section
    sideSection: {
      marginBottom: '30px',
    },
    sideSectionTitle: {
      fontSize: '16px',
      fontWeight: '400',
      color: accentColor,
      margin: '0 0 15px 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1.5px' : '0',
      paddingBottom: '8px',
      borderBottom: `1px solid ${colors.divider}`,
    },
    // Personal details
    personalInfoGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    personalInfoItem: {
      display: 'flex',
      fontSize: '14px',
      alignItems: 'flex-start',
      lineHeight: lineSpacing,
    },
    personalInfoIcon: {
      marginRight: '10px',
      opacity: '0.6',
    },
    // Skills
    skillsContainer: {
      marginTop: '15px',
    },
    skillItem: {
      marginBottom: '12px',
    },
    skillNameLevel: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
    },
    skillName: {
      fontSize: '14px',
    },
    skillLevel: {
      fontSize: '12px',
      color: colors.textMuted,
    },
    skillBar: {
      height: '4px',
      backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      borderRadius: '2px',
      overflow: 'hidden',
    },
    skillFill: {
      height: '100%',
      backgroundColor: accentColor,
    },
    // Languages
    languageItem: {
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    languageName: {
      fontSize: '14px',
    },
    languageProficiency: {
      fontSize: '14px',
      color: colors.textMuted,
    },
    // Hobbies
    hobbiesList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    hobbyItem: {
      padding: '4px 12px',
      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      borderRadius: '15px',
      fontSize: '13px',
    },
    // References
    referenceText: {
      fontSize: '14px',
      fontStyle: 'italic',
      lineHeight: lineSpacing,
    },
    referenceItem: {
      marginBottom: '15px',
    },
    referenceName: {
      fontWeight: '500',
      fontSize: '14px',
    },
    referencePosition: {
      fontSize: '13px',
      color: colors.textMuted,
      marginBottom: '3px',
    },
    referenceContact: {
      fontSize: '13px',
      lineHeight: lineSpacing,
    },
  };
};

export default getBostonStyles;