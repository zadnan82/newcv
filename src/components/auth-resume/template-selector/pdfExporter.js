import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { templates } from '../web-templates/registry';

/**
 * PDF Export utility with multiple export methods
 */
const pdfExporter = {
  /**
   * Export using html2pdf.js library (recommended for most templates)
   * 
   * @param {HTMLElement} element - DOM element to convert to PDF
   * @param {string} templateId - Template ID for specific optimizations
   * @param {string} fileName - Name of the file to download
   * @returns {Promise<void>}
   */
  exportWithHtml2Pdf: async (element, templateId, fileName) => {
    if (!element) throw new Error("Element not found");
    
    // Get template-specific settings
    const templateInfo = templates[templateId] || {};
    const pdfSettings = templateInfo.pdfSettings || {};
    
    // Configure html2pdf options
    const options = {
      margin: pdfSettings.margins || [10, 10, 10, 10],
      filename: fileName || 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    // Generate PDF
    return html2pdf()
      .from(element)
      .set(options)
      .save();
  },
  
  /**
   * Export using html2canvas + jsPDF (alternative method)
   * This gives more control over the PDF generation process
   * 
   * @param {HTMLElement} element - DOM element to convert to PDF
   * @param {string} templateId - Template ID for specific optimizations
   * @param {string} fileName - Name of the file to download
   * @returns {Promise<void>}
   */
  exportWithHtml2Canvas: async (element, templateId, fileName) => {
    if (!element) throw new Error("Element not found");
    
    // Get template-specific settings
    const templateInfo = templates[templateId] || {};
    const pdfSettings = templateInfo.pdfSettings || {};
    
    // Set up the PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Calculate margins in mm
    const margins = pdfSettings.margins || [10, 10, 10, 10];
    
    // A4 dimensions in mm (width × height)
    const a4Width = 210;
    const a4Height = 297;
    
    // Capture the element as a canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      allowTaint: true
    });
    
    // Convert canvas to image
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    
    // Calculate content dimensions with margins
    const contentWidth = a4Width - (margins[1] + margins[3]);
    const contentHeight = (canvas.height * contentWidth) / canvas.width;
    
    // Add to PDF, handling multi-page if needed
    let position = 0;
    let hasMoreContent = true;
    let pageNumber = 1;
    
    while (hasMoreContent) {
      // For first page, add image
      if (pageNumber === 1) {
        pdf.addImage(
          imgData,
          'JPEG',
          margins[3],
          margins[0],
          contentWidth,
          contentHeight
        );
      } else {
        // For additional pages, add image with vertical offset
        pdf.addImage(
          imgData,
          'JPEG',
          margins[3],
          margins[0] - position,
          contentWidth,
          contentHeight
        );
      }
      
      // Calculate remaining content
      const contentPerPage = a4Height - (margins[0] + margins[2]);
      position += contentPerPage;
      
      if (position < contentHeight) {
        // Add a new page if more content remains
        pdf.addPage();
        pageNumber++;
      } else {
        hasMoreContent = false;
      }
    }
    
    // Save the PDF
    pdf.save(fileName || 'resume.pdf');
    return true;
  },
  
  /**
   * Multi-page export designed for long resumes
   * 
   * @param {HTMLElement} element - DOM element to convert to PDF
   * @param {string} templateId - Template ID for specific optimizations
   * @param {string} fileName - Name of the file to download
   * @returns {Promise<void>}
   */
  exportMultiPage: async (element, templateId, fileName) => {
    if (!element) throw new Error("Element not found");
    
    // Get template-specific settings
    const templateInfo = templates[templateId] || {};
    const pdfSettings = templateInfo.pdfSettings || {};
    
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true);
    
    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '210mm';
    document.body.appendChild(tempContainer);
    tempContainer.appendChild(clonedElement);
    
    try {
      // Process sections for better page breaks
      const sections = clonedElement.querySelectorAll('section, .section, [class*="-section"]');
      sections.forEach(section => {
        section.style.pageBreakInside = 'auto';
        section.style.breakInside = 'auto';
      });
      
      // Process items to avoid breaks
      const items = clonedElement.querySelectorAll('.expItem, .eduItem, [class*="item"]');
      items.forEach(item => {
        item.style.pageBreakInside = 'avoid';
        item.style.breakInside = 'avoid';
      });
      
      // Configure html2pdf options
      const options = {
        margin: pdfSettings.margins || [10, 10, 10, 10],
        filename: fileName || 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: '.page-break-avoid'
        }
      };
      
      // Generate PDF
      return html2pdf()
        .from(clonedElement)
        .set(options)
        .save();
    } finally {
      // Clean up
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    }
  },
  
  /**
   * Smart export that selects the best method based on template
   * 
   * @param {HTMLElement} element - DOM element to convert to PDF
   * @param {string} templateId - Template ID for specific optimizations
   * @param {string} fileName - Name of the file to download
   * @returns {Promise<void>}
   */
  smartExport: async (element, templateId, fileName) => {
    // Get template info
    const templateInfo = templates[templateId] || {};
    
    // Determine best export method for this template
    if (templateInfo.pdfExportMethod === 'html2canvas') {
      return pdfExporter.exportWithHtml2Canvas(element, templateId, fileName);
    } else if (templateInfo.pdfExportMethod === 'multipage') {
      return pdfExporter.exportMultiPage(element, templateId, fileName);
    } else {
      // Default to html2pdf for most templates
      return pdfExporter.exportWithHtml2Pdf(element, templateId, fileName);
    }
  }
};

export default pdfExporter;