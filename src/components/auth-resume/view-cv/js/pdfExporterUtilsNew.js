import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportHTMLToPDF = async (resumeRef, options = {}) => {
  const resumeElement = resumeRef?.current || resumeRef;
  if (!resumeElement) {
    console.error('Resume element is not available');
    alert('Could not find resume element for PDF export');
    return null;
  }

  const filename = options.filename || `resume-${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`;

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate the available width and height for content
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.width = pageWidth + 'mm';
    tempContainer.style.minHeight = pageHeight  + 'mm';
    tempContainer.style.overflow = 'hidden';
    tempContainer.style.position = 'relative';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.innerHTML = resumeElement.innerHTML;

    // Adjust font sizes, margins, and paddings
    const adjustStyles = (element) => {
      const reduceFontSize = (el) => {
        const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
        el.style.fontSize = fontSize * 20 + 'px';
      };

      const reduceMargin = (el) => {
        const margin = parseFloat(window.getComputedStyle(el).margin);
        el.style.margin = margin * 20 + 'px';
      };
      
      const reducePadding = (el) => {
        const padding = parseFloat(window.getComputedStyle(el).padding);
        el.style.padding = padding * 20 + 'px';
      };

      element.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(reduceFontSize);
      element.querySelectorAll('p, span, div').forEach(reduceFontSize);
      element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div').forEach(reduceMargin);
      element.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div').forEach(reducePadding);
    };

    adjustStyles(tempContainer);
    document.body.appendChild(tempContainer);

    // Wait for dynamic content to load
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Render the temporary container to canvas
    const canvas = await html2canvas(tempContainer, {
      scale: 1,
      width: pageWidth,
      height: tempContainer.scrollHeight,
      logging: false,
      useCORS: true
    });

    const pageData = canvas.toDataURL('image/jpeg', 1.0);

    // Calculate the number of pages needed
    const totalHeight = tempContainer.scrollHeight;
    const numPages = Math.ceil(totalHeight / pageHeight);

    // Add pages with the rendered content
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (pageNum > 1) {
        pdf.addPage();
      }

      const pageTop = (pageNum - 1) * pageHeight;
      pdf.addImage(pageData, 'JPEG', 0, -pageTop, pageWidth, totalHeight);
    }

    // Clean up the temporary container
    document.body.removeChild(tempContainer);

    pdf.save(filename);
    return filename;
  } catch (error) {
    console.error('PDF Export Error:', error);
    alert(`PDF Export Failed: ${error.message}`);
    return null;
  }
};
 

/**
 * Prints the resume using the browser's print dialog
 * @param {Object} resumeRef - Reference to resume component
 * @param {string} viewMode - Current view mode ('html' or 'canvas')
 * @returns {Promise<boolean>} - Success status
 */
export const printResume = async (resumeRef, viewMode) => {
  if (!resumeRef?.current) {
    console.error('Resume reference is not available');
    return false;
  }
  
  // Show loading indicator
  const loadingEl = document.createElement('div');
  loadingEl.style.position = 'fixed';
  loadingEl.style.top = '50%';
  loadingEl.style.left = '50%';
  loadingEl.style.transform = 'translate(-50%, -50%)';
  loadingEl.style.padding = '15px 25px';
  loadingEl.style.background = 'rgba(0, 0, 0, 0.7)';
  loadingEl.style.color = 'white';
  loadingEl.style.borderRadius = '5px';
  loadingEl.style.zIndex = '9999';
  loadingEl.style.fontFamily = 'Arial, sans-serif';
  loadingEl.innerHTML = 'Preparing print...';
  document.body.appendChild(loadingEl);
  
  try {
    if (viewMode === 'html') {
      // For HTML view
      const resumeElement = resumeRef.current;
      
      // Open a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow pop-ups to print');
        return false;
      }
      
      // Clone element to avoid modifications to original
      const clone = resumeElement.cloneNode(true);
      
      // Reset styles that might affect printing
      clone.style.transform = 'none';
      clone.style.width = '100%';
      clone.style.maxWidth = '210mm';
      clone.style.margin = '0 auto';
      clone.style.boxShadow = 'none';
      
      // Write content to print window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Resume</title>
            <style>
              @page {
                size: A4;
                margin: 10mm;
              }
              body {
                margin: 0;
                padding: 0;
                background: white;
                font-family: Arial, sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .resume-container {
                width: 100%;
                max-width: 190mm;
                margin: 0 auto;
                background: white;
              }
              @media print {
                body {
                  width: 190mm;
                }
              }
            </style>
          </head>
          <body>
            <div class="resume-container">
              ${clone.outerHTML}
            </div>
            <script>
              // Trigger print after a short delay
              setTimeout(function() {
                window.print();
                window.addEventListener('afterprint', function() {
                  window.close();
                });
              }, 500);
            </script>
          </body>
        </html>
      `);
    } else if (viewMode === 'canvas') {
      // For Canvas view
      const canvasViewerRef = resumeRef;
      
      // Get page info
      const totalPages = canvasViewerRef.current.getTotalPages();
      const currentPage = canvasViewerRef.current.getCurrentPage();
      
      // Open print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow pop-ups to print');
        return false;
      }
      
      // Write print window content
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Resume</title>
            <style>
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                background: white;
              }
              .page {
                width: 210mm;
                height: 297mm;
                margin: 0 auto;
                page-break-after: always;
              }
              .page:last-child {
                page-break-after: avoid;
              }
              img {
                width: 100%;
                height: 100%;
                display: block;
              }
              .loading {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: rgba(255,255,255,0.9);
                z-index: 1000;
              }
              @media print {
                .loading {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="loading">
              <h2>Preparing to print...</h2>
              <p id="status">Loading pages...</p>
            </div>
            
            <div id="pages"></div>
            
            <script>
              // Track loaded pages
              let loadedPages = 0;
              const totalPages = ${totalPages};
              
              // Function to add a page
              function addPage(imgData, pageNum) {
                const pageDiv = document.createElement('div');
                pageDiv.className = 'page';
                
                const img = document.createElement('img');
                img.src = imgData;
                img.alt = 'Resume page ' + pageNum;
                
                pageDiv.appendChild(img);
                document.getElementById('pages').appendChild(pageDiv);
                
                // Update status
                loadedPages++;
                document.getElementById('status').textContent = 
                  'Loading page ' + loadedPages + ' of ' + totalPages;
                
                // If all pages loaded, print
                if (loadedPages === totalPages) {
                  setTimeout(() => {
                    document.querySelector('.loading').style.display = 'none';
                    window.print();
                    window.addEventListener('afterprint', () => {
                      window.close();
                    });
                  }, 500);
                }
              }
            </script>
          </body>
        </html>
      `);
      
      // Process each page sequentially
      for (let i = 1; i <= totalPages; i++) {
        // Update loading status
        loadingEl.innerHTML = `Preparing page ${i} of ${totalPages}...`;
        
        // Set current page in viewer
        canvasViewerRef.current.setCurrentPage(i);
        
        // Wait for rendering
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get canvas for this page
        const canvas = canvasViewerRef.current.getCanvas();
        if (!canvas) {
          console.error(`Failed to get canvas for page ${i}`);
          continue;
        }
        
        // Get image data
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        
        // Add to print window
        printWindow.addPage(imgData, i);
      }
      
      // Restore original page
      canvasViewerRef.current.setCurrentPage(currentPage);
      canvasViewerRef.current.redraw();
    }
    
    return true;
  } catch (error) {
    console.error('Error in printResume:', error);
    alert(`Error preparing print: ${error.message}`);
    return false;
  } finally {
    // Remove loading indicator
    if (document.body.contains(loadingEl)) {
      document.body.removeChild(loadingEl);
    }
  }
};

/**
 * Exports a paginated canvas to PDF
 * @param {Object} canvasViewerRef - Reference to canvas viewer
 * @param {string} filename - PDF filename
 * @param {Object} options - Additional options
 * @returns {Promise<string|null>} - Filename or null on error
 */
export const exportPaginatedCanvasToPDF = async (canvasViewerRef, filename = null, options = {}) => {
  if (!canvasViewerRef?.current) {
    console.error('Canvas viewer reference is not available');
    return null;
  }
  
  // Show loading indicator
  const loadingEl = document.createElement('div');
  loadingEl.style.position = 'fixed';
  loadingEl.style.top = '50%';
  loadingEl.style.left = '50%';
  loadingEl.style.transform = 'translate(-50%, -50%)';
  loadingEl.style.padding = '15px 25px';
  loadingEl.style.background = 'rgba(0, 0, 0, 0.7)';
  loadingEl.style.color = 'white';
  loadingEl.style.borderRadius = '5px';
  loadingEl.style.zIndex = '9999';
  loadingEl.style.fontFamily = 'Arial, sans-serif';
  loadingEl.innerHTML = 'Creating PDF...';
  document.body.appendChild(loadingEl);
  
  try {
    // Get page info
    const totalPages = canvasViewerRef.current.getTotalPages();
    const currentPage = canvasViewerRef.current.getCurrentPage();
    
    // Create PDF document (A4 size)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set document properties
    // Set document properties if provided
    if (options.title) pdf.setProperties({ title: options.title });
    if (options.author) pdf.setProperties({ author: options.author });
    if (options.subject) pdf.setProperties({ subject: options.subject });
    
    // Process each page
    for (let i = 1; i <= totalPages; i++) {
      // Update loading message
      loadingEl.innerHTML = `Creating PDF... Page ${i} of ${totalPages}`;
      
      // Set current page in viewer
      canvasViewerRef.current.setCurrentPage(i);
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Get canvas for this page
      const canvas = canvasViewerRef.current.getCanvas();
      if (!canvas) {
        throw new Error(`Failed to get canvas for page ${i}`);
      }
      
      // Get image data
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Add new page if not the first page
      if (i > 1) {
        pdf.addPage();
      }
      
      // Add image to PDF (full page)
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    }
    
    // Generate filename if not provided
    if (!filename) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      filename = `resume-${timestamp}.pdf`;
    }
    
    // Save PDF
    pdf.save(filename);
    
    // Restore original page
    canvasViewerRef.current.setCurrentPage(currentPage);
    canvasViewerRef.current.redraw();
    
    return filename;
  } catch (error) {
    console.error('Error in exportPaginatedCanvasToPDF:', error);
    alert(`Error creating PDF: ${error.message}`);
    return null;
  } finally {
    // Remove loading indicator
    if (document.body.contains(loadingEl)) {
      document.body.removeChild(loadingEl);
    }
  }
};

/**
 * Compatibility wrapper for printResume function
 */
export const printResumeFn = async (refs, viewMode) => {
  if (viewMode === 'html' && refs.htmlResumeRef?.current) {
    return await printResume(refs.htmlResumeRef, 'html');
  } else if (viewMode === 'canvas' && refs.canvasResumeRef?.current) {
    return await printResume(refs.canvasResumeRef, 'canvas');
  }
  
  return false;
};

/**
 * Generates a filename for the resume PDF
 * @param {Object} userData - User data
 * @returns {string} - Formatted filename
 */
export const generateResumeFilename = (userData) => {
  if (!userData || !userData.personalInfo) return 'resume';
  
  const name = userData.personalInfo.full_name || '';
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  
  // Add date for uniqueness
  const date = new Date().toISOString().split('T')[0];
  
  return cleanName ? `${cleanName}_resume_${date}.pdf` : `resume_${date}.pdf`;
};

/**
 * Main export function
 * @param {Object} refs - References to different views
 * @param {string} viewMode - Current view mode
 * @param {Object} userData - User data
 * @returns {Promise<string|null>} - Filename or null on error
 */
export const exportToPDF = async (refs, viewMode, userData) => {
  // Generate filename
  const filename = generateResumeFilename(userData);
  
  try {
    if (viewMode === 'html' && refs.htmlResumeRef?.current) {
      // Export HTML view to PDF
      //return await exportHTMLToPDF(refs.htmlResumeRef.current, filename);

      return  printResumeFn(refs, viewMode); 
 


    } else if (viewMode === 'canvas' && refs.canvasResumeRef?.current) {
      // Export Canvas view to PDF
      const options = {
        title: `Resume - ${userData.personalInfo?.full_name || 'Resume'}`,
        author: userData.personalInfo?.full_name || '',
        subject: userData.personalInfo?.title || 'Resume'
      };
      
      return await exportPaginatedCanvasToPDF(refs.canvasResumeRef, filename, options);
    }
    
    throw new Error('Invalid view mode or missing references');
  } catch (error) {
    console.error('Error in exportToPDF:', error);
    alert(`Failed to export PDF: ${error.message}`);
    return null;
  }
};

// Export all functions for flexibility
 