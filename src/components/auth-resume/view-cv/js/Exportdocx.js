import React from 'react';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, AlignmentType, HeadingLevel, ImageRun } from 'docx';
import { saveAs } from 'file-saver';

// Function to export resume to DOCX
export const exportToDocx = async (formData) => {
  try {
    // Create a new Document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: generateDocumentContent(formData)
      }]
    });

    // Create a blob from the document
    const blob = await Packer.toBlob(doc);
    
    // Save the blob as a file
    saveAs(blob, `${formData.personal_info.full_name || 'Resume'}.docx`);
    alert('File saved!!');
    return true; // Explicitly return true on success
  } catch (error) {
    console.error('Error generating DOCX:', error);
    alert('Failed to generate DOCX file. Please try again.');
    return false; // Explicitly return false on failure
  }
};

// Generate all document content based on form data
const generateDocumentContent = (formData) => {
  const contentElements = [];

  // Add header with name and title
  contentElements.push(
    new Paragraph({
      text: formData.personal_info.full_name || 'Full Name',
      heading: HeadingLevel.HEADING_1,
      spacing: {
        after: 120
      }
    })
  );

  if (formData.personal_info.title) {
    contentElements.push(
      new Paragraph({
        text: formData.personal_info.title,
        spacing: {
          after: 200
        }
      })
    );
  }

  // Add contact information
  const contactInfo = [];
  
  if (formData.personal_info.email) contactInfo.push(formData.personal_info.email);
  if (formData.personal_info.mobile) contactInfo.push(formData.personal_info.mobile);
  if (formData.personal_info.address) contactInfo.push(formData.personal_info.address);
  if (formData.personal_info.city) contactInfo.push(formData.personal_info.city);
  
  if (contactInfo.length > 0) {
    contentElements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactInfo.join(' • '),
            size: 20
          })
        ],
        spacing: {
          after: 200
        }
      })
    );
  }

  // Add online presence
  const onlineInfo = [];
  
  if (formData.personal_info.linkedin) onlineInfo.push(`LinkedIn: ${formData.personal_info.linkedin}`);
  if (formData.personal_info.website) onlineInfo.push(`Website: ${formData.personal_info.website}`);
  
  if (onlineInfo.length > 0) {
    contentElements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: onlineInfo.join(' • '),
            size: 20
          })
        ],
        spacing: {
          after: 200
        }
      })
    );
  }

  // Add personal details
  const personalDetails = [];
  
  if (formData.personal_info.nationality) personalDetails.push(`Nationality: ${formData.personal_info.nationality}`);
  if (formData.personal_info.driving_license) personalDetails.push(`Driving License: ${formData.personal_info.driving_license}`);
  if (formData.personal_info.date_of_birth) personalDetails.push(`Date of Birth: ${formData.personal_info.date_of_birth}`);
  if (formData.personal_info.place_of_birth) personalDetails.push(`Place of Birth: ${formData.personal_info.place_of_birth}`);
  
  if (personalDetails.length > 0) {
    contentElements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalDetails.join(' • '),
            size: 20
          })
        ],
        spacing: {
          after: 300
        }
      })
    );
  }

  // Add summary if available
  if (formData.personal_info.summary) {
    contentElements.push(
      new Paragraph({
        text: formData.personal_info.summary,
        spacing: {
          after: 400
        }
      })
    );
  }

  // Add experience section
  if (formData.experiences && formData.experiences.some(exp => exp.company)) {
    contentElements.push(
      new Paragraph({
        text: 'EXPERIENCE',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 200
        },
        border: {
          bottom: {
            color: "4299e1",
            style: BorderStyle.SINGLE,
            size: 1
          }
        }
      })
    );

    formData.experiences
      .filter(exp => exp.company)
      .forEach(exp => {
        // Company and position
        contentElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.company,
                bold: true
              }),
              new TextRun({
                text: `    ${exp.position || ''}`,
                italics: true
              })
            ],
            spacing: {
              after: 100
            }
          })
        );

        // Date and location
        contentElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.start_date || ''} - ${exp.current ? 'Present' : exp.end_date || ''}`,
                size: 20
              }),
              new TextRun({
                text: `    ${exp.location || ''}`,
                size: 20
              })
            ],
            spacing: {
              after: 100
            }
          })
        );

        // Description
        if (exp.description) {
          contentElements.push(
            new Paragraph({
              text: exp.description,
              spacing: {
                after: 200
              }
            })
          );
        }
      });
  }

  // Add education section
  if (formData.educations && formData.educations.some(edu => edu.institution)) {
    contentElements.push(
      new Paragraph({
        text: 'EDUCATION',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 200
        },
        border: {
          bottom: {
            color: "4299e1",
            style: BorderStyle.SINGLE,
            size: 1
          }
        }
      })
    );

    formData.educations
      .filter(edu => edu.institution)
      .forEach(edu => {
        // Institution and degree
        contentElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.institution,
                bold: true
              }),
              new TextRun({
                text: `    ${edu.degree}${edu.field_of_study ? `, ${edu.field_of_study}` : ''}`,
                italics: true
              })
            ],
            spacing: {
              after: 100
            }
          })
        );

        // Date and location
        contentElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.start_date || ''} - ${edu.current ? 'Present' : edu.end_date || ''}`,
                size: 20
              }),
              new TextRun({
                text: `    ${edu.location || ''}`,
                size: 20
              })
            ],
            spacing: {
              after: 100
            }
          })
        );

        // GPA
        if (edu.gpa) {
          contentElements.push(
            new Paragraph({
              text: `GPA: ${edu.gpa}`,
              spacing: {
                after: 200
              }
            })
          );
        }
      });
  }

  // Add skills section
  if (formData.skills && formData.skills.some(skill => skill.name)) {
    contentElements.push(
      new Paragraph({
        text: 'SKILLS',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 200
        },
        border: {
          bottom: {
            color: "4299e1",
            style: BorderStyle.SINGLE,
            size: 1
          }
        }
      })
    );

    const skillsText = formData.skills
      .filter(skill => skill.name)
      .map(skill => `${skill.name} (${skill.level})`)
      .join(' • ');

    contentElements.push(
      new Paragraph({
        text: skillsText,
        spacing: {
          after: 300
        }
      })
    );
  }

  // Add languages section
  if (formData.languages && formData.languages.some(lang => lang.name)) {
    contentElements.push(
      new Paragraph({
        text: 'LANGUAGES',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 200
        },
        border: {
          bottom: {
            color: "4299e1",
            style: BorderStyle.SINGLE,
            size: 1
          }
        }
      })
    );

    const languagesText = formData.languages
      .filter(lang => lang.name)
      .map(lang => `${lang.name} (${lang.proficiency})`)
      .join(' • ');

    contentElements.push(
      new Paragraph({
        text: languagesText,
        spacing: {
          after: 300
        }
      })
    );
  }

  // Add courses section
  if (formData.courses && formData.courses.some(course => course.name)) {
    contentElements.push(
      new Paragraph({
        text: 'COURSES',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 200
        },
        border: {
          bottom: {
            color: "4299e1",
            style: BorderStyle.SINGLE,
            size: 1
          }
        }
      })
    );

    formData.courses
      .filter(course => course.name)
      .forEach(course => {
        contentElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: course.name,
                bold: true
              }),
              new TextRun({
                text: course.institution ? ` at ${course.institution}` : '',
              })
            ],
            spacing: {
              after: 100
            }
          })
        );

        if (course.description) {
          contentElements.push(
            new Paragraph({
              text: course.description,
              spacing: {
                after: 200
              }
            })
          );
        }
      });
  }

  // Add internships section
  if (formData.internships && formData.internships.some(internship => internship.company)) {
    contentElements.push(
      new Paragraph({
        text: 'INTERNSHIPS',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 200
        },
        border: {
          bottom: {
            color: "4299e1",
            style: BorderStyle.SINGLE,
            size: 1
          }
        }
      })
    );

    formData.internships
      .filter(internship => internship.company)
      .forEach(internship => {
        // Company and position
        contentElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: internship.company,
                bold: true
              }),
              new TextRun({
                text: `    ${internship.position || ''}`,
                italics: true
              })
            ],
            spacing: {
              after: 100
            }
          })
        );

        // Date and location
        contentElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${internship.start_date || ''} - ${internship.current ? 'Present' : internship.end_date || ''}`,
                size: 20
              }),
              new TextRun({
                text: `    ${internship.location || ''}`,
                size: 20
              })
            ],
            spacing: {
              after: 100
            }
          })
        );

        // Description
        if (internship.description) {
          contentElements.push(
            new Paragraph({
              text: internship.description,
              spacing: {
                after: 200
              }
            })
          );
        }
      });
  }

  // Add custom sections
  if (formData.custom_sections && formData.custom_sections.some(section => section.title && section.content)) {
    formData.custom_sections
      .filter(section => section.title && section.content)
      .forEach(section => {
        contentElements.push(
          new Paragraph({
            text: section.title.toUpperCase(),
            heading: HeadingLevel.HEADING_2,
            spacing: {
              after: 200
            },
            border: {
              bottom: {
                color: "4299e1",
                style: BorderStyle.SINGLE,
                size: 1
              }
            }
          })
        );

        contentElements.push(
          new Paragraph({
            text: section.content,
            spacing: {
              after: 300
            }
          })
        );
      });
  }

  // Add hobbies section
  if (formData.hobbies && formData.hobbies.some(hobby => hobby.name)) {
    contentElements.push(
      new Paragraph({
        text: 'HOBBIES',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 200
        },
        border: {
          bottom: {
            color: "4299e1",
            style: BorderStyle.SINGLE,
            size: 1
          }
        }
      })
    );

    const hobbiesText = formData.hobbies
      .filter(hobby => hobby.name)
      .map(hobby => hobby.name)
      .join(' • ');

    contentElements.push(
      new Paragraph({
        text: hobbiesText,
        spacing: {
          after: 300
        }
      })
    );
  }

  // Add extracurricular activities section
if (formData.extracurriculars && 
  formData.extracurriculars.some(activity => activity.title)) {  // Changed from "name" to "title"
  contentElements.push(
    new Paragraph({
      text: 'EXTRACURRICULAR ACTIVITIES',
      heading: HeadingLevel.HEADING_2,
      spacing: {
        after: 200
      },
      border: {
        bottom: {
          color: "4299e1",
          style: BorderStyle.SINGLE,
          size: 1
        }
      }
    })
  );

  formData.extracurriculars
    .filter(activity => activity.title)  // Changed from "name" to "title"
    .forEach(activity => {
      contentElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: activity.title,  // Changed from "name" to "title"
              bold: true
            })
          ],
          spacing: {
            after: 100
          }
        })
      );

      if (activity.description) {
        contentElements.push(
          new Paragraph({
            text: activity.description,
            spacing: {
              after: 200
            }
          })
        );
      }
    });
}

  // Add references section
  if (formData.referrals) {
    contentElements.push(
      new Paragraph({
        text: 'REFERENCES',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 200
        },
        border: {
          bottom: {
            color: "4299e1",
            style: BorderStyle.SINGLE,
            size: 1
          }
        }
      })
    );

    if (formData.referrals.providedOnRequest) {
      contentElements.push(
        new Paragraph({
          text: 'References available upon request',
          italics: true,
          spacing: {
            after: 200
          }
        })
      );
    } else if (formData.referrals && formData.referrals.some(ref => ref.name)) {
      formData.referrals
        .filter(ref => ref.name)
        .forEach(ref => {
          contentElements.push(
            new Paragraph({
              text: ref.name,
              bold: true,
              spacing: {
                after: 60
              }
            })
          );

          if (ref.relation) {
            contentElements.push(
              new Paragraph({
                text: ref.relation,
                italics: true,
                spacing: {
                  after: 60
                }
              })
            );
          }

          const contactDetails = [];
          if (ref.email) contactDetails.push(ref.email);
          if (ref.phone) contactDetails.push(ref.phone);

          if (contactDetails.length > 0) {
            contentElements.push(
              new Paragraph({
                text: contactDetails.join(' | '),
                spacing: {
                  after: 200
                }
              })
            );
          }
        });
    }
  }

  return contentElements;
};

 