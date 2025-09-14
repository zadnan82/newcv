import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PaginatedCanvasResumeViewer = forwardRef(({ formData, darkMode, width = 816, height = 1056 }, ref) => {

  const resumeData = formData || {
    personal_info: {},
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
    referrals: [],
    custom_sections: [],
    extracurriculars: [],
    hobbies: [],
    courses: [],
    internships: []
  };
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const contentSections = useRef([]);
   
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    redraw: () => drawResume(),
    getTotalPages: () => totalPages,
    getCurrentPage: () => currentPage,
    setCurrentPage: (page) => setCurrentPage(page)
  })); 

  const colors = {
    background: darkMode ? '#2d3748' : '#ffffff',
    text: darkMode ? '#e2e8f0' : '#1a202c',
    headerBg: darkMode ? '#1a202c' : '#f7fafc',
    accent: darkMode ? '#158bd5' : '#4299e1',
    border: darkMode ? '#4a5568' : '#e2e8f0',
    secondaryText: darkMode ? '#a0aec0' : '#718096',
  };
  const margin = {
    left: 80,
    right: 80,
    top: 50,
    bottom: 80
  };
 
  const hasValidData = (section, keyToCheck) => {
    return section && Array.isArray(section) && section.some(item => item && item[keyToCheck]);
  };
   
  const hasValidReferrals = (referrals) => {
    if (!referrals) return false;
    if (referrals.providedOnRequest === true) return true;
    return Array.isArray(referrals) && referrals.some(ref => ref && ref.name);
  };
 
  const drawText = (ctx, text, x, y, maxWidth, lineHeight) => {
    if (!text) return y;
    
    const words = text.split(' ');
    let line = '';
    let newY = y;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, newY);
        line = words[i] + ' ';
        newY += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    ctx.fillText(line, x, newY);
    return newY + lineHeight;
  };
 
  const drawSectionTitle = (ctx, title, x, y) => {
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = colors.accent;
    ctx.fillText(title, x, y);
    
    // Draw underline
    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    ctx.lineTo(width - margin.right, y + 6);
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    return y + 25;
  };
 
  const calculateLayout = () => {
    // Create temporary canvas for measurement
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    
    const contentWidth = width - (margin.left + margin.right);
    
    // Reset content sections
    contentSections.current = [];
    
    let currentY = margin.top;
    let currentPage = 1;

    // Helper function to check page break
    const checkPageBreak = (requiredHeight) => {
      if (currentY + requiredHeight > height - margin.bottom) {
        currentPage++;
        currentY = margin.top;
      }
    };

    // Check which sections have valid data to display
    const hasExperiences = hasValidData(resumeData.experiences, 'company');
    const hasEducations = hasValidData(resumeData.educations, 'institution');
    const hasSkills = hasValidData(resumeData.skills, 'name');
    const hasLanguages = hasValidData(resumeData.languages, 'language');
    const hasCourses = hasValidData(resumeData.courses, 'name');
    const hasInternships = hasValidData(resumeData.internships, 'company');
    const hasExtracurriculars = hasValidData(resumeData.extracurriculars, 'name');
    const hasHobbies = hasValidData(resumeData.hobbies, 'name');
    const hasReferrals = hasValidReferrals(resumeData.referrals);
    
    const hasCustomSections = resumeData.custom_sections && 
                             Array.isArray(resumeData.custom_sections) && 
                             resumeData.custom_sections.some(section => section.title && section.content);

    // Process and add each section
    const processSections = [
      // Header processing
      () => {
        // Make header even taller to accommodate all personal info
        const headerHeight = 220;
        checkPageBreak(headerHeight);
        
        contentSections.current.push({
          type: 'header',
          height: headerHeight,
          page: currentPage,
          startY: currentY
        });
        
        currentY += headerHeight + 10;
      },

      // Summary processing
      () => {
        const summary = resumeData.personal_info?.summary;
        if (summary) {
          ctx.font = '14px Arial';
          const summaryHeight = Math.ceil(ctx.measureText(summary).width / contentWidth) * 20 + 40;
          
          checkPageBreak(summaryHeight);
          
          contentSections.current.push({
            type: 'summary',
            height: summaryHeight,
            page: currentPage,
            startY: currentY
          });
          
          currentY += summaryHeight + 10;
        }
      },

      // Experience processing
      () => {
        if (hasExperiences) {
          const experienceHeight = 30;
          checkPageBreak(experienceHeight);
          
          contentSections.current.push({
            type: 'experience-title',
            height: experienceHeight,
            page: currentPage,
            startY: currentY
          });
          
          currentY += experienceHeight + 5;
          
          resumeData.experiences
            .filter(exp => exp && exp.company)
            .forEach((exp, index) => {
              const itemHeight = 60 + (exp.description ? 
                Math.ceil(ctx.measureText(exp.description).width / contentWidth) * 20 : 0);
              
              checkPageBreak(itemHeight);
              
              contentSections.current.push({
                type: 'experience-item',
                index: index,
                height: itemHeight,
                page: currentPage,
                startY: currentY
              });
              
              currentY += itemHeight + 5;
            });
        }
      },

      // Education processing
      () => {
        if (hasEducations) {
          const educationHeight = 30;
          checkPageBreak(educationHeight);
          
          contentSections.current.push({
            type: 'education-title',
            height: educationHeight,
            page: currentPage,
            startY: currentY
          });
          
          currentY += educationHeight + 15;
          
          resumeData.educations
            .filter(edu => edu && edu.institution)
            .forEach((edu, index) => {
              const itemHeight = 50 + (edu.gpa ? 20 : 0);
              
              checkPageBreak(itemHeight);
              
              contentSections.current.push({
                type: 'education-item',
                index: index,
                height: itemHeight,
                page: currentPage,
                startY: currentY
              });
              
              currentY += itemHeight + 5;
            });
        }
      },

      // Skills processing
      () => {
        if (hasSkills) {
          const skillsHeight = 30;
          checkPageBreak(skillsHeight);
          
          contentSections.current.push({
            type: 'skills-title',
            height: skillsHeight,
            page: currentPage,
            startY: currentY
          });
          
          currentY += skillsHeight + 5;
          
          const skillsText = resumeData.skills
            .filter(skill => skill && skill.name)
            .map(skill => `${skill.name}${skill.level ? ` (${skill.level})` : ''}`)
            .join(' • ');
          
          const skillsContentHeight = Math.ceil(ctx.measureText(skillsText).width / contentWidth) * 20 + 20;
          
          checkPageBreak(skillsContentHeight);
          
          contentSections.current.push({
            type: 'skills-content',
            height: skillsContentHeight,
            page: currentPage,
            startY: currentY
          });
          
          currentY += skillsContentHeight + 20;
        }
      },

      // Languages processing
      () => {
        if (hasLanguages) {
          const languagesHeight = 30;
          checkPageBreak(languagesHeight);
          
          contentSections.current.push({
            type: 'languages-title',
            height: languagesHeight,
            page: currentPage,
            startY: currentY
          });
          
          currentY += languagesHeight + 5;
          
          const languagesText = resumeData.languages
            .filter(lang => lang && lang.language)
            .map(lang => `${lang.language}${lang.proficiency ? ` (${lang.proficiency})` : ''}`)
            .join(' • ');
          
          const languagesContentHeight = Math.ceil(ctx.measureText(languagesText).width / contentWidth) * 20 + 20;
          
          checkPageBreak(languagesContentHeight);
          
          contentSections.current.push({
            type: 'languages-content',
            height: languagesContentHeight,
            page: currentPage,
            startY: currentY
          });
          
          currentY += languagesContentHeight + 20;
        }
      },

      // Courses processing
      () => {
        if (hasCourses) {
          const coursesHeight = 30;
          checkPageBreak(coursesHeight);
          
          contentSections.current.push({
            type: 'courses-title',
            height: coursesHeight,
            page: currentPage,
            startY: currentY
          });
          
          currentY += coursesHeight + 5;
          
          resumeData.courses
            .filter(course => course && course.name)
            .forEach((course, index) => {
              const itemHeight = 20 + (course.description ? 
                Math.ceil(ctx.measureText(course.description).width / contentWidth) * 20 : 0);
              
              checkPageBreak(itemHeight);
              
              contentSections.current.push({
                type: 'course-item',
                index: index,
                height: itemHeight,
                page: currentPage,
                startY: currentY
              });
              
              currentY += itemHeight + 15;
            });
        }
      },

      // Internships processing
      () => {
        if (hasInternships) {
          checkPageBreak(30);
          
          contentSections.current.push({
            type: 'internships-title',
            height: 30,
            page: currentPage,
            startY: currentY
          });
          
          currentY += 35;
          
          resumeData.internships
            .filter(internship => internship && internship.company)
            .forEach((internship, index) => {
              const itemHeight = 60 + (internship.description ? 
                Math.ceil(ctx.measureText(internship.description).width / contentWidth) * 20 : 0);
              
              checkPageBreak(itemHeight);
              
              contentSections.current.push({
                type: 'internship-item',
                index: index,
                height: itemHeight,
                page: currentPage,
                startY: currentY
              });
              
              currentY += itemHeight + 15;
            });
        }
      },
 
      // Custom sections processing
      () => {
        if (hasCustomSections) {
          resumeData.custom_sections
            .filter(section => section && section.title && section.content)
            .forEach((section, sectionIndex) => {
              checkPageBreak(30);
              
              contentSections.current.push({
                type: 'custom-section-title',
                index: sectionIndex,
                height: 30,
                page: currentPage,
                startY: currentY,
                section: section
              });
              
              currentY += 35;
              
              if (section.content) {
                const contentHeight = Math.ceil(ctx.measureText(section.content).width / contentWidth) * 20 + 20;
                
                checkPageBreak(contentHeight);
                
                contentSections.current.push({
                  type: 'custom-section-content',
                  index: sectionIndex,
                  height: contentHeight,
                  page: currentPage,
                  startY: currentY,
                  section: section
                });
                
                currentY += contentHeight + 20;
              }
            });
        }
      },
      
      // Hobbies processing
      () => {
        if (hasHobbies) {
          const hobbiesHeight = 30;
          checkPageBreak(hobbiesHeight);
          
          contentSections.current.push({
            type: 'hobbies-title',
            height: hobbiesHeight,
            page: currentPage,
            startY: currentY
          });
          
          currentY += hobbiesHeight + 5;
          
          const hobbiesText = resumeData.hobbies
            .filter(hobby => hobby && hobby.name)
            .map(hobby => hobby.name)
            .join(' • ');
          
          const hobbiesContentHeight = Math.ceil(ctx.measureText(hobbiesText).width / contentWidth) * 20 + 20;
          
          checkPageBreak(hobbiesContentHeight);
          
          contentSections.current.push({
            type: 'hobbies-content',
            height: hobbiesContentHeight,
            page: currentPage,
            startY: currentY
          });
          
          currentY += hobbiesContentHeight + 20;
        }
      },
      
      // Extracurricular activities processing
      () => {
        if (hasExtracurriculars) {
          checkPageBreak(30);
          
          contentSections.current.push({
            type: 'activities-title',
            height: 30,
            page: currentPage,
            startY: currentY
          });
          
          currentY += 35;
          
          resumeData.extracurriculars
            .filter(activity => activity && activity.name)
            .forEach((activity, index) => {
              const itemHeight = 30 + (activity.description ? 
                Math.ceil(ctx.measureText(activity.description).width / contentWidth) * 20 : 0);
              
              checkPageBreak(itemHeight);
              
              contentSections.current.push({
                type: 'activity-item',
                index: index,
                height: itemHeight,
                page: currentPage,
                startY: currentY
              });
              
              currentY += itemHeight + 15;
            });
        }
      },
      
      // Referrals processing
      () => {
        if (hasReferrals) {
          checkPageBreak(30);
          
          contentSections.current.push({
            type: 'referrals-title',
            height: 30,
            page: currentPage,
            startY: currentY
          });
          
          currentY += 35;
          
          if (resumeData.referrals.providedOnRequest === true) {
            contentSections.current.push({
              type: 'referrals-on-request',
              height: 30,
              page: currentPage,
              startY: currentY,
              text: t('resume.references.provide_upon_request')
            });
            
            currentY += 40;
          } else if (Array.isArray(resumeData.referrals)) {
            resumeData.referrals
              .filter(referral => referral && referral.name)
              .forEach((referral, index) => {
                const itemHeight = 60;
                
                checkPageBreak(itemHeight);
                
                contentSections.current.push({
                  type: 'referral-item',
                  index: index,
                  height: itemHeight,
                  page: currentPage,
                  startY: currentY,
                  referral: referral
                });
                
                currentY += itemHeight + 15;
              });
          }
        }
      }
    ];

    // Run all section processing functions
    processSections.forEach(processSection => processSection());

    // Set total pages
    setTotalPages(currentPage);
  };
 
  const drawResume = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions directly 
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);
    
    // Set default text style
    ctx.font = '14px Arial';
    ctx.fillStyle = colors.text;
    
    const contentWidth = width - (margin.left + margin.right);
    
    // Draw page sections
    const pageSections = contentSections.current.filter(
      section => section.page === currentPage
    );
    
    pageSections.forEach(section => {
      const y = section.startY;
      
      // Draw different section types
      switch (section.type) {
        case 'header':
          // Draw header with personal info
          ctx.fillStyle = colors.headerBg;
          ctx.fillRect(0, y, width, section.height);
          
          // Draw name
          ctx.font = 'bold 22px Arial';
          ctx.fillStyle = colors.text;
          ctx.fillText(resumeData.personal_info.full_name || t('resume.personal_info.full_name_placeholder'), margin.left, y + 40);
          
          // Draw title
          if (resumeData.personal_info.title) {
            ctx.font = '16px Arial';
            ctx.fillStyle = colors.secondaryText;
            ctx.fillText(resumeData.personal_info.title, margin.left, y + 70);
          }
          
          // Draw contact info in header with a more organized approach
          ctx.font = '12px Arial';
          let contactY = y + 100;
          
          // Function to draw a row of contact items
          const drawContactRow = (items, rowY) => {
            let rowX = margin.left;
            let currentRowY = rowY;
            
            items.forEach(item => {
              if (!item) return;
              
              ctx.fillStyle = colors.text;
              const itemWidth = ctx.measureText(item).width;
              
              // If this item would go beyond the safe area, move to next line
              const safeWidth = width - margin.right - (resumeData.photos && resumeData.photos.length > 0 && resumeData.photos[0].photo ? 150 : 50);
              if (rowX + itemWidth > safeWidth) {
                rowX = margin.left;
                currentRowY += 20;
              }
              
              ctx.fillText(item, rowX, currentRowY);
              rowX += itemWidth + 30;
            });
            
            return currentRowY;
          };
          
          // Primary contact info (essential)
          const primaryItems = [
            resumeData.personal_info.email, 
            resumeData.personal_info.mobile
          ].filter(Boolean);
          
          contactY = drawContactRow(primaryItems, contactY);
          
          // Location info
          contactY += 20;
          const locationItems = [
            resumeData.personal_info.address,
            resumeData.personal_info.city,
            resumeData.personal_info.postal_code && `${t('resume.personal_info.postal_code')}: ${resumeData.personal_info.postal_code}`
          ].filter(Boolean);
          
          contactY = drawContactRow(locationItems, contactY);
          
          // Online presence
          contactY += 20;
          const onlineItems = [
            resumeData.personal_info.linkedin && `LinkedIn: ${resumeData.personal_info.linkedin}`,
            resumeData.personal_info.website && `${t('resume.personal_info.website')}: ${resumeData.personal_info.website}`
          ].filter(Boolean);
          
          contactY = drawContactRow(onlineItems, contactY);
          
          // Personal details
          contactY += 20;
          const personalItems = [
            resumeData.personal_info.nationality && `${t('resume.personal_info.nationality')}: ${resumeData.personal_info.nationality}`,
            resumeData.personal_info.driving_license && `${t('resume.personal_info.driving_license')}: ${resumeData.personal_info.driving_license}`
          ].filter(Boolean);
          
          contactY = drawContactRow(personalItems, contactY);
          
          // Birth details
          contactY += 20;
          const birthItems = [
            resumeData.personal_info.date_of_birth && `${t('resume.personal_info.date_of_birth')}: ${resumeData.personal_info.date_of_birth}`,
            resumeData.personal_info.place_of_birth && `${t('resume.personal_info.place_of_birth')}: ${resumeData.personal_info.place_of_birth}`
          ].filter(Boolean);
          
          contactY = drawContactRow(birthItems, contactY);
          
          // Photo rendering if available
          if (resumeData.photos && resumeData.photos.length > 0 && resumeData.photos[0].photo) {
            const img = new Image();
            img.onload = () => {
              // Draw circular photo in top right corner
              const photoSize = 100;
              const photoX = width - margin.right - photoSize;
              const photoY = y + 25; // Positioned relative to header start
              
              ctx.save();
              ctx.beginPath();
              ctx.arc(photoX + photoSize/2, photoY + photoSize/2, photoSize/2, 0, Math.PI * 2);
              ctx.closePath();
              ctx.clip();
              
              ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
              ctx.restore();
            };
            img.src = resumeData.photos[0].photo;
          }
          break;
          
        case 'summary':
          // Draw summary
          ctx.font = '14px Arial';
          ctx.fillStyle = colors.text;
          drawText(ctx, resumeData.personal_info.summary, margin.left, y+10, contentWidth, 20);
          break;
          
        case 'experience-title':
          drawSectionTitle(ctx, t('resume.experience.title').toUpperCase(), margin.left, y);
          break;
          
        case 'experience-item':
          const exp = resumeData.experiences.filter(e => e && e.company)[section.index];
          
          // Company and position
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = colors.text;
          ctx.fillText(exp.company, margin.left, y);
          
          // Position
          if (exp.position) {
            ctx.font = 'italic 14px Arial';
            ctx.fillStyle = colors.secondaryText;
            const posText = exp.position;
            const posWidth = ctx.measureText(posText).width;
            ctx.fillText(posText, width - margin.right - posWidth, y);
          }
          
          let itemY = y + 24;
          
          // Dates
          if (exp.start_date) {
            ctx.font = '14px Arial';
            ctx.fillStyle = colors.secondaryText;
            const dateText = `${exp.start_date} - ${exp.current ? t('common.tonow') : exp.end_date || ''}`;
            ctx.fillText(dateText, margin.left, itemY);
            
            // Location
            if (exp.location) {
              const locText = exp.location;
              const locWidth = ctx.measureText(locText).width;
              ctx.fillText(locText, width - margin.right - locWidth, itemY);
            }
            
            itemY += 24;
          }
          
          // Description
          if (exp.description) {
            ctx.font = '14px Arial';
            ctx.fillStyle = colors.text;
            drawText(ctx, exp.description, margin.left, itemY, contentWidth, 20);
          }
          break;
          
        case 'internships-title':
          drawSectionTitle(ctx, t('resume.internships.title').toUpperCase(), margin.left, y);
          break;
          
        case 'internship-item':
          const internship = resumeData.internships.filter(i => i && i.company)[section.index];
          
          // Company and position
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = colors.text;
          ctx.fillText(internship.company, margin.left, y);
          
          // Position
          if (internship.position) {
            ctx.font = 'italic 14px Arial';
            ctx.fillStyle = colors.secondaryText;
            const posText = internship.position;
            const posWidth = ctx.measureText(posText).width;
            ctx.fillText(posText, width - margin.right - posWidth, y);
          }
          
          let internshipY = y + 24;
          
          // Dates
          if (internship.start_date) {
            ctx.font = '14px Arial';
            ctx.fillStyle = colors.secondaryText;
            const dateText = `${internship.start_date} - ${internship.current ? t('common.tonow') : internship.end_date || ''}`;
            ctx.fillText(dateText, margin.left, internshipY);
            
            // Location
            if (internship.location) {
              const locText = internship.location;
              const locWidth = ctx.measureText(locText).width;
              ctx.fillText(locText, width - margin.right - locWidth, internshipY);
            }
            
            internshipY += 24;
          }
          
          // Description
          if (internship.description) {
            ctx.font = '14px Arial';
            ctx.fillStyle = colors.text;
            drawText(ctx, internship.description, margin.left, internshipY, contentWidth, 20);
          }
          break;
          
        case 'education-title':
          drawSectionTitle(ctx, t('resume.education.title').toUpperCase(), margin.left, y);
          break;
          
        case 'education-item':
          const edu = resumeData.educations.filter(e => e && e.institution)[section.index];
          
          // Institution
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = colors.text;
          ctx.fillText(edu.institution, margin.left, y);
          
          // Degree
          if (edu.degree && edu.field_of_study) {
            ctx.font = 'italic 14px Arial';
            ctx.fillStyle = colors.secondaryText;
            const degreeText = `${edu.degree}, ${edu.field_of_study}`;
            const degreeWidth = ctx.measureText(degreeText).width;
            ctx.fillText(degreeText, width - margin.right - degreeWidth, y);
          }
          
          let eduItemY = y + 24;
          
          // Dates
          if (edu.start_date) {
            ctx.font = '14px Arial';
            ctx.fillStyle = colors.secondaryText;
            const dateText = `${edu.start_date} - ${edu.current ? t('common.tonow') : edu.end_date || ''}`;
            ctx.fillText(dateText, margin.left, eduItemY);
            
            // Location
            if (edu.location) {
              const locText = edu.location;
              const locWidth = ctx.measureText(locText).width;
              ctx.fillText(locText, width - margin.right - locWidth, eduItemY);
            }
            
            eduItemY += 24;
          }
          
          // GPA
          if (edu.gpa) {
            ctx.font = '14px Arial';
            ctx.fillStyle = colors.text;
            ctx.fillText(`GPA: ${edu.gpa}`, margin.left, eduItemY);
          }
          break;
          
        case 'courses-title':
          drawSectionTitle(ctx, t('resume.courses.title').toUpperCase(), margin.left, y);
          break;
          
        case 'course-item':
          const course = resumeData.courses.filter(c => c && c.name)[section.index];
          
          ctx.font = 'bold 14px Arial';
          ctx.fillStyle = colors.text;
          ctx.fillText(course.name, margin.left, y);
          
          if (course.institution) {
            ctx.font = 'italic 14px Arial';
            ctx.fillStyle = colors.secondaryText;
            ctx.fillText(`at ${course.institution}`, margin.left + ctx.measureText(course.name + ' ').width, y);
          }
          
          let courseItemY = y + 20;
          
          if (course.description) {
            ctx.font = '14px Arial';
            ctx.fillStyle = colors.text;
            drawText(ctx, course.description, margin.left, courseItemY, contentWidth, 20);
          }
          break;
          
        case 'skills-title':
          drawSectionTitle(ctx, t('resume.skills.title').toUpperCase(), margin.left, y);
          break;
          
        case 'skills-content':
          ctx.font = '14px Arial';
          ctx.fillStyle = colors.text;
          
          const skills = resumeData.skills
            .filter(skill => skill && skill.name)
            .map(skill => `${skill.name}${skill.level ? ` (${skill.level})` : ''}`)
            .join(' • ');
          
          drawText(ctx, skills, margin.left, y, contentWidth, 20);
          break;
          
        case 'languages-title':
          drawSectionTitle(ctx, t('resume.languages.title').toUpperCase(), margin.left, y);
          break;
          
        case 'languages-content':
          ctx.font = '14px Arial';
          ctx.fillStyle = colors.text;
          
          const languages = resumeData.languages
            .filter(lang => lang && lang.language)
            .map(lang => `${lang.language}${lang.proficiency ? ` (${lang.proficiency})` : ''}`)
            .join(' • ');
          
          drawText(ctx, languages, margin.left, y, contentWidth, 20);
          break;
          
        case 'activities-title':
          drawSectionTitle(ctx, t('resume.extracurricular.activity').toUpperCase(), margin.left, y);
          break;
          
        case 'activity-item':
          const activity = resumeData.extracurriculars.filter(a => a && a.name)[section.index];
          
          ctx.font = 'bold 14px Arial';
          ctx.fillStyle = colors.text;
          ctx.fillText(activity.name, margin.left, y);
          
          let activityY = y + 20;
          
          if (activity.description) {
            ctx.font = '14px Arial';
            ctx.fillStyle = colors.text;
            drawText(ctx, activity.description, margin.left, activityY, contentWidth, 20);
          }
          break;
          
        case 'hobbies-title':
          drawSectionTitle(ctx, t('resume.hobbies.title').toUpperCase(), margin.left, y);
          break;
          
        case 'hobbies-content':
          ctx.font = '14px Arial';
          ctx.fillStyle = colors.text;
          
          const hobbies = resumeData.hobbies
            .filter(hobby => hobby && hobby.name)
            .map(hobby => hobby.name)
            .join(' • ');
          
          drawText(ctx, hobbies, margin.left, y, contentWidth, 20);
          break;
          
        case 'custom-section-title':
          const customSection = section.section;
          drawSectionTitle(ctx, (customSection.title || t('resume.custom_sections.title')).toUpperCase(), margin.left, y);
          break;
          
        case 'custom-section-content':
          const customSectionContent = section.section;
          
          if (customSectionContent.content) {
            ctx.font = '14px Arial';
            ctx.fillStyle = colors.text;
            drawText(ctx, customSectionContent.content, margin.left, y, contentWidth, 20);
          }
          break;
          
        case 'referrals-title':
          drawSectionTitle(ctx, t('resume.references.title').toUpperCase(), margin.left, y);
          break;
          
        case 'referral-item':
          const referral = section.referral;
          
          // Name
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = colors.text;
          ctx.fillText(referral.name || '', margin.left, y);
          
          // Relation/Position
          if (referral.relation) {
            ctx.font = 'italic 14px Arial';
            ctx.fillStyle = colors.secondaryText;
            ctx.fillText(referral.relation, margin.left, y + 20);
          }
          
          let referralY = y + 40;
          
          // Contact Information
          ctx.font = '14px Arial';
          ctx.fillStyle = colors.text;
          
          if (referral.email) {
            ctx.fillText(referral.email, margin.left, referralY);
            referralY += 20;
          }
          
          if (referral.phone) {
            ctx.fillText(referral.phone, margin.left, referralY);
          }
          break;
          
        case 'referrals-on-request':
          ctx.font = 'italic 14px Arial';
          ctx.fillStyle = colors.secondaryText;
          drawText(ctx, section.text, margin.left, y, contentWidth, 20);
          break;
          
        default:
          break;
      }
    });
    
    // Add page number at the bottom
    ctx.font = '10px Arial';
    ctx.fillStyle = colors.secondaryText;
    ctx.fillText(`Page ${currentPage} of ${totalPages}`, width - margin.right - 50, height - margin.bottom / 2);
  };
   
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    };
  };
   
  useEffect(() => {
    // Calculate layout first
    calculateLayout();
    // Then draw the resume
    drawResume();
    // Only include dependencies that should trigger a recalculation AND redraw
  }, [resumeData, darkMode]);
 
  useEffect(() => {
    // Only redraw when the page changes - no need to recalculate layout
    if (contentSections.current.length > 0) {
      drawResume();
    }
  }, [currentPage]);

  return (
    <div className="flex flex-col items-center p-4">
      <div style={{ 
        width: '100%',
        maxWidth: '500px',
        height: 'auto',
        overflow: 'hidden',
        padding: '10px'
      }}>
        <canvas 
          ref={canvasRef} 
          className="border shadow-lg"
          style={{ 
            background: colors.background,
            width: '100%',
            height: 'auto',
            borderRadius: '4px'
          }}
        />
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center mt-4 space-x-4">
        <button 
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`p-2 rounded-full ${
            currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-500 hover:bg-blue-100'
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="text-sm">
          Page {currentPage} of {totalPages}
        </div>
        
        <button 
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full ${
            currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-500 hover:bg-blue-100'
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
});

export default PaginatedCanvasResumeViewer;