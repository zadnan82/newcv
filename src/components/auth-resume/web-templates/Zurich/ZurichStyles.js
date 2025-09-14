/**
 * Styling for the Zurich template
 * Modern, clean design with minimalist aesthetic and tight spacing
 */
export const getZurichStyles = (darkMode, settings, isPdfMode = false) => {
    const { accentColor, fontFamily, lineSpacing, headingsUppercase } = settings;
  
    // Use light mode colors for PDF regardless of darkMode setting
    const effectiveDarkMode = isPdfMode ? false : darkMode;
  
    const colors = {
      background: effectiveDarkMode ? '#212121' : '#ffffff',
      backgroundSecondary: effectiveDarkMode ? '#2c2c2c' : '#f7f7f7',
      text: effectiveDarkMode ? '#e6e6e6' : '#333333',
      textSecondary: effectiveDarkMode ? '#b0b0b0' : '#666666',
      border: effectiveDarkMode ? '#444444' : '#e0e0e0',
      subtle: effectiveDarkMode ? '#333333' : '#f0f0f0',
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
        boxShadow: isPdfMode ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
      },
      
      // Left sidebar
      sidebar: {
        width: '30%',
        backgroundColor: accentColor,
        color: '#ffffff',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
      },
      
      // Profile image styling
      profileImageContainer: {
        textAlign: 'center',
        marginBottom: '25px',
      },
      profileImage: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        margin: '0 auto',
      },
      name: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '5px',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
      },
      title: {
        fontSize: '16px',
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: '25px',
        opacity: '0.85',
      },
      
      // Sidebar sections
      sidebarSection: {
        marginBottom: '25px',
      },
      sidebarSectionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
        marginBottom: '12px',
        position: 'relative',
        paddingBottom: '8px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
      },
      
      // Contact information
      contactGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      },
      contactItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
      },
      contactIcon: {
        marginRight: '8px',
        fontSize: '16px',
      },
      
      // Personal details
      personalDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      },
      personalDetailItem: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
      },
  
      // Skills section
      skillsGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      },
      skillItem: {
        fontSize: '14px',
        position: 'relative',
      },
      skillLevel: {
        height: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '3px',
        marginTop: '5px',
        overflow: 'hidden',
      },
      skillLevelBar: {
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '3px',
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
        fontSize: '14px',
      },
      languageName: {
        fontWeight: '500',
      },
      languageProficiency: {
        opacity: '0.8',
      },
      
      // Hobbies styling
      hobbiesGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      },
      hobbyItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: '4px 10px',
        borderRadius: '15px',
        fontSize: '13px',
      },
      hobbiesText: {
        fontSize: '14px',
        lineHeight: lineSpacing,
      },
      
      // Main content area (right side)
      mainContent: {
        width: '70%',
        padding: '30px',
        backgroundColor: colors.background,
      },
      
      // Section styling for main content
      section: {
        marginBottom: '25px',
      },
      sectionTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: accentColor,
        marginBottom: '15px',
        paddingBottom: '8px',
        borderBottom: `2px solid ${accentColor}`,
        textTransform: headingsUppercase ? 'uppercase' : 'none',
        letterSpacing: headingsUppercase ? '1px' : 'normal',
      },
      sectionContent: {
        marginLeft: '0',
      },
      
      // Summary section
      summary: {
        fontSize: '15px',
        lineHeight: lineSpacing,
        marginBottom: '10px',
      },
      
      // Experience items styling
      expItem: {
        marginBottom: '20px',
        padding: '15px',
        borderRadius: '5px',
        backgroundColor: colors.backgroundSecondary,
        boxShadow: `0 2px 4px ${effectiveDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.05)'}`,
      },
      expHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        flexWrap: 'wrap',
      },
      expTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
      },
      expDate: {
        fontSize: '14px',
        color: colors.textSecondary,
      },
      expCompany: {
        fontSize: '15px',
        marginBottom: '5px',
      },
      expLocation: {
        fontSize: '14px',
        color: colors.textSecondary,
        marginBottom: '5px',
      },
      expDescription: {
        fontSize: '14px',
        marginTop: '8px',
        whiteSpace: 'pre-line',
      },
      
      // References styles
      referralsText: {
        fontSize: '14px',
        fontStyle: 'italic',
      },
      referralsGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      },
      referralItem: {
        fontSize: '14px',
      },
      referralName: {
        fontWeight: 'bold',
      },
      referralPosition: {
        color: colors.textSecondary,
        marginBottom: '3px',
      },
      referralContact: {
        fontSize: '13px',
      },
      
      // PDF-specific adjustments
      ...(isPdfMode && {
        container: {
          boxShadow: 'none',
          maxWidth: '100%',
          margin: '0',
          backgroundColor: '#ffffff',
          color: '#000000', 
          display: 'flex',
          flexDirection: 'row',
        },
        
        sidebar: {
          width: '30%',
          backgroundColor: accentColor,
          color: '#ffffff',
          padding: '25px 15px',
        },
        
        mainContent: {
          width: '70%',
          padding: '25px 20px',
          backgroundColor: '#ffffff',
        },
        
        expItem: {
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '12px',
          marginBottom: '15px',
        },
        
        sectionTitle: {
          pageBreakAfter: 'avoid',
          breakAfter: 'avoid',
          color: accentColor,
        },
        
        section: {
          pageBreakInside: 'avoid-page',
          breakInside: 'avoid-page',
          marginBottom: '20px',
        },
        
        sidebarSection: {
          marginBottom: '20px',
        },
        
        // Ensure proper printing of background colors
        expDate: {
          color: '#666666',
        },
        expLocation: {
          color: '#666666',
        },
      }),
    };
  };
  
  export default getZurichStyles;