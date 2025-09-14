// // File: services/templateOptimizations.js
// export const applyTemplateOptimizations = (element, templateId) => {
//     if (!element) return element;
    
//     // Common optimizations for all templates
//     applyCommonOptimizations(element);
    
//     // Apply template-specific optimizations
//     switch(templateId) {
//       case 'oslo':
//         optimizeOsloTemplate(element);
//         break;
//       case 'stockholm':
//         optimizeStockholmTemplate(element);
//         break;
//       // Add more templates as needed
//       default:
//         // Apply default optimizations for unknown templates
//         applyDefaultOptimizations(element);
//     }
    
//     return element;
//   };
  
//   function applyCommonOptimizations(element) {
//     // Find all section headers and improve their rendering
//     const sectionHeaders = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
//     sectionHeaders.forEach(header => {
//       // Improve text sharpness
//       header.style.textRendering = 'geometricPrecision';
//       // Add subtle shadow to reduce jagged edges
//       header.style.textShadow = '0 0 1px rgba(0, 0, 0, 0.01)';
//     });
    
//     // Improve line separators which often show artifacts
//     const separators = element.querySelectorAll('[class*="divider"], [class*="separator"], hr');
//     separators.forEach(separator => {
//       // Use a slightly transparent border color to reduce edge contrast
//       if (separator.style.borderColor) {
//         // Get the original color and make it slightly transparent
//         const computedStyle = window.getComputedStyle(separator);
//         const originalColor = computedStyle.borderColor;
        
//         // Convert to rgba with 0.95 alpha
//         if (originalColor.startsWith('rgb(')) {
//           const rgb = originalColor.match(/\d+/g);
//           separator.style.borderColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.95)`;
//         }
//       }
//     });
    
//     // Fix container edges
//     const containers = element.querySelectorAll('[class*="container"]');
//     containers.forEach(container => {
//       container.style.overflow = 'hidden';
//       container.style.position = 'relative';
//     });
    
//     // Improve icons which often show artifacts
//     const icons = element.querySelectorAll('i, [class*="icon"], svg');
//     icons.forEach(icon => {
//       // Force vector rendering when possible
//       icon.style.transform = 'translateZ(0)';
//       icon.style.backfaceVisibility = 'hidden';
//     });
//   }
  
//   function optimizeStockholmTemplate(element) {
//     // Stockholm template fixes
//     const template = element.querySelector('.stockholm-template');
//     if (template) {
//       template.style.boxShadow = 'none';
      
//       // Fix the header which often has edge artifacts
//       const header = element.querySelector('.stockholm-header');
//       if (header) {
//         header.style.backgroundColor = header.style.backgroundColor || '#1a5276';
//         header.style.padding = '20px';
        
//         // Profile image improvements
//         const profileImg = header.querySelector('img');
//         if (profileImg) {
//           profileImg.style.border = '3px solid rgba(255, 255, 255, 0.85)';
//           profileImg.style.boxShadow = 'none';
//         }
//       }
      
//       // Fix the content layout 
//       const contentLayout = element.querySelector('.stockholm-template > div:nth-child(2)');
//       if (contentLayout) {
//         contentLayout.style.overflow = 'hidden';
//         contentLayout.style.backgroundColor = '#ffffff';
//       }
      
//       // Fix experience items which often have edge artifacts
//       const expItems = element.querySelectorAll('.stockholm-exp-item, .stockholm-edu-item');
//       expItems.forEach(item => {
//         item.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.08)';
//         item.style.border = '1px solid rgba(0, 0, 0, 0.05)';
//         item.style.borderRadius = '4px';
//         item.style.padding = '10px';
//         item.style.margin = '0 0 8px 0';
//       });
//     }
//   }
  
//   function optimizeOsloTemplate(element) {
//     // Oslo specific fixes for the blue header seen in the example PDF
//     const header = element.querySelector('.oslo-header, header');
//     if (header) {
//       // Improve background rendering
//       header.style.backgroundImage = 'none'; // Remove any background images
      
//       // Get background color and ensure it's solid
//       const computedStyle = window.getComputedStyle(header);
//       if (computedStyle.backgroundColor) {
//         header.style.backgroundColor = computedStyle.backgroundColor;
//       } else {
//         // Default to a deep blue if no color found
//         header.style.backgroundColor = '#1a5276';
//       }
//     }
    
//     // Improve section heading underlines
//     const sectionHeadings = element.querySelectorAll('[class*="section-title"], [class*="heading"]');
//     sectionHeadings.forEach(heading => {
//       heading.style.borderBottom = '2px solid rgba(26, 82, 118, 0.95)';
//       heading.style.paddingBottom = '5px';
//     });
//   }
  
//   function applyDefaultOptimizations(element) {
//     // This works well for the template shown in the uploaded PDF
//     // which appears to be a blue-headed template with two columns
    
//     // Fix header with blue background
//     const header = element.querySelector('header') || 
//                   element.querySelector('[style*="background-color"]') ||
//                   element.querySelector('[class*="header"]');
                  
//     if (header) {
//       // Preserve the header background color if it exists
//       const computedStyle = window.getComputedStyle(header);
//       const backgroundColor = computedStyle.backgroundColor;
      
//       if (backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
//         header.style.backgroundColor = backgroundColor;
//       } else {
//         // Default to a professional blue color similar to the example PDF
//         header.style.backgroundColor = '#1a5276';
//       }
      
//       header.style.color = 'white';
//       header.style.padding = '15px 20px';
//       header.style.boxShadow = 'none';
      
//       // Fix profile image if present
//       const profileImg = header.querySelector('img');
//       if (profileImg) {
//         profileImg.style.borderRadius = '50%';
//         profileImg.style.border = '3px solid rgba(255, 255, 255, 0.3)';
//         profileImg.style.boxShadow = 'none';
//       }
//     }
    
//     // Fix section titles
//     const sectionTitles = element.querySelectorAll('h2, h3, [class*="section-title"]');
//     sectionTitles.forEach(title => {
//       title.style.borderBottom = '2px solid #1a5276';
//       title.style.paddingBottom = '5px';
//       title.style.marginBottom = '10px';
//       title.style.color = '#1a5276';
//     });
    
//     // Fix content cards/items that often show edge artifacts
//     const contentItems = element.querySelectorAll('[class*="item"], [class*="card"]');
//     contentItems.forEach(item => {
//       item.style.marginBottom = '8px';
//       item.style.paddingBottom = '8px';
//       item.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
//     });
//   }
  
//   export default applyTemplateOptimizations;