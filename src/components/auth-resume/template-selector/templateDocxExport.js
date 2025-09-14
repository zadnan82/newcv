import { 
  Document, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  BorderStyle, 
  WidthType, 
  AlignmentType, 
  HeadingLevel, 
  TableLayoutType,
  Packer
} from 'docx';
import { saveAs } from 'file-saver';

 
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  try {
    const [year, month] = dateStr.split('-').map(num => parseInt(num, 10));
    return `${months[month - 1]} ${year}`;
  } catch (e) {
    return dateStr;
  }
};
 
const getSkillPercentage = (level) => {
  const levels = {
    'Beginner': 20,
    'Elementary': 40,
    'Intermediate': 60,
    'Advanced': 80,
    'Expert': 100,
    'Native': 100,
    'Fluent': 90,
    'Proficient': 80,
    'Conversational': 60,
    'Basic': 30,
  };
  
  return levels[level] || 50;
};

const createSectionHeading = (text, level, accentColor, uppercase = false) => {
  return new Paragraph({
    text: uppercase ? text.toUpperCase() : text,
    heading: level,
    color: accentColor,
    spacing: { after: 200 },
    border: {
      bottom: {
        color: accentColor,
        size: 15,
        space: 1,
        style: BorderStyle.SINGLE
      }
    }
  });
};

const createNoBorders = () => ({
  top: { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE }
});

const createAccentText = (text, options = {}, accentColor) => {
  return new TextRun({
    text,
    color: accentColor,
    ...options
  });
};

const createTimelineItem = (item, accentColor) => {
  const paragraphs = [];
  
  // Title
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: item.position || item.degree || item.name || '',
          bold: true,
          size: 24
        })
      ],
      spacing: { after: 80 }
    })
  );
  
  // Subtitle (company/institution)
  if (item.company || item.institution) {
    paragraphs.push(
      new Paragraph({
        children: [
          createAccentText(
            item.company || item.institution,
            { bold: true, size: 22 },
            accentColor
          )
        ],
        spacing: { after: 80 }
      })
    );
  }
  
  // Location
  if (item.location) {
    paragraphs.push(
      new Paragraph({
        text: item.location,
        spacing: { after: 80 }
      })
    );
  }
  
  // Date range
  if (item.start_date) {
    const dateText = `${formatDate(item.start_date)} — ${item.current ? 'Present' : formatDate(item.end_date)}`;
    paragraphs.push(
      new Paragraph({
        text: dateText,
        spacing: { after: 120 }
      })
    );
  } else if (item.date) {
    paragraphs.push(
      new Paragraph({
        text: formatDate(item.date),
        spacing: { after: 120 }
      })
    );
  }
  
  // Description
  if (item.description) {
    paragraphs.push(
      new Paragraph({
        text: item.description,
        spacing: { after: 200 }
      })
    );
  }
  
  // GPA for education
  if (item.gpa) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `GPA: ${item.gpa}`,
            bold: true
          })
        ],
        spacing: { after: 120 }
      })
    );
  }
  
  // Add spacing
  paragraphs.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  
  return paragraphs;
};

const createSkillsTable = (skills, accentColor, hideSkillLevel) => {
  const rows = skills.map(skill => {
    // Simple skill list if levels are hidden
    if (hideSkillLevel) {
      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(skill.name)],
            borders: createNoBorders()
          })
        ]
      });
    }
    
    // Skills with level bars
    const levelPercentage = getSkillPercentage(skill.level);
    
    return new TableRow({
      children: [
        // Skill name
        new TableCell({
          children: [new Paragraph(skill.name)],
          borders: createNoBorders(),
          width: { size: 50, type: WidthType.PERCENTAGE }
        }),
        // Skill level visualization
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "■".repeat(Math.round(levelPercentage / 10)),
                  color: accentColor
                }),
                new TextRun({
                  text: "□".repeat(10 - Math.round(levelPercentage / 10)),
                  color: "#CCCCCC"
                })
              ]
            })
          ],
          borders: createNoBorders(),
          width: { size: 50, type: WidthType.PERCENTAGE }
        })
      ]
    });
  });
  
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
    layout: TableLayoutType.FIXED
  });
};

const createContactTable = (personalInfo) => {
  const rows = [];
  
  // Helper to add contact row
  const addContactRow = (icon, text) => {
    if (!text) return;
    
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: icon, alignment: AlignmentType.CENTER })],
            width: { size: 10, type: WidthType.PERCENTAGE },
            borders: createNoBorders()
          }),
          new TableCell({
            children: [new Paragraph(text)],
            width: { size: 90, type: WidthType.PERCENTAGE },
            borders: createNoBorders()
          })
        ]
      })
    );
  };
  
  // Add contact details with icons
  addContactRow("✉", personalInfo.email);
  addContactRow("📱", personalInfo.mobile);
  addContactRow("📍", personalInfo.address);
  personalInfo.city && addContactRow("🏙️", `${personalInfo.city}, ${personalInfo.postal_code || ''}`);
  addContactRow("🔗", personalInfo.linkedin);
  addContactRow("🌐", personalInfo.website);
  
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
    layout: TableLayoutType.FIXED
  });
};

const createPersonalDetailsTable = (personalInfo, accentColor) => {
  const rows = [];
  
  // Add personal detail rows
  const addPersonalRow = (label, value) => {
    if (!value) return;
    
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: label,
                    bold: true,
                    color: accentColor
                  })
                ]
              })
            ],
            borders: createNoBorders()
          }),
          new TableCell({
            children: [new Paragraph(value)],
            borders: createNoBorders()
          })
        ]
      })
    );
  };
  
  // Add personal details
  addPersonalRow("Nationality", personalInfo.nationality);
  addPersonalRow("Driving License", personalInfo.driving_license);
  addPersonalRow("Date of Birth", formatDate(personalInfo.date_of_birth));
  addPersonalRow("Place of Birth", personalInfo.place_of_birth);
  
  return rows.length > 0 ? new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
    layout: TableLayoutType.FIXED
  }) : null;
};

const createLanguagesTable = (languages) => {
  const rows = languages.map(lang => {
    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph(lang.language)],
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: createNoBorders()
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: lang.proficiency,
              alignment: AlignmentType.RIGHT
            })
          ],
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: createNoBorders()
        })
      ]
    });
  });
  
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
    layout: TableLayoutType.FIXED
  });
};

const createHobbiesParagraph = (hobbies) => {
  let hobbiesText = "";
  
  if (typeof hobbies === 'string') {
    hobbiesText = hobbies;
  } else {
    hobbiesText = hobbies
      .map(hobby => (typeof hobby === 'string' ? hobby : hobby.name))
      .join(', ');
  }
  
  return new Paragraph({
    text: hobbiesText,
    spacing: { after: 200 }
  });
};

const buildStockholmDocument = (resumeData, customSettings) => {
  const { accentColor, fontFamily, headingsUppercase, hideSkillLevel } = customSettings;
  const elements = [];
  
  // Header with name and title
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.personalInfo.full_name,
          bold: true,
          size: 36,
          color: accentColor
        })
      ],
      spacing: { after: 120 },
      alignment: AlignmentType.CENTER
    })
  );
  
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resumeData.personalInfo.title,
          size: 28,
          color: accentColor
        })
      ],
      spacing: { after: 400 },
      alignment: AlignmentType.CENTER
    })
  );
  
  // Contact information
  elements.push(createContactTable(resumeData.personalInfo));
  elements.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  
  // Professional Summary
  if (resumeData.personalInfo.summary) {
    elements.push(createSectionHeading("Professional Summary", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    elements.push(
      new Paragraph({
        text: resumeData.personalInfo.summary,
        spacing: { after: 400 }
      })
    );
  }
  
  // Experience
  if (resumeData.experiences && resumeData.experiences.length > 0) {
    elements.push(createSectionHeading("Experience", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    resumeData.experiences.forEach(exp => {
      elements.push(...createTimelineItem(exp, accentColor));
    });
  }
  
  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    elements.push(createSectionHeading("Education", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    resumeData.education.forEach(edu => {
      const educationItem = {
        ...edu,
        position: edu.degree + (edu.field_of_study ? ` in ${edu.field_of_study}` : '')
      };
      elements.push(...createTimelineItem(educationItem, accentColor));
    });
  }
  
  // Internships
  if (resumeData.internships && resumeData.internships.length > 0) {
    elements.push(createSectionHeading("Internships", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    resumeData.internships.forEach(internship => {
      elements.push(...createTimelineItem(internship, accentColor));
    });
  }
  
  // Courses
  if (resumeData.courses && resumeData.courses.length > 0) {
    elements.push(createSectionHeading("Courses & Certifications", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    resumeData.courses.forEach(course => {
      elements.push(...createTimelineItem(course, accentColor));
    });
  }
  
  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    elements.push(createSectionHeading("Skills", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    elements.push(createSkillsTable(resumeData.skills, accentColor, hideSkillLevel));
    elements.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }
  
  // Languages
  if (resumeData.languages && resumeData.languages.length > 0) {
    elements.push(createSectionHeading("Languages", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    elements.push(createLanguagesTable(resumeData.languages));
    elements.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }
  
  // Hobbies
  if (resumeData.hobbies && resumeData.hobbies.length > 0) {
    elements.push(createSectionHeading("Hobbies & Interests", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    elements.push(createHobbiesParagraph(resumeData.hobbies));
  }
  
  // Custom sections
  if (resumeData.custom_sections && resumeData.custom_sections.length > 0) {
    resumeData.custom_sections.forEach(section => {
      elements.push(createSectionHeading(section.title || "Custom Section", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
      
      if (section.items && section.items.length > 0) {
        section.items.forEach(item => {
          const customItem = {
            position: item.title,
            company: item.subtitle,
            date: item.date,
            description: item.content
          };
          elements.push(...createTimelineItem(customItem, accentColor));
        });
      } else if (section.content) {
        elements.push(
          new Paragraph({
            text: section.content,
            spacing: { after: 200 }
          })
        );
      }
    });
  }
  
  // Referrals
  if (resumeData.referrals) {
    elements.push(createSectionHeading("References", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    
    if (resumeData.referrals.providedOnRequest) {
      elements.push(
        new Paragraph({
          text: "References available upon request",
          italic: true,
          spacing: { after: 200 }
        })
      );
    } else if (resumeData.referrals.references && resumeData.referrals.references.length > 0) {
      resumeData.referrals.references.forEach(reference => {
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: reference.name,
                bold: true,
                size: 24
              })
            ],
            spacing: { after: 80 }
          })
        );
        
        if (reference.relation) {
          elements.push(
            new Paragraph({
              children: [
                createAccentText(
                  reference.relation,
                  { size: 22 },
                  accentColor
                )
              ],
              spacing: { after: 80 }
            })
          );
        }
        
        if (reference.email || reference.phone) {
          const contactText = [
            reference.email,
            reference.phone
          ].filter(Boolean).join(' • ');
          
          elements.push(
            new Paragraph({
              text: contactText,
              spacing: { after: 200 }
            })
          );
        }
      });
    }
  }
  
  return new Document({
    title: `${resumeData.personalInfo.full_name} - Resume`,
    creator: resumeData.personalInfo.full_name,
    description: `Resume for ${resumeData.personalInfo.full_name}`,
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: {
            font: fontFamily.split(',')[0].trim(),
            size: 24
          },
          paragraph: {
            spacing: {
              line: 1.15 * 240, // 1.15 spacing in twip
            }
          }
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: elements
      }
    ]
  });
};

const buildBerlinDocument = (resumeData, customSettings) => {
  const { accentColor, fontFamily, headingsUppercase, hideSkillLevel, darkMode } = customSettings;
  
  // Sidebar elements (left column)
  const sidebarElements = [];
  
  // Contact information
  sidebarElements.push(createSectionHeading("Contact", HeadingLevel.HEADING_3, accentColor, headingsUppercase));
  sidebarElements.push(createContactTable(resumeData.personalInfo));
  sidebarElements.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  
  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    sidebarElements.push(createSectionHeading("Skills", HeadingLevel.HEADING_3, accentColor, headingsUppercase));
    sidebarElements.push(createSkillsTable(resumeData.skills, accentColor, hideSkillLevel));
    sidebarElements.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }
  
  // Languages
  if (resumeData.languages && resumeData.languages.length > 0) {
    sidebarElements.push(createSectionHeading("Languages", HeadingLevel.HEADING_3, accentColor, headingsUppercase));
    sidebarElements.push(createLanguagesTable(resumeData.languages));
    sidebarElements.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }
  
  // Personal Details
  const personalDetailsTable = createPersonalDetailsTable(resumeData.personalInfo, accentColor);
  if (personalDetailsTable) {
    sidebarElements.push(createSectionHeading("Personal", HeadingLevel.HEADING_3, accentColor, headingsUppercase));
    sidebarElements.push(personalDetailsTable);
    sidebarElements.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }
  
  // Hobbies
  if (resumeData.hobbies && resumeData.hobbies.length > 0) {
    sidebarElements.push(createSectionHeading("Hobbies", HeadingLevel.HEADING_3, accentColor, headingsUppercase));
    sidebarElements.push(createHobbiesParagraph(resumeData.hobbies));
  }
  
  // Main content elements (right column)
  const mainElements = [];
  
  // Professional Summary
  if (resumeData.personalInfo.summary) {
    mainElements.push(createSectionHeading("Profile", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    mainElements.push(
      new Paragraph({
        text: resumeData.personalInfo.summary,
        spacing: { after: 400 }
      })
    );
  }
  
  // Experience
  if (resumeData.experiences && resumeData.experiences.length > 0) {
    mainElements.push(createSectionHeading("Experience", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    resumeData.experiences.forEach(exp => {
      mainElements.push(...createTimelineItem(exp, accentColor));
    });
  }
  
  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    mainElements.push(createSectionHeading("Education", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    resumeData.education.forEach(edu => {
      const educationItem = {
        ...edu,
        position: edu.degree + (edu.field_of_study ? ` in ${edu.field_of_study}` : '')
      };
      mainElements.push(...createTimelineItem(educationItem, accentColor));
    });
  }
  
  // Internships
  if (resumeData.internships && resumeData.internships.length > 0) {
    mainElements.push(createSectionHeading("Internships", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    resumeData.internships.forEach(internship => {
      mainElements.push(...createTimelineItem(internship, accentColor));
    });
  }
  
  // Courses
  if (resumeData.courses && resumeData.courses.length > 0) {
    mainElements.push(createSectionHeading("Courses & Certifications", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    resumeData.courses.forEach(course => {
      mainElements.push(...createTimelineItem(course, accentColor));
    });
  }
  
  // Custom sections
  if (resumeData.custom_sections && resumeData.custom_sections.length > 0) {
    resumeData.custom_sections.forEach(section => {
      mainElements.push(createSectionHeading(section.title || "Custom Section", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
      
      if (section.items && section.items.length > 0) {
        section.items.forEach(item => {
          const customItem = {
            position: item.title,
            company: item.subtitle,
            date: item.date,
            description: item.content
          };
          mainElements.push(...createTimelineItem(customItem, accentColor));
        });
      } else if (section.content) {
        mainElements.push(
          new Paragraph({
            text: section.content,
            spacing: { after: 200 }
          })
        );
      }
    });
  }
  
  // Referrals
  if (resumeData.referrals) {
    mainElements.push(createSectionHeading("References", HeadingLevel.HEADING_2, accentColor, headingsUppercase));
    
    if (resumeData.referrals.providedOnRequest) {
      mainElements.push(
        new Paragraph({
          text: "References available upon request",
          italic: true,
          spacing: { after: 200 }
        })
      );
    } else if (resumeData.referrals.references && resumeData.referrals.references.length > 0) {
      resumeData.referrals.references.forEach(reference => {
        mainElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: reference.name,
                bold: true,
                size: 24
              })
            ],
            spacing: { after: 80 }
          })
        );
        
        if (reference.relation) {
          mainElements.push(
            new Paragraph({
              children: [
                createAccentText(
                  reference.relation,
                  { size: 22 },
                  accentColor
                )
              ],
              spacing: { after: 80 }
            })
          );
        }
        
        if (reference.email || reference.phone) {
          const contactText = [
            reference.email,
            reference.phone
          ].filter(Boolean).join(' • ');
          
          mainElements.push(
            new Paragraph({
              text: contactText,
              spacing: { after: 200 }
            })
          );
        }
      });
    }
  }
  
  return new Document({
    title: `${resumeData.personalInfo.full_name} - Resume`,
    creator: resumeData.personalInfo.full_name,
    description: `Resume for ${resumeData.personalInfo.full_name}`,
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: {
            font: fontFamily.split(',')[0].trim(),
            size: 24
          },
          paragraph: {
            spacing: {
              line: 1.15 * 240, // 1.15 spacing in twip
            }
          }
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: [
          // Header with name and title
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.personalInfo.full_name,
                bold: true,
                size: 36,
                color: accentColor
              })
            ],
            spacing: { after: 120 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.personalInfo.title,
                size: 28,
                color: accentColor
              })
            ],
            spacing: { after: 240 }
          }),
          
          // Two-column layout
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE }
            },
            rows: [
              new TableRow({
                children: [
                  // Sidebar column (30%)
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: darkMode ? "#333333" : "#f5f5f5" },
                    margins: {
                      top: 100,
                      bottom: 100,
                      left: 200,
                      right: 200
                    },
                    children: sidebarElements,
                    borders: createNoBorders()
                  }),
                  
                  // Main content column (70%)
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    margins: {
                      top: 100,
                      bottom: 100,
                      left: 300,
                      right: 200
                    },
                    children: mainElements,
                    borders: createNoBorders()
                  })
                ]
              })
            ]
          })
        ]
      }
    ]
  });
};

/**
 * Main export function to create and save a DOCX document
 * This version is compatible with browser environments
 * @param {object} resumeData - Resume data
 * @param {string} templateId - ID of the selected template
 * @param {object} customSettings - Custom settings for the template
 * @returns {Promise<boolean>} Success status
 */
export const handleExportToDocx = async (resumeData, templateId, customSettings) => {
  try {
    // Create document based on template
    let doc;
    if (templateId === 'berlin') {
      doc = buildBerlinDocument(resumeData, customSettings);
    } else {
      // Default to Stockholm for any other template
      doc = buildStockholmDocument(resumeData, customSettings);
    }
    
    // Generate document as blob and save - this is the key change for browser compatibility
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${resumeData.personalInfo.full_name} - Resume.docx`);
    });
    
    return true;
  } catch (error) {
    console.error('Error generating DOCX:', error);
    return false;
  }
};

export default handleExportToDocx;