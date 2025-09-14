import React from 'react';

// Simple HTML-to-DOCX export function
export const exportResumeToDocxAlt = (formData) => {
  // This uses the msSaveBlob approach which works on modern browsers
  // and doesn't require additional libraries
  
  // Create HTML content that matches your resume format
  const htmlContent = generateResumeHtml(formData);
  
  // Create a blob with HTML content
  const blob = new Blob([htmlContent], { type: 'application/msword' });
  
  // Create file name
  const fileName = `${formData.personal_info.full_name || 'Resume'}.doc`;
  
  // Use msSaveBlob for IE/Edge or standard download approach for other browsers
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    // For other browsers
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 100);
  }
};

// Generate HTML that Word can open
const generateResumeHtml = (formData) => {
  // Create base HTML with Word-compatible formatting
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${formData.personal_info.full_name || 'Resume'}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0.5in;
          line-height: 1.5;
        }
        h1 {
          font-size: 24pt;
          color: #000000;
          margin-bottom: 10pt;
        }
        h2 {
          font-size: 14pt;
          color: #4299e1;
          border-bottom: 1pt solid #4299e1;
          padding-bottom: 5pt;
          margin-top: 20pt;
          margin-bottom: 10pt;
        }
        .contact-info {
          font-size: 10pt;
          margin-bottom: 15pt;
        }
        .experience-item {
          margin-bottom: 15pt;
        }
        .exp-header {
          display: flex;
          justify-content: space-between;
        }
        .exp-company {
          font-weight: bold;
        }
        .exp-position {
          font-style: italic;
        }
        .exp-dates {
          color: #666;
          font-size: 9pt;
          margin-bottom: 5pt;
        }
        .skill-list {
          display: flex;
          flex-wrap: wrap;
        }
        .skill-item {
          margin-right: 15pt;
        }
      </style>
    </head>
    <body>
      <!-- Header with name and title -->
      <h1>${formData.personal_info.full_name || 'Full Name'}</h1>
      ${formData.personal_info.title ? `<p>${formData.personal_info.title}</p>` : ''}
      
      <!-- Contact Information -->
      <div class="contact-info">
        ${formData.personal_info.email ? `${formData.personal_info.email} • ` : ''}
        ${formData.personal_info.mobile ? `${formData.personal_info.mobile} • ` : ''}
        ${formData.personal_info.address ? `${formData.personal_info.address}, ` : ''}
        ${formData.personal_info.city ? `${formData.personal_info.city}` : ''}
        <br>
        ${formData.personal_info.linkedin ? `LinkedIn: ${formData.personal_info.linkedin} • ` : ''}
        ${formData.personal_info.website ? `Website: ${formData.personal_info.website}` : ''}
      </div>
      
      <!-- Summary -->
      ${formData.personal_info.summary ? `<p>${formData.personal_info.summary}</p>` : ''}
      
      <!-- Experience Section -->
      ${generateExperienceSection(formData)}
      
      <!-- Education Section -->
      ${generateEducationSection(formData)}
      
      <!-- Skills Section -->
      ${generateSkillsSection(formData)}
      
      <!-- Languages Section -->
      ${generateLanguagesSection(formData)}
      
      <!-- Courses Section -->
      ${generateCoursesSection(formData)}
      
      <!-- Internships Section -->
      ${generateInternshipsSection(formData)}
      
      <!-- Custom Sections -->
      ${generateCustomSections(formData)}
      
      <!-- Hobbies Section -->
      ${generateHobbiesSection(formData)}
      
      <!-- Extracurricular Activities Section -->
      ${generateExtracurricularSection(formData)}
      
      <!-- References Section -->
      ${generateReferencesSection(formData)}
    </body>
    </html>
  `;
};

// Helper function to generate Experience section
const generateExperienceSection = (formData) => {
  if (!formData.experiences || !formData.experiences.some(exp => exp.company)) {
    return '';
  }
  
  return `
    <h2>EXPERIENCE</h2>
    ${formData.experiences
      .filter(exp => exp.company)
      .map(exp => `
        <div class="experience-item">
          <div class="exp-header">
            <span class="exp-company">${exp.company}</span>
            <span class="exp-position">${exp.position || ''}</span>
          </div>
          <div class="exp-dates">
            ${exp.start_date || ''} - ${exp.current ? 'Present' : exp.end_date || ''} | ${exp.location || ''}
          </div>
          ${exp.description ? `<p>${exp.description}</p>` : ''}
        </div>
      `).join('')}
  `;
};

// Helper function to generate Education section
const generateEducationSection = (formData) => {
  if (!formData.education || !formData.education.some(edu => edu.institution)) {
    return '';
  }
  
  return `
    <h2>EDUCATION</h2>
    ${formData.education
      .filter(edu => edu.institution)
      .map(edu => `
        <div class="experience-item">
          <div class="exp-header">
            <span class="exp-company">${edu.institution}</span>
            <span class="exp-position">${edu.degree}${edu.field_of_study ? `, ${edu.field_of_study}` : ''}</span>
          </div>
          <div class="exp-dates">
            ${edu.start_date || ''} - ${edu.current ? 'Present' : edu.end_date || ''} | ${edu.location || ''}
          </div>
          ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
        </div>
      `).join('')}
  `;
};

// Helper function to generate Skills section
const generateSkillsSection = (formData) => {
  if (!formData.skills || !formData.skills.some(skill => skill.name)) {
    return '';
  }
  
  return `
    <h2>SKILLS</h2>
    <div class="skill-list">
      ${formData.skills
        .filter(skill => skill.name)
        .map(skill => `<span class="skill-item">${skill.name} (${skill.level})</span>`)
        .join(' • ')}
    </div>
  `;
};

// Helper function to generate Languages section
const generateLanguagesSection = (formData) => {
  if (!formData.languages || !formData.languages.some(lang => lang.language)) {
    return '';
  }
  
  return `
    <h2>LANGUAGES</h2>
    <div class="skill-list">
      ${formData.languages
        .filter(lang => lang.language)
        .map(lang => `<span class="skill-item">${lang.language} (${lang.proficiency})</span>`)
        .join(' • ')}
    </div>
  `;
};

// Helper function to generate Courses section
const generateCoursesSection = (formData) => {
  if (!formData.courses || !formData.courses.some(course => course.name)) {
    return '';
  }
  
  return `
    <h2>COURSES</h2>
    ${formData.courses
      .filter(course => course.name)
      .map(course => `
        <div class="experience-item">
          <div class="exp-company">
            ${course.name}${course.institution ? ` at ${course.institution}` : ''}
          </div>
          ${course.description ? `<p>${course.description}</p>` : ''}
        </div>
      `).join('')}
  `;
};

// Helper function to generate Internships section
const generateInternshipsSection = (formData) => {
  if (!formData.internships || !formData.internships.some(internship => internship.company)) {
    return '';
  }
  
  return `
    <h2>INTERNSHIPS</h2>
    ${formData.internships
      .filter(internship => internship.company)
      .map(internship => `
        <div class="experience-item">
          <div class="exp-header">
            <span class="exp-company">${internship.company}</span>
            <span class="exp-position">${internship.position || ''}</span>
          </div>
          <div class="exp-dates">
            ${internship.start_date || ''} - ${internship.current ? 'Present' : internship.end_date || ''} | ${internship.location || ''}
          </div>
          ${internship.description ? `<p>${internship.description}</p>` : ''}
        </div>
      `).join('')}
  `;
};

// Helper function to generate Custom Sections
const generateCustomSections = (formData) => {
  if (!formData.custom_sections || !formData.custom_sections.some(section => section.title && section.content)) {
    return '';
  }
  
  return formData.custom_sections
    .filter(section => section.title && section.content)
    .map(section => `
      <h2>${section.title.toUpperCase()}</h2>
      <p>${section.content}</p>
    `).join('');
};

// Helper function to generate Hobbies section
const generateHobbiesSection = (formData) => {
  if (!formData.hobbies || !formData.hobbies.some(hobby => hobby.name)) {
    return '';
  }
  
  return `
    <h2>HOBBIES</h2>
    <div class="skill-list">
      ${formData.hobbies
        .filter(hobby => hobby.name)
        .map(hobby => `<span class="skill-item">${hobby.name}</span>`)
        .join(' • ')}
    </div>
  `;
};

// Helper function to generate Extracurricular Activities section
const generateExtracurricularSection = (formData) => {
  if (!formData.extracurricular_activities || 
      !formData.extracurricular_activities.some(activity => activity.name)) {
    return '';
  }
  
  return `
    <h2>EXTRACURRICULAR ACTIVITIES</h2>
    ${formData.extracurricular_activities
      .filter(activity => activity.name)
      .map(activity => `
        <div class="experience-item">
          <div class="exp-company">${activity.name}</div>
          ${activity.description ? `<p>${activity.description}</p>` : ''}
        </div>
      `).join('')}
  `;
};

// Helper function to generate References section
const generateReferencesSection = (formData) => {
  if (!formData.referrals) {
    return '';
  }
  
  return `
    <h2>REFERENCES</h2>
    ${formData.referrals.providedOnRequest ? 
      `<p><em>References available upon request</em></p>` : 
      (formData.referrals.references && formData.referrals.references.some(ref => ref.name)) ?
        formData.referrals.references
          .filter(ref => ref.name)
          .map(ref => `
            <div class="experience-item">
              <div class="exp-company">${ref.name}</div>
              <div><em>${ref.relation || ''}</em></div>
              <div>${ref.email || ''}${ref.email && ref.phone ? ' | ' : ''}${ref.phone || ''}</div>
            </div>
          `).join('') : ''}
  `;
}; 