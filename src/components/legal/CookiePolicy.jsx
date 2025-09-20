import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, Settings, Eye, Database, Shield, BarChart, UserCheck, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const CookiePolicy = ({ darkMode }) => {
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10'}`}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-48 w-96 h-96 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 left-48 w-96 h-96 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 pt-8 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg`}>
              <Cookie className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600`}>
            {t('cookies2.title', 'Cookie Policy')}
          </h1>
          
          <p className={`text-base md:text-lg max-w-2xl mx-auto mb-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('cookies2.subtitle', 'Learn about how CVati uses cookies and similar technologies to enhance your experience.')}
          </p>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            darkMode ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            <UserCheck className="w-4 h-4 mr-2" />
            {t('cookies2.last_updated', 'Last Updated')}: {t('cookies2.date', 'September 2025')}
          </div>
        </header>

        {/* What Are Cookies */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Cookie className="w-6 h-6 mr-3 text-purple-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('cookies2.what_are.title', 'What Are Cookies?')}
            </h2>
          </div>

          <div className="space-y-4">
            <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('cookies2.what_are.description', 'Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('cookies2.what_are.how_work.title', 'How They Work')}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('cookies2.what_are.how_work.description', 'Cookies store information about your visit and can recognize you when you return to the website.')}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('cookies2.what_are.your_control.title', 'Your Control')}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('cookies2.what_are.your_control.description', 'You can control and delete cookies through your browser settings at any time.')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Use Cookies */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Settings className="w-6 h-6 mr-3 text-pink-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('cookies2.how_we_use.title', 'How CVati Uses Cookies')}
            </h2>
          </div>

          <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'}`}>
            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
              {t('cookies2.how_we_use.minimal_approach.title', 'Minimal Cookie Approach')}
            </h3>
            <p className={`${darkMode ? 'text-green-300' : 'text-green-700'}`}>
              {t('cookies2.how_we_use.minimal_approach.description', 'CVati follows a privacy-first approach and uses minimal cookies. Most functionality works without cookies, and we only use them when necessary for core features.')}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('cookies2.how_we_use.purposes.title', 'We Use Cookies For:')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('cookies2.how_we_use.essential.title', 'Essential Functions')}
                  </h4>
                </div>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• {t('cookies2.how_we_use.essential.session', 'Session management and authentication')}</li>
                  <li>• {t('cookies2.how_we_use.essential.preferences', 'Remembering your preferences (dark mode, language)')}</li>
                  <li>• {t('cookies2.how_we_use.essential.local_storage', 'Local storage functionality')}</li>
                </ul>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center mb-2">
                  <BarChart className="w-5 h-5 mr-2 text-blue-500" />
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('cookies2.how_we_use.analytics.title', 'Analytics (Optional)')}
                  </h4>
                </div>
                <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li>• {t('cookies2.how_we_use.analytics.usage', 'Understanding how the app is used')}</li>
                  <li>• {t('cookies2.how_we_use.analytics.performance', 'Performance monitoring')}</li>
                  <li>• {t('cookies2.how_we_use.analytics.improvements', 'Identifying areas for improvement')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Cookies */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Database className="w-6 h-6 mr-3 text-blue-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('cookies2.types.title', 'Types of Cookies We Use')}
            </h2>
          </div>

          <div className="space-y-6">
            {/* Essential Cookies */}
            <div className={`p-6 rounded-lg border-2 ${
              darkMode ? 'bg-green-900/20 border-green-700/50' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  <h3 className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                    {t('cookies2.types.essential.title', 'Essential Cookies (Required)')}
                  </h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-green-800 text-green-300' : 'bg-green-200 text-green-800'
                }`}>
                  {t('cookies2.types.essential.status', 'Always Active')}
                </div>
              </div>
              
              <p className={`text-sm mb-3 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                {t('cookies2.types.essential.description', 'These cookies are necessary for the website to function properly and cannot be disabled.')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-3 rounded ${darkMode ? 'bg-green-800/30' : 'bg-green-100'}`}>
                  <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                    {t('cookies2.types.essential.session.title', 'Session Cookies')}
                  </h4>
                  <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {t('cookies2.types.essential.session.description', 'Maintain your session while using the app')}
                  </p>
                </div>
                
                <div className={`p-3 rounded ${darkMode ? 'bg-green-800/30' : 'bg-green-100'}`}>
                  <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                    {t('cookies2.types.essential.preferences.title', 'Preference Cookies')}
                  </h4>
                  <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {t('cookies2.types.essential.preferences.description', 'Remember your settings like dark mode')}
                  </p>
                </div>
                
                <div className={`p-3 rounded ${darkMode ? 'bg-green-800/30' : 'bg-green-100'}`}>
                  <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                    {t('cookies2.types.essential.consent.title', 'Consent Cookies')}
                  </h4>
                  <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {t('cookies2.types.essential.consent.description', 'Remember your cookie preferences')}
                  </p>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className={`p-6 rounded-lg border-2 ${
              darkMode ? 'bg-blue-900/20 border-blue-700/50' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BarChart className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                    {t('cookies2.types.analytics.title', 'Analytics Cookies (Optional)')}
                  </h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-blue-800 text-blue-300' : 'bg-blue-200 text-blue-800'
                }`}>
                  {t('cookies2.types.analytics.status', 'User Choice')}
                </div>
              </div>
              
              <p className={`text-sm mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                {t('cookies2.types.analytics.description', 'These cookies help us understand how you use our website so we can improve it.')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-3 rounded ${darkMode ? 'bg-blue-800/30' : 'bg-blue-100'}`}>
                  <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    {t('cookies2.types.analytics.usage.title', 'Usage Analytics')}
                  </h4>
                  <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {t('cookies2.types.analytics.usage.description', 'Track which features are used most')}
                  </p>
                </div>
                
                <div className={`p-3 rounded ${darkMode ? 'bg-blue-800/30' : 'bg-blue-100'}`}>
                  <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    {t('cookies2.types.analytics.performance.title', 'Performance Monitoring')}
                  </h4>
                  <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {t('cookies2.types.analytics.performance.description', 'Monitor app speed and reliability')}
                  </p>
                </div>
              </div>
            </div>

            {/* No Marketing Cookies */}
            <div className={`p-6 rounded-lg border-2 ${
              darkMode ? 'bg-red-900/20 border-red-700/50' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-red-600" />
                  <h3 className={`font-semibold ${darkMode ? 'text-red-400' : 'text-red-800'}`}>
                    {t('cookies2.types.marketing.title', 'Marketing/Advertising Cookies')}
                  </h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-red-800 text-red-300' : 'bg-red-200 text-red-800'
                }`}>
                  {t('cookies2.types.marketing.status', 'Not Used')}
                </div>
              </div>
              
              <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                {t('cookies2.types.marketing.description', 'CVati does not use marketing or advertising cookies. We do not track you for advertising purposes or share data with advertisers.')}
              </p>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Eye className="w-6 h-6 mr-3 text-yellow-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('cookies2.third_party.title', 'Third-Party Services')}
            </h2>
          </div>

          <div className="space-y-4">
            <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('cookies2.third_party.description', 'When you choose to connect optional services, they may set their own cookies:')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('cookies2.third_party.google_drive.title', 'Google Drive Integration')}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('cookies2.third_party.google_drive.description', 'When you connect Google Drive, Google may set cookies according to their privacy policy.')}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('cookies2.third_party.analytics_service.title', 'Analytics Service')}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('cookies2.third_party.analytics_service.description', 'If enabled, our analytics provider may set cookies to track usage patterns.')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Settings className="w-6 h-6 mr-3 text-purple-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('cookies2.managing.title', 'Managing Your Cookie Preferences')}
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('cookies2.managing.your_choices.title', 'Your Choices')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('cookies2.managing.banner_choice.title', 'Cookie Banner')}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('cookies2.managing.banner_choice.description', 'Accept or decline optional cookies when you first visit CVati.')}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('cookies2.managing.browser_settings.title', 'Browser Settings')}
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('cookies2.managing.browser_settings.description', 'Control cookies through your browser settings - block, delete, or manage all cookies.')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('cookies2.managing.browser_instructions.title', 'Browser-Specific Instructions')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name: 'Chrome', key: 'chrome' },
                  { name: 'Firefox', key: 'firefox' },
                  { name: 'Safari', key: 'safari' },
                  { name: 'Edge', key: 'edge' },
                  { name: 'Opera', key: 'opera' },
                  { name: 'Mobile', key: 'mobile' }
                ].map((browser) => (
                  <div key={browser.key} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {browser.name}
                    </h4>
                    <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t(`cookies2.managing.browsers.${browser.key}`, `Manage cookies in ${browser.name} settings`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Impact of Disabling */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 mr-3 text-orange-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('cookies2.impact.title', 'Impact of Disabling Cookies')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-orange-900/20 border border-orange-700/50' : 'bg-orange-50 border border-orange-200'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                {t('cookies2.impact.essential_disabled.title', 'If Essential Cookies Are Disabled')}
              </h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                <li>• {t('cookies2.impact.essential_disabled.sessions', 'Session management may not work properly')}</li>
                <li>• {t('cookies2.impact.essential_disabled.preferences', 'Your preferences (dark mode, language) won\'t be saved')}</li>
                <li>• {t('cookies2.impact.essential_disabled.cloud_sync', 'Cloud storage sync may be affected')}</li>
              </ul>
            </div>
            
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                {t('cookies2.impact.analytics_disabled.title', 'If Analytics Cookies Are Disabled')}
              </h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                <li>• {t('cookies2.impact.analytics_disabled.functionality', 'All functionality remains fully available')}</li>
                <li>• {t('cookies2.impact.analytics_disabled.improvements', 'We can\'t gather insights to improve the app')}</li>
                <li>• {t('cookies2.impact.analytics_disabled.issues', 'Harder to identify and fix technical issues')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <UserCheck className="w-6 h-6 mr-3 text-indigo-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('cookies2.contact.title', 'Questions About Cookies?')}
            </h2>
          </div>

          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('cookies2.contact.description', 'If you have any questions about our use of cookies or this Cookie Policy, please contact us:')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('cookies2.contact.email.title', 'Email')}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('cookies2.contact.email.address', 'cookies@cvati.com')}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('cookies2.contact.response.title', 'Response Time')}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('cookies2.contact.response.time', 'We respond within 48 hours')}
              </p>
            </div>
          </div>
        </section>

        {/* Updates */}
        <section className={`p-8 rounded-2xl ${
          darkMode ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700/50' : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
        } shadow-xl`}>
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('cookies2.updates.title', 'Cookie Policy Updates')}
            </h2>
            <p className={`text-base mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('cookies2.updates.description', 'We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.')}
            </p>
            
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ${
              darkMode ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'
            } hover:bg-purple-700 transition-all duration-300`}>
              <span className="mr-2">{t('cookies2.updates.stay_informed', 'Stay Informed About Updates')}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;