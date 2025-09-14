import React, { useRef, useEffect } from 'react';
import templates from '../web-templates/registry';

 
const PdfGenerator = ({ 
  templateId,
  formData,
  customSettings,
  onRender
}) => {
  const containerRef = useRef(null);
  const templateInfo = templates[templateId];
  if (!templateInfo) {
    console.error(`Template "${templateId}" not found`);
    return null;
  }
  const TemplateComponent = templateInfo.component;
  const pdfSettings = templateInfo.pdfSettings || {}; 
  
  useEffect(() => {
    if (containerRef.current && onRender) {
      // Give the template a moment to fully render
      setTimeout(() => {
        onRender(containerRef.current);
      }, 100);
    }
  }, [onRender, templateId, formData, customSettings]);
  
  return (
    <div
      ref={containerRef}
      className="pdf-optimized-container"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '210mm', // A4 width
        height: 'auto',
        margin: '0',
        padding: '0',
        overflow: 'hidden'
      }}
      data-template-id={templateId}
    >
      {/* Add PDF-specific styles */}
      <style>
        {`
          @page {
            size: A4;
            margin: ${pdfSettings.pageMarginsCSS || '10mm'};
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
            
            /* Avoid page breaks within these items */
            .expItem, .eduItem, [class*="item"], [class*="experience-item"], [class*="education-item"] {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            
            /* Template-specific optimizations */
            ${pdfSettings.additionalCSS || ''}
          }
        `}
      </style>
      
      {/* Render the template with PDF mode enabled */}
      <TemplateComponent 
        formData={formData} 
        customSettings={customSettings} 
        isPdfMode={true}
      />
    </div>
  );
};

export default PdfGenerator;