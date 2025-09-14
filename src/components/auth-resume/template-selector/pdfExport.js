import html2pdf from 'html2pdf.js';

/**
 * Exports the resume template as a PDF using html2pdf
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Result with success/error info
 */
export const exportToPdf = async (options) => {
  const {
    element,      // The DOM element to convert (required)
    resumeData,   // The resume data (for filename)
    templateId,   // Template ID (for filename)
    beforeExport, // Function to run before export
    afterExport   // Function to run after export
  } = options;

  try {
    // Run pre-export function if provided
    if (typeof beforeExport === 'function') {
      await beforeExport();
    }

    // Wait a moment for any UI updates
    await new Promise(resolve => setTimeout(resolve, 300));

    // Make sure we have the element
    if (!element) {
      throw new Error('No element provided for PDF export');
    }

    // Find the template element
    const templateElement = element.querySelector('.template-renderer');
    if (!templateElement) {
      throw new Error('Template element not found');
    }

    // Create a clone of the element for PDF generation to avoid modifying the original
    const clone = templateElement.cloneNode(true);
    
    // Append to a hidden container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '210mm'; // A4 width
    container.style.height = 'auto';
    container.style.visibility = 'hidden';
    document.body.appendChild(container);
    container.appendChild(clone);
    
    // Create comprehensive style element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Global Reset and Foundational Styles */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        line-height: 1.5;
      }

      @page {
        size: A4;
        margin: 10mm;
      }

      body {
        font-family: 'Arial', 'Helvetica', sans-serif;
        color: #333;
        font-size: 10pt;
        line-height: 1.5;
      }

      /* Header Styling */
      .resume-header {
        background: linear-gradient(90deg, #2c3e50 0%, #34495e 100%);
        color: #fff;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        margin-bottom: 15px;
      }

      .resume-header-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 15px;
        border: 2px solid rgba(255,255,255,0.2);
      }

      .resume-header-content {
        flex-grow: 1;
      }

      .resume-header-name {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 5px;
        letter-spacing: 0.5px;
      }

      .resume-header-title {
        font-size: 14px;
        font-weight: 300;
        opacity: 0.9;
      }

      .resume-header-contact {
        display: flex;
        gap: 10px;
        margin-top: 8px;
        font-size: 10px;
      }

      /* Section Styling */
      .resume-section {
        margin-bottom: 10px;
        padding: 0 10px;
      }

      .resume-section-title {
        font-size: 16px;
        color: #2c3e50;
        border-bottom: 1.5px solid #3498db;
        padding-bottom: 5px;
        margin-bottom: 10px;
        font-weight: 600;
      }

      /* Item Styling */
      .resume-item {
        margin-bottom: 10px;
        padding-left: 8px;
        border-left: 2px solid #3498db;
      }

      .resume-item-title {
        font-size: 12pt;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 3px;
      }

      .resume-item-subtitle {
        font-size: 10pt;
        color: #7f8c8d;
        margin-bottom: 3px;
      }

      .resume-item-dates {
        font-size: 9pt;
        color: #95a5a6;
        font-style: italic;
        margin-bottom: 3px;
      }

      .resume-item-description {
        font-size: 10pt;
        color: #333;
        margin-top: 3px;
      }

      /* Sidebar Styling */
      .resume-sidebar {
        background-color: #f9f9f9;
        padding: 10px;
        font-size: 9pt;
      }

      /* Footer Styling */
      .pdf-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        text-align: center;
        font-size: 8px;
        color: #666;
        border-top: 0.5px solid #e0e0e0;
        padding: 5mm 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: Arial, sans-serif;
        background: #f9f9f9;
      }

      .pdf-footer-content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 15mm;
      }

      /* Prevent content overflow */
      * {
        max-width: 100%;
        overflow-wrap: break-word;
      }

      /* Page Break Handling */
      .page-break {
        page-break-after: always;
      }
    `;
    
    clone.appendChild(styleElement);
    
    // Filename generation
    const fileName = `${resumeData?.personal_info?.full_name || 'Resume'}_${templateId || 'template'}.pdf`
      .replace(/\s+/g, '_');
    
    // Current date
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Create footer element
    const footerElement = document.createElement('div');
    footerElement.className = 'pdf-footer';
    footerElement.innerHTML = `
      <div class="pdf-footer-content">
        <span>${resumeData?.personal_info?.email || 'No email'}</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        <span>${today}</span>
      </div>
    `;
    
    clone.appendChild(footerElement);
    
    // Set width and prepare for PDF generation
    clone.style.width = '190mm';
    clone.style.maxWidth = '190mm';
    clone.style.margin = '0 auto';
    clone.style.transform = 'none';
    clone.style.transformOrigin = 'top center';
    
    // HTML2PDF options
    const pdfOptions = {
      margin: [10, 10, 15, 10], // [top, right, bottom, left] in mm
      filename: fileName,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        scrollY: 0,
        windowWidth: 210 * 3.78,
        logging: false,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      }
    };

    // Generate and download PDF
    const pdf = await html2pdf().from(clone).set(pdfOptions).outputPdf('blob');
    
    const blobUrl = URL.createObjectURL(pdf);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Clean up
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobUrl);
    document.body.removeChild(container);
    
    // Run after-export function if provided
    if (typeof afterExport === 'function') {
      await afterExport();
    }
    
    return { 
      success: true,
      filename: fileName
    };
  } catch (error) {
    console.error('PDF export error:', error);
    
    // Run after-export function even on error
    if (typeof afterExport === 'function') {
      await afterExport();
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

export default exportToPdf;