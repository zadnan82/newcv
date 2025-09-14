import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSwitcher = ({ darkMode }) => {
  const { i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // List of supported languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' }, // Corrected 'se' to 'sv' for Swedish
    { code: 'ar', name: 'العربية', flag: '🇦🇪' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    // { code: 'pt', name: 'Português', flag: '🇵🇹' },
    // { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    // { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    // { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    // { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    // { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    // { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    // { code: 'he', name: 'עברית', flag: '🇮🇱' },
    // { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    // { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    // { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
    // { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    // { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    // { code: 'ro', name: 'Română', flag: '🇷🇴' },
    // { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    // { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    // { code: 'zh', name: '中文', flag: '🇨🇳' },
    // { code: 'ja', name: '日本語', flag: '🇯🇵' },
    // { code: 'ko', name: '한국어', flag: '🇰🇷' },
];
 
     
  
  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);
    setDropdownOpen(false);
    
    // Dispatch an event that language has changed - this can be used by other components
    window.dispatchEvent(new Event('languageChange'));
  };

  // Get current language info
  const getCurrentLanguage = () => {
    // First check if a language is explicitly set
    const currentLangCode = i18n.language || localStorage.getItem('preferredLanguage') || 'en';
    // If language code has region (e.g., 'en-US'), use just the base language
    const baseLangCode = currentLangCode.split('-')[0];
    return languages.find(lang => lang.code === baseLangCode) || languages[0];
  };

  const currentLanguage = getCurrentLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-1 px-2 py-2 rounded-md text-sm font-medium focus:outline-none ${
          darkMode
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
        }`}
        aria-label="Select language"
      >
        <Globe size={18} className="mr-1" />
        <span className="mx-1">{currentLanguage.name}</span>
        <span className="mr-1">{currentLanguage.flag}</span>
        <ChevronDown size={16} />
      </button>
      
      {dropdownOpen && (
        <div className={`absolute right-0 mt-2 py-1 w-48 rounded-md shadow-lg z-10 ${
          darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="max-h-64 overflow-y-auto">
            {languages.map((language) => {
              const isActive = i18n.language?.startsWith(language.code) || false;
              
              return (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                    isActive
                      ? darkMode
                        ? 'bg-gray-600 text-white'
                        : 'bg-blue-50 text-blue-700'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{language.flag}</span>
                  <span>{language.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;