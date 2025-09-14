import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import templates from '../web-templates/registry';

const TemplateRenderer = ({ 
  templateId = 'stockholm', 
  formData = {}, 
  customSettings = {},
  darkMode = false,
  scale = 0.4,
  onRenderComplete = () => {} 
}) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  // Check if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get container dimensions
  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [containerRef]);

  // Safely handle form data with defaults
  const safeFormData = {
    ...(formData || {}),
    personal_info: formData?.personal_info || [],
    educations: formData?.educations || [],
    experiences: formData?.experiences || [],
    skills: formData?.skills || [],
    languages: formData?.languages || [],
    referrals: formData?.referrals || [],
    custom_sections: formData?.custom_sections || [],
    extracurriculars: formData?.extracurriculars || [],
    hobbies: formData?.hobbies || [],
    courses: formData?.courses || [],
    photos: formData?.photos || { photolink: null },
    internships: formData?.internships || [],
  };

  // Select the template or fallback to default
  const selectedTemplate = templates[templateId] || templates['stockholm'];
  
  // Handle render complete notification
  useEffect(() => {
    onRenderComplete();
  }, [onRenderComplete, templateId, formData, customSettings, darkMode]);

  if (!selectedTemplate) {
    console.warn(`Template "${templateId}" not found. Using default template.`);
    return (
      <div className="text-red-500 p-2">
        {t('resume.templateRenderer.error')}
      </div>
    );
  }

  const TemplateComponent = selectedTemplate.component;
  
  // Calculate best scale to fit in viewport
  const calculateScale = () => {
    if (containerSize.width === 0) return scale;
    
    // A4 dimensions in mm converted to pixels approximately
    const documentWidth = 210 * 3.78; // 210mm × 3.78px/mm ≈ 793px
    const scaleFactor = containerSize.width / documentWidth;
    
    // Cap at 0.95 for desktop, 0.7 for mobile
    return Math.min(
      isMobile ? 0.7 : 0.95, 
      Math.max(0.4, scaleFactor * 0.9)
    );
  };
  
  // Get final scale based on container size
  const finalScale = calculateScale();

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-auto relative"
    >
      <div 
        className="w-full min-h-full flex items-start justify-center"
      >
        <div 
          style={{
            transform: `scale(${finalScale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
          className="bg-white rounded-lg shadow-xl overflow-visible"
        >
          <div style={{
            width: '210mm',
            minHeight: '297mm',
            backgroundColor: '#fff',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}>
            <TemplateComponent 
              formData={safeFormData} 
              customSettings={{
                ...customSettings,
                fontSize: customSettings.fontSize || '0.95rem'
              }} 
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateRenderer;