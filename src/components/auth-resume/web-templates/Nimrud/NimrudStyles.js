/**
 * Styling for the Nimrud template
 * Modern two-column resume layout with clean styling
 */
export const getNimrudStyles = (darkMode, settings, isPdfMode = false) => {
    const { accentColor, fontFamily, lineSpacing } = settings;
  
    // Force light mode for PDF
    const effectiveDarkMode = isPdfMode ? false : darkMode;
  
    const colors = {
      background: effectiveDarkMode ? '#1a1a1a' : '#ffffff',
      sidebar: effectiveDarkMode ? '#2d2d2d' : '#f5f5f5',
      text: effectiveDarkMode ? '#e6e6e6' : '#333333',
      textSecondary: effectiveDarkMode ? '#b8b8b8' : '#6c757d',
      border: effectiveDarkMode ? '#3d3d3d' : '#dee2e6',
      sectionTitle: '#2b6cb0', // Blue section titles
    };
  
    // Base styles
    const baseStyles = {
      // Container
      container: {
        display: 'flex',
        flexDirection: 'row',
        fontFamily,
        lineHeight: lineSpacing,
        margin: '0',
        padding: '0',
        backgroundColor: colors.background,
        color: colors.text,
        height: '100%',
        width: '100%',
        maxWidth: '100%',
      },
      
      // Sidebar
      sidebar: {
        width: '23%',
        backgroundColor: colors.sidebar,
        padding: '20px',
        borderRight: `1px solid ${colors.border}`,
      },
      
      // Main content
      mainContent: {
        width: '77%',
        padding: '20px',
      },
      
      // Name and title
      name: {
        fontSize: '32px',
        fontWeight: 'bold',
        lineHeight: '1.1',
        marginBottom: '0',
        color: effectiveDarkMode ? colors.text : '#000000',
      },
      title: {
        fontSize: '16px',
        marginTop: '5px',
        marginBottom: '15px',
        fontWeight: 'normal',
      },
      
      // Contact info
      contactInfo: {
        marginBottom: '15px',
        fontSize: '14px',
      },
      contactItem: {
        marginBottom: '5px',
      },
      
      // Section headers
      sidebarSection: {
        marginTop: '20px',
        marginBottom: '15px',
      },
      sidebarSectionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: effectiveDarkMode ? colors.textSecondary : colors.sectionTitle,
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '5px',
      },
      
      // Main section headings
      section: {
        marginBottom: '25px',
      },
      sectionTitle: {
        fontSize: '24px',
        color: colors.sectionTitle,
        fontWeight: 'bold',
        marginBottom: '15px',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '5px',
      },
      
      // Profile section
      profile: {
        marginBottom: '15px',
        padding: '15px',
        border: `1px solid ${colors.border}`,
        backgroundColor: effectiveDarkMode ? '#252525' : '#ffffff',
      },
      profileText: {
        fontSize: '14px',
        lineHeight: lineSpacing,
      },
      
      // Experience items
      expItem: {
        marginBottom: '15px',
        padding: '15px',
        border: `1px solid ${colors.border}`,
        backgroundColor: effectiveDarkMode ? '#252525' : '#ffffff',
      },
      expHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
      },
      expCompany: {
        fontWeight: 'bold',
        fontSize: '16px',
        color: colors.sectionTitle,
      },
      expDate: {
        fontSize: '14px',
        color: colors.textSecondary,
      },
      expTitle: {
        fontWeight: 'bold',
        fontSize: '16px',
        marginBottom: '8px',
      },
      expDescription: {
        fontSize: '14px',
        lineHeight: lineSpacing,
        marginTop: '5px',
      },
      
      // Skills, languages, hobbies
      skillItem: {
        fontSize: '14px',
        marginBottom: '5px',
      },
      languageItem: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        marginBottom: '5px',
      },
      hobbyItem: {
        fontSize: '14px',
        marginBottom: '5px',
      },
      
      // Pagination
      pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '30px',
      },
      pageButton: {
        padding: '5px 10px',
        cursor: 'pointer',
        fontSize: '14px',
        backgroundColor: effectiveDarkMode ? '#3d3d3d' : '#f0f0f0',
      },
      pageNumber: {
        margin: '0 10px',
        fontSize: '14px',
      },
    };
  
    // PDF-specific adjustments
    if (isPdfMode) {
      baseStyles.container = {
        ...baseStyles.container,
        minHeight: '1100px',
      };
      
      baseStyles.sidebar = {
        ...baseStyles.sidebar,
        height: '100%',
        minHeight: '1100px',
      };
      
      baseStyles.mainContent = {
        ...baseStyles.mainContent,
        height: '100%',
        minHeight: '1100px',
      };
      
      // Enforce colors for PDF
      baseStyles.sectionTitle.color = colors.sectionTitle;
      baseStyles.expCompany.color = colors.sectionTitle;
      baseStyles.sidebarSectionTitle.color = colors.sectionTitle;
      
      // Page break control for PDF
      baseStyles.expItem.pageBreakInside = 'avoid';
      baseStyles.expItem.breakInside = 'avoid';
      baseStyles.section = {
        ...baseStyles.section,
        pageBreakInside: 'auto',
        breakInside: 'auto'
      };
      baseStyles.sectionTitle = {
        ...baseStyles.sectionTitle,
        pageBreakAfter: 'avoid',
        breakAfter: 'avoid'
      };
    }
  
    return baseStyles;
  };
  
  export default getNimrudStyles;