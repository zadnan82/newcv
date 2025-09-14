 
/**
 * Styling for the Geneva template - Fixed column widths
 * Classic elegant design with horizontal sections and subtle dividers
 */
export const getGenevaStyles = (darkMode, settings, isPdfMode = false) => {
  const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;

  // Use light mode colors for PDF regardless of darkMode setting
  const effectiveDarkMode = isPdfMode ? false : darkMode;

  const colors = {
    background: effectiveDarkMode ? '#1a1a1a' : '#ffffff',
    backgroundAccent: effectiveDarkMode ? '#2a2a2a' : '#f8f9fa',
    text: effectiveDarkMode ? '#e6e6e6' : '#333333',
    textSecondary: effectiveDarkMode ? '#b0b0b0' : '#666666',
    border: effectiveDarkMode ? '#444444' : '#dee2e6',
    divider: effectiveDarkMode ? '#333333' : '#eaecef',
    shadow: effectiveDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
  };

  return {
    container: {
      fontFamily,
      lineHeight: lineSpacing,
      backgroundColor: colors.background,
      color: colors.text,
      maxWidth: '850px',
      margin: '0 auto',
      padding: '40px',
      boxShadow: isPdfMode ? 'none' : `0 3px 10px ${colors.shadow}`,
    },
    
    // Header section
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '30px',
      borderBottom: `2px solid ${accentColor}`,
      paddingBottom: '25px',
      fontSize: '28px',
      fontWeight: 'bold',
      color: accentColor,
      
    },
    headerLeft: {
      display: 'flex',
      flexDirection: 'column',
      width: '80%', // Explicit width instead of flex
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      width: '20%', // Explicit width instead of flex
    },
    profileImageContainer: {
      marginLeft: '20px',
      textAlign: 'right', // Align image to the right
      width: '100%', // Full width of parent
    },
    profileImage: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `2px solid ${accentColor}`,
    },
    name: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: accentColor,
      margin: '0 0 5px 0',
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : 'normal',
    },
    title: {
      fontSize: '18px',
      fontWeight: '500',
      margin: '0 0 15px 0',
      color: colors.textSecondary,
    },
    
    // Contact information
    contactInfo: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      marginRight: '15px',
      color: colors.textSecondary,
    },
    contactIcon: {
      marginRight: '5px',
      fontSize: '16px',
      color: accentColor,
    },
    
    // Two column layout with explicit widths
    contentLayout: {
      display: 'flex',
      gap: '30px',
    },
    mainColumn: {
      width: '68%', // Explicit width percentage
    },
    sideColumn: {
      width: '28%', // Explicit width percentage
    },
    
    // Section styling
    section: {
      marginBottom: '15px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: accentColor,
      marginBottom: '15px',
      paddingBottom: '8px',
      borderBottom: `1px solid ${colors.divider}`,
      textTransform: headingsUppercase ? 'uppercase' : 'none',
      letterSpacing: headingsUppercase ? '1px' : 'normal',
    },
    
    // Summary section
    summary: {
      fontSize: '15px',
      lineHeight: lineSpacing,
      marginBottom: '10px',
      color: colors.text,
    },
    
    // Timeline styling for experiences, education, etc.
    timeline: {
      position: 'relative',
    },
    
    // Experience items
    expItem: {
      marginBottom: '20px',
      position: 'relative',
      paddingLeft: '20px',
      borderLeft: `2px solid ${colors.divider}`,
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '-5px',
        top: '8px',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: accentColor,
      }
    },
    expHeader: {
      marginBottom: '5px',
    },
    expTitle: {
      fontWeight: 'bold',
      fontSize: '16px',
      color: colors.text,
      marginBottom: '3px',
    },
    expCompanyLine: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '15px',
      marginBottom: '5px',
    },
    expCompany: {
      color: colors.textSecondary,
    },
    expDate: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    expLocation: {
      fontSize: '14px',
      color: colors.textSecondary,
      marginBottom: '5px',
      fontStyle: 'italic',
    },
    expDescription: {
      fontSize: '14px',
      marginTop: '8px',
      whiteSpace: 'pre-line',
      color: colors.text,
    },
    
    // Personal details section (right column)
    detailsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
    },
    detailIcon: {
      marginRight: '8px',
      color: accentColor,
    },
    detailText: {
      color: colors.text,
    },
    
    // Skills section
    skillsGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    skillItem: {
      backgroundColor: colors.backgroundAccent,
      padding: '5px 12px',
      borderRadius: '15px',
      fontSize: '14px',
      border: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minWidth: '100px',
    },
    skillName: {
      fontWeight: '500',
      color: colors.text,
    },
    skillLevel: {
      fontSize: '12px',
      color: colors.textSecondary,
    },
    
    // Languages section
    languagesGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    languageItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.backgroundAccent,
      padding: '8px 12px',
      borderRadius: '5px',
      fontSize: '14px',
    },
    languageName: {
      fontWeight: '500',
      color: colors.text,
    },
    languageProficiency: {
      color: colors.textSecondary,
      fontSize: '13px',
    },
    
    // References section
    referenceItem: {
      padding: '12px',
      backgroundColor: colors.backgroundAccent,
      borderRadius: '5px',
      marginBottom: '10px',
    },
    referenceName: {
      fontWeight: 'bold',
      fontSize: '15px',
      marginBottom: '5px',
      color: colors.text,
    },
    referencePosition: {
      fontSize: '14px',
      color: colors.textSecondary,
      marginBottom: '8px',
    },
    referenceContact: {
      fontSize: '13px',
      display: 'flex',
      gap: '10px',
      color: colors.text,
    },
    referralsText: {
      fontSize: '14px',
      fontStyle: 'italic',
      color: colors.text,
    },
    
    // Hobbies section
    hobbiesText: {
      fontSize: '14px',
      lineHeight: lineSpacing,
      color: colors.text,
    },
    hobbiesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    hobbyItem: {
      backgroundColor: colors.backgroundAccent,
      padding: '5px 12px',
      borderRadius: '15px',
      fontSize: '13px',
      border: `1px solid ${colors.border}`,
      color: colors.text,
    },
    
    // PDF specific adjustments
    ...(isPdfMode && {
      container: {
        boxShadow: 'none',
        maxWidth: '100%',
        padding: '30px',
        backgroundColor: '#ffffff',
        color: '#000000',
      },
      
      header: {
        borderBottom: `2px solid ${accentColor}`,
        paddingBottom: '20px',
        marginBottom: '25px',
      },
      
      // Force visible colors in PDF
      name: {
        color: accentColor,
      },
      title: {
        color: '#555555',
      },
      contactIcon: {
        color: accentColor,
      },
      sectionTitle: {
        color: accentColor,
        pageBreakAfter: 'avoid',
        breakAfter: 'avoid',
      },
      summary: {
        color: '#000000',
      },
      expItem: {
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
        borderLeft: '2px solid #eaecef',
      },
      expTitle: {
        color: '#000000',
      },
      expCompany: {
        color: '#555555',
      },
      expDate: {
        color: '#555555',
      },
      expLocation: {
        color: '#555555',
      },
      expDescription: {
        color: '#000000',
      },
      section: {
        pageBreakInside: 'avoid-page',
        breakInside: 'avoid-page',
      },
      skillName: {
        color: '#000000',
      },
      skillLevel: {
        color: '#555555',
      },
      languageName: {
        color: '#000000',
      },
      languageProficiency: {
        color: '#555555',
      },
      hobbiesText: {
        color: '#000000',
      },
      hobbyItem: {
        backgroundColor: '#f8f9fa',
        color: '#000000',
        border: '1px solid #dee2e6',
      },
      referralsText: {
        color: '#000000',
      },
      referenceName: {
        color: '#000000',
      },
      referencePosition: {
        color: '#555555',
      },
      referenceContact: {
        color: '#000000',
      },
      detailText: {
        color: '#000000',
      },
      detailIcon: {
        color: accentColor,
      },
      // Make backgrounds lighter for PDF
      skillItem: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
      },
      languageItem: {
        backgroundColor: '#f8f9fa',
      },
      referenceItem: {
        backgroundColor: '#f8f9fa',
      },
    }),
  };
};

export default getGenevaStyles;