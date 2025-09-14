import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';

const Contact = ({ darkMode }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    emailjs.init("tORydIIEgHKACCB3B");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
   
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 
    
    try {
      // Create a comprehensive template params object with every possible naming convention
      const templateParams = {
        // Most important: The exact variables in your HTML template
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        
        // Add this specifically for the email template structure you provided
        from_email: formData.email,
        
        // Try modifying the HTML directly in a custom parameter
        // This is a last resort approach that attempts to inject the email directly
        combined_name_email: `${formData.name} (${formData.email})`,
        
        // EmailJS default naming conventions
        from_name: formData.name,
        reply_to: formData.email,
        to_name: "Admin",
        
        // Create a special HTML field that might help
        html_email: `<a href="mailto:${formData.email}">${formData.email}</a>`,
        
        // Last resort approaches
        email_field: formData.email,
        contact_email: formData.email,
        user_contact: formData.email
      };
      
      
      const result = await emailjs.send(
        'service_u2qwt39',
        'template_ovo62ke',
        templateParams,
        'tORydIIEgHKACCB3B'
      );
      
      console.log('Email sent successfully:', result.text);
      console.log('Template parameters used:', templateParams);
      
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error("Error sending email:", err);
      setError(`${t('contact.form.error')} - Error details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`relative z-10 container mx-auto px-4 py-6 max-w-2xl ${
      darkMode ? 'text-gray-200' : 'text-gray-800'
    }`}>
      {/* Background Elements - only show in light mode */}
      {!darkMode && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute -bottom-48 right-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        </div>
      )}
      
      <div className={`p-6 rounded-lg shadow-md ${
        darkMode ? 'bg-gray-800/90' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <h1 className={`text-2xl font-medium mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>{t('contact.title')}</h1>
        
        <p className="mb-4 text-sm">
          {t('contact.intro')}
        </p>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block mb-1 text-xs font-medium">{t('contact.form.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500'
                    : 'bg-white/80 backdrop-blur-sm border-gray-300 text-gray-900 focus:ring-purple-400'
                }`}
                placeholder={t('contact.form.name_placeholder')}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-1 text-xs font-medium">{t('contact.form.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500'
                    : 'bg-white/80 backdrop-blur-sm border-gray-300 text-gray-900 focus:ring-purple-400'
                }`}
                placeholder={t('contact.form.email_placeholder')}
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block mb-1 text-xs font-medium">{t('contact.form.subject')}</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={`w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500'
                    : 'bg-white/80 backdrop-blur-sm border-gray-300 text-gray-900 focus:ring-purple-400'
                }`}
                placeholder={t('contact.form.subject_placeholder')}
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block mb-1 text-xs font-medium">{t('contact.form.message')}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className={`w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500'
                    : 'bg-white/80 backdrop-blur-sm border-gray-300 text-gray-900 focus:ring-purple-400'
                }`}
                rows="5"
                placeholder={t('contact.form.message_placeholder')}
              ></textarea>
            </div>
            
            {error && (
              <div className={`p-2 rounded-md text-xs ${darkMode ? 'bg-red-800/80 text-red-200' : 'bg-red-100 text-red-800'}`}>
                {error}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-sm hover:shadow-purple-500/30 text-white'
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-sm hover:shadow-purple-500/20 text-white'
                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? t('contact.form.sending') : t('contact.form.submit')}
              </button>
            </div>
          </form>
        ) : (
          <div className={`p-3 rounded-md ${
            darkMode ? 'bg-green-800/80' : 'bg-green-100'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-800'}`}>
              {t('contact.form.success')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;