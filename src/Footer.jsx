import { Link } from 'react-router-dom'; 
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Github, Linkedin, Facebook } from 'lucide-react';

const Footer = ({ darkMode }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className={`max-w-7xl border-t mx-auto px-4 sm:px-6 lg:px-8 ${
      darkMode ? 'border-gray-700' : 'border-gray-300/50'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4">
        {/* Column 1: About */}
        <div>
          <h3 className={`text-sm font-medium mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {t('footer.about.title', 'AI Resume Builder')}
          </h3>
          <p className="text-xs mb-3">
            {t('footer.about.description', 'Create professional resumes with AI-powered insights to boost your career opportunities.')}
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className={`text-sm font-medium mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {t('footer.quickLinks.title', 'Quick Links')}
          </h3>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link 
                to="/" 
                className={`hover:${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
              >
                {t('footer.quickLinks.home', 'Home')}
              </Link>
            </li>
            <li>
              <Link 
                to="/new-resume" 
                className={`hover:${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
              >
                {t('footer.quickLinks.resumeBuilder', 'Resume Builder')}
              </Link>
            </li>
            <li>
              <Link 
                to="/cover-letter" 
                className={`hover:${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
              >
                {t('footer.quickLinks.coverLetter', 'Cover Letter Generator')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h3 className={`text-sm font-medium mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {t('footer.legal.title', 'Legal')}
          </h3>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link 
                to="/terms" 
                className={`hover:${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
              >
                {t('footer.legal.terms', 'Terms and Conditions')}
              </Link>
            </li>
            <li>
              <Link 
                to="/privacy" 
                className={`hover:${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
              >
                {t('footer.legal.privacy', 'Privacy Policy')}
              </Link>
            </li>
            <li>
              <Link 
                to="/cookies" 
                className={`hover:${darkMode ? 'text-purple-400' : 'text-purple-600'}`}
              >
                {t('footer.legal.cookies', 'Cookie Policy')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h3 className={`text-sm font-medium mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {t('footer.contact.title', 'Contact Us')}
          </h3>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link 
                to="/contact" 
                className={`inline-block mt-1 px-3 py-1.5 rounded-full text-xs ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-sm hover:shadow-purple-500/30 text-white'
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-sm hover:shadow-purple-500/20 text-white'
                }`}
              >
                {t('footer.contact.contactForm', 'Contact Form')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className={`mt-3 pt-3 border-t text-center text-xs ${
        darkMode ? 'border-gray-700' : 'border-gray-300/50'
      }`}>
        <p>
          &copy; {currentYear} {t('footer.copyright', 'AI Resume Builder')}. {t('footer.rights', 'All rights reserved')}.
        </p>
      </div>
    </div>
  );
};

export default Footer;