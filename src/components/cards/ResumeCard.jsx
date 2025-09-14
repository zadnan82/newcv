import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ResumeCard = ({ darkMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate('/new-resume');
    } finally {
      setLoading(false);
    }
  };
 
  const particles = Array.from({ length: 8 }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1  // 1-4px
  }));

  return (
    <div 
      className="relative w-64 rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02] shadow-xl"
      onClick={handleClick}
    >
      {/* Card background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-500 opacity-90"></div>
      
      {/* Static particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/30"
            style={{
              top: particle.top,
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
      
      {/* Card content */}
      <div className="relative p-5 flex flex-col min-h-[360px]">
        {/* Card header with icon */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center p-2 mr-3 group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t('cards.resume.title', 'Smart Resume Builder')}</h2>
            <p className="text-xs text-white/70">{t('cards.resume.subtitle', 'AI-powered resume builder with smart suggestions.')}</p>
          </div>
        </div>
        
        {/* Card features */}
        <div className="space-y-3 mb-5">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t('home.features.ai', 'AI Powered')}</h3>
              <p className="text-xs text-white/70">
                {t('home.subtitle', 'Create professional resumes with AI-powered insights')}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t('cards.resume.preview', 'Templates')}</h3>
              <p className="text-xs text-white/70">
                {t('cards.resume.preview_message', 'Professional designs that catch the eye')}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t('home.features.ats', 'ATS Optimized')}</h3>
              <p className="text-xs text-white/70">
                {t('cards.cover_letter.features.ats_ready_desc', 'Pass AI checks')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Mock template preview */}
        <div className="bg-white/10 rounded-lg p-2 mb-5">
          <div className="flex gap-1 mb-1">
            <div className="h-2 w-2 rounded-full bg-white/40"></div>
            <div className="h-2 w-2 rounded-full bg-white/40"></div>
            <div className="h-2 w-2 rounded-full bg-white/40"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3">
              <div className="h-3 w-full bg-white/30 rounded mb-1"></div>
              <div className="h-1.5 w-full bg-white/20 rounded mb-0.5"></div>
              <div className="h-1.5 w-3/4 bg-white/20 rounded mb-0.5"></div>
              <div className="h-1.5 w-5/6 bg-white/20 rounded"></div>
            </div>
            <div className="w-2/3">
              <div className="h-1.5 w-full bg-white/20 rounded mb-0.5"></div>
              <div className="h-1.5 w-full bg-white/20 rounded mb-0.5"></div>
              <div className="h-1.5 w-full bg-white/20 rounded mb-0.5"></div>
              <div className="h-1.5 w-3/4 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Card action */}
        <div className="mt-auto">
          <button
            className="relative w-full py-2 rounded-xl overflow-hidden group bg-white/20 hover:bg-white/30 transition-colors duration-300"
          >
            {/* Button text */}
            <span className="relative text-white font-medium text-sm flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  {t('cards.resume.actions.build', 'Build Resume')}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;