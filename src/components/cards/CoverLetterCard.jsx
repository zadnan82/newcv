// src/components/cards/CoverLetterCard.jsx with reduced size
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CoverLetterCard = ({ darkMode }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  
  const handleClick = () => {
    setLoading(true);
    navigate('/cover-letter');
    setLoading(false);
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
      <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-500 to-purple-600 opacity-90"></div>
      
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
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
      
      {/* Card content */}
      <div className="relative p-5 flex flex-col min-h-[360px]">
        {/* Card header with icon */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center p-2 mr-3 group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t('cards.cover_letter.title', 'Cover Letter AI')}</h2>
            <p className="text-xs text-white/70">{t('cards.cover_letter.subtitle', 'Generate tailored cover letters instantly')}</p>
          </div>
        </div>
        
        {/* Card features */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t('cards.cover_letter.features.quick_gen', 'Quick Gen')}</h3>
              <p className="text-xs text-white/70">{t('cards.cover_letter.features.quick_gen_desc', 'Create in seconds')}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t('home.features.industry', 'Industry Specific')}</h3>
              <p className="text-xs text-white/70">{t('cards.cover_letter.subtitle', 'Generate tailored cover letters instantly')}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t('cards.cover_letter.features.ats_ready', 'ATS Ready')}</h3>
              <p className="text-xs text-white/70">{t('cards.cover_letter.features.ats_ready_desc', 'Pass AI checks')}</p>
            </div>
          </div>
        </div>
        
        {/* Interactive document preview */}
        <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-5">
          <div className="space-y-1.5">
            {/* Document lines */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-full bg-white/20 flex-shrink-0"></div>
              <div>
                <div className="h-1.5 w-24 bg-white/40 rounded-full"></div>
                <div className="h-1.5 w-16 bg-white/30 rounded-full mt-0.5"></div>
              </div>
            </div>
            <div className="h-1.5 w-full bg-white/30 rounded-full"></div>
            <div className="h-1.5 w-5/6 bg-white/30 rounded-full"></div>
            <div className="h-1.5 w-full bg-white/30 rounded-full"></div>
            <div className="h-1.5 w-4/5 bg-white/30 rounded-full"></div>
          </div>
          
          {/* This makes a blinking cursor effect */}
          <div className="absolute right-3 bottom-3 w-1 h-4 bg-white opacity-75 animate-[pulse_1s_ease-in-out_infinite]"></div>
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
                  {t('cards.cover_letter.actions.create', 'Create Cover Letter')}
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

export default CoverLetterCard;