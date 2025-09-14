import { useTranslation } from 'react-i18next';

const CookiePolicy = ({ darkMode }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-800'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t('cookiePolicy.title', 'Cookie Policy')}
        </h1>
        
        <div className="mb-6 text-sm opacity-75 text-center">
          {t('cookiePolicy.lastUpdated', 'Last Updated')}: {t('cookiePolicy.updateDate', 'April 4, 2025')}
        </div>
        
        <div className={`rounded-lg p-6 mb-8 ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <p className="mb-6">
            {t('cookiePolicy.intro', 'This Cookie Policy explains how CVATI ("we", "our", or "us") uses cookies and similar technologies on our website and application. By using CVATI, you consent to the use of cookies as described in this policy.')}
          </p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('cookiePolicy.what.title', 'What Are Cookies?')}
              </h2>
              <p>
                {t('cookiePolicy.what.desc', 'Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit websites. They are widely used to make websites work more efficiently, provide a better user experience, and give information to the website owners. Cookies cannot harm your device or access other information on your device.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('cookiePolicy.types.title', 'Types of Cookies We Use')}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">
                    {t('cookiePolicy.types.essential.title', 'Essential Cookies')}
                  </h3>
                  <p>
                    {t('cookiePolicy.types.essential.desc', 'These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.')}
                  </p>
                  <p className="mt-2 text-sm">
                    {t('cookiePolicy.types.essential.examples', 'Examples: Session cookies, authentication cookies')}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">
                    {t('cookiePolicy.types.preferences.title', 'Preference Cookies')}
                  </h3>
                  <p>
                    {t('cookiePolicy.types.preferences.desc', 'These cookies allow the website to remember choices you make (such as your language preference or your dark/light mode setting) and provide enhanced, more personal features.')}
                  </p>
                  <p className="mt-2 text-sm">
                    {t('cookiePolicy.types.preferences.examples', 'Examples: Language settings, theme preferences')}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">
                    {t('cookiePolicy.types.analytics.title', 'Analytics Cookies')}
                  </h3>
                  <p>
                    {t('cookiePolicy.types.analytics.desc', 'These cookies collect information about how you use our website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you.')}
                  </p>
                  <p className="mt-2 text-sm">
                    {t('cookiePolicy.types.analytics.examples', 'Examples: Google Analytics cookies')}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">
                    {t('cookiePolicy.types.functional.title', 'Functional Cookies')}
                  </h3>
                  <p>
                    {t('cookiePolicy.types.functional.desc', 'These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.')}
                  </p>
                  <p className="mt-2 text-sm">
                    {t('cookiePolicy.types.functional.examples', 'Examples: Chat service cookies, saved form data')}
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('cookiePolicy.specific.title', 'Specific Cookies We Use')}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse my-3">
                  <thead>
                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <th className="p-2 border text-left">{t('cookiePolicy.specific.name', 'Name')}</th>
                      <th className="p-2 border text-left">{t('cookiePolicy.specific.provider', 'Provider')}</th>
                      <th className="p-2 border text-left">{t('cookiePolicy.specific.purpose', 'Purpose')}</th>
                      <th className="p-2 border text-left">{t('cookiePolicy.specific.expiry', 'Expiry')}</th>
                      <th className="p-2 border text-left">{t('cookiePolicy.specific.type', 'Type')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                      <td className="p-2 border">cookie-consent</td>
                      <td className="p-2 border">CVATI</td>
                      <td className="p-2 border">{t('cookiePolicy.specific.consentPurpose', 'Saves your cookie preferences')}</td>
                      <td className="p-2 border">1 year</td>
                      <td className="p-2 border">{t('cookiePolicy.specific.essential', 'Essential')}</td>
                    </tr>
                    <tr className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                      <td className="p-2 border">theme</td>
                      <td className="p-2 border">CVATI</td>
                      <td className="p-2 border">{t('cookiePolicy.specific.themePurpose', 'Remembers your dark/light mode preference')}</td>
                      <td className="p-2 border">1 year</td>
                      <td className="p-2 border">{t('cookiePolicy.specific.preference', 'Preference')}</td>
                    </tr>
                    <tr className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                      <td className="p-2 border">i18next</td>
                      <td className="p-2 border">CVATI</td>
                      <td className="p-2 border">{t('cookiePolicy.specific.languagePurpose', 'Remembers your language preference')}</td>
                      <td className="p-2 border">1 year</td>
                      <td className="p-2 border">{t('cookiePolicy.specific.preference', 'Preference')}</td>
                    </tr>
                    <tr className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                      <td className="p-2 border">auth-token</td>
                      <td className="p-2 border">CVATI</td>
                      <td className="p-2 border">{t('cookiePolicy.specific.authPurpose', 'Keeps you signed in')}</td>
                      <td className="p-2 border">Session</td>
                      <td className="p-2 border">{t('cookiePolicy.specific.essential', 'Essential')}</td>
                    </tr>
                    <tr className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                      <td className="p-2 border">_ga</td>
                      <td className="p-2 border">Google Analytics</td>
                      <td className="p-2 border">{t('cookiePolicy.specific.gaPurpose', 'Used to distinguish users')}</td>
                      <td className="p-2 border">2 years</td>
                      <td className="p-2 border">{t('cookiePolicy.specific.analytics', 'Analytics')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('cookiePolicy.thirdParty.title', 'Third-Party Cookies')}
              </h2>
              <p className="mb-3">
                {t('cookiePolicy.thirdParty.desc', 'Some cookies are placed by third-party services that appear on our pages. We use services from the following third parties that may use cookies:')}
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>{t('cookiePolicy.thirdParty.analytics', 'Google Analytics - For website usage analysis')}</li>
                <li>{t('cookiePolicy.thirdParty.cloudinary', 'Cloudinary - For image storage and processing')}</li>
                <li>{t('cookiePolicy.thirdParty.oauth', 'OAuth providers (if you use social login)')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('cookiePolicy.manage.title', 'Managing Cookies')}
              </h2>
              <p className="mb-3">
                {t('cookiePolicy.manage.desc', 'Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or to alert you when cookies are being sent. The methods for doing so vary from browser to browser, and from version to version.')}
              </p>
              
              <p className="mb-3">
                {t('cookiePolicy.manage.links', 'Here are links to cookie management instructions for common browsers:')}
              </p>
              
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  <a 
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank" 
                    rel="noreferrer"
                    className={`${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a 
                    href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                    target="_blank" 
                    rel="noreferrer"
                    className={`${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a 
                    href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank" 
                    rel="noreferrer"
                    className={`${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    Microsoft Edge
                  </a>
                </li>
                <li>
                  <a 
                    href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                    target="_blank" 
                    rel="noreferrer"
                    className={`${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    Apple Safari
                  </a>
                </li>
              </ul>
              
              <p className="mt-4">
                {t('cookiePolicy.manage.note', 'Please note that restricting cookies may impact the functionality of our website. For example, you may not be able to use all the interactive features of our site or save your preferences between visits.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('cookiePolicy.similar.title', 'Similar Technologies')}
              </h2>
              <p className="mb-2">
                {t('cookiePolicy.similar.desc', 'In addition to cookies, we may use other similar technologies to store and access data on your device:')}
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li><strong>{t('cookiePolicy.similar.storage', 'Local Storage:')}</strong> {t('cookiePolicy.similar.storageDesc', 'We use browser local storage to save your preferences and improve performance.')}</li>
                <li><strong>{t('cookiePolicy.similar.session', 'Session Storage:')}</strong> {t('cookiePolicy.similar.sessionDesc', 'Similar to local storage but clears when you close your browser.')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('cookiePolicy.updates.title', 'Updates to This Policy')}
              </h2>
              <p>
                {t('cookiePolicy.updates.desc', 'We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page and, if the changes are significant, we will provide a more prominent notice.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('cookiePolicy.contact.title', 'Contact Us')}
              </h2>
              <p>
                {t('cookiePolicy.contact.desc', 'If you have any questions about our use of cookies or this Cookie Policy, please contact us at:')}
              </p>
              <p className="mt-2 font-medium">
                {t('cookiePolicy.contact.email', 'privacy@cvati.com')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;