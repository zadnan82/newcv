// File: services/pdfExportService.js
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { applyTemplateOptimizations } from './templateOptimizations';

export const pdfExportService = {
  exportResumeToPdf: async ({
    resumeRef,
    templateId,
    resumeData,
    customSettings,
    onSuccess,
    onError
  }) => {
    try {
      if (!resumeRef?.current) {
        throw new Error("Resume element not found");
      }

      // Clone the element to avoid modifying the original DOM
      const originalElement = resumeRef.current;
      const clone = originalElement.cloneNode(true);
      
      // Apply template-specific optimizations to reduce artifacts
      const optimizedElement = applyTemplateOptimizations(clone, templateId);
      
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.padding = '0';
      tempContainer.style.margin = '0';
      tempContainer.style.overflow = 'hidden';
      tempContainer.style.backgroundColor = '#ffffff';
      
      // Add anti-aliasing CSS
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @page {
          size: A4;
          margin: 0;
        }
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        /* Improve text clarity */
        p, span, h1, h2, h3, h4, h5, h6, div {
          text-shadow: 0 0 1px rgba(0, 0, 0, 0.01);
        }
        
        /* Improve borders */
        [class*="border"], [style*="border"] {
          border-color: rgba(0, 0, 0, 0.85) !important;
        }
        
        /* Fix background color edges */
        [style*="background-color"], [class*="bg-"] {
          background-clip: padding-box;
        }
        
        /* Fix image rendering */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Avoid page breaks within important elements */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          
          p, li {
            orphans: 2 !important;
            widows: 2 !important;
          }
          
          /* Keep experience/education items together */
        //   [class*="item"], [class*="experience-item"], [class*="education-item"] {
        //     page-break-inside: avoid !important;
        //     break-inside: avoid !important;
        //   }
        }
      `;
      
      optimizedElement.appendChild(styleElement);
      tempContainer.appendChild(optimizedElement);
      document.body.appendChild(tempContainer);
      
      try {
        // Generate the PDF with high-quality settings
        const fileName = `${resumeData?.personal_info?.full_name || 'resume'}.pdf`;
        
        // Configuration for high-quality output
        const opt = {
          margin: [3, 0, 3, 0], // Smaller margins [top, right, bottom, left] in mm
          filename: fileName,
          image: { 
            type: 'jpeg', 
            quality: 0.99  // High quality
          },
          html2canvas: { 
            scale: 3,  // Higher scale factor for better resolution
            useCORS: true,
            logging: false,
            letterRendering: true,
            allowTaint: false,
            backgroundColor: '#ffffff'
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true,
            putOnlyUsedFonts: true
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // Generate the PDF
        await html2pdf()
          .from(optimizedElement)
          .set(opt)
          .save();
        
        if (onSuccess) {
          onSuccess();
        }
        
        return true;
      } finally {
        // Clean up
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }
    } catch (error) {
      console.error("PDF export error:", error);
      
      if (onError) {
        onError(error);
      }
      
      return false;
    }
  },
  
  smartExport: async (options) => {
    return pdfExportService.exportResumeToPdf(options);
  }
};

export default pdfExportService;