import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Database, Eye, Settings, FileText, Cloud, HardDrive, UserCheck, ArrowRight } from 'lucide-react';

const PrivacyPolicy = ({ darkMode }) => {
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
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600`}>
            {t('privacy.title', 'Privacy Policy')}
          </h1>
          
          <p className={`text-base md:text-lg max-w-2xl mx-auto mb-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('privacy.subtitle', 'Your privacy matters. Learn how we handle your data with transparency and care.')}
          </p>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            darkMode ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            <UserCheck className="w-4 h-4 mr-2" />
            {t('privacy.last_updated', 'Last Updated')}: {t('privacy.date', 'December 2024')}
          </div>
        </header>

        {/* Introduction */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('privacy.introduction.title', 'Introduction')}
          </h2>
          <p className={`text-base mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('privacy.introduction.content', 'Welcome to CVati. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our CV/resume building application and services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.')}
          </p>
        </section>

        {/* Information Collection */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Database className="w-6 h-6 mr-3 text-purple-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('privacy.collection.title', 'Information We Collect')}
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('privacy.collection.personal.title', 'Personal Information You Provide')}
              </h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('privacy.collection.personal.description', 'When you use our Service, we may collect the following personal information that you voluntarily provide:')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('privacy.collection.cv_content', 'CV/Resume Content')}
                  </h4>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• {t('privacy.collection.personal_info', 'Personal information (name, email, phone, address)')}</li>
                    <li>• {t('privacy.collection.professional_info', 'Professional information (work experience, education, skills)')}</li>
                    <li>• {t('privacy.collection.personal_details', 'Personal details (date of birth, nationality)')}</li>
                    <li>• {t('privacy.collection.photos', 'Profile photos and images')}</li>
                    <li>• {t('privacy.collection.references', 'References and contact information')}</li>
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('privacy.collection.account_info', 'Account Information')}
                  </h4>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• {t('privacy.collection.session_tokens', 'Session tokens for authentication')}</li>
                    <li>• {t('privacy.collection.preferences', 'User preferences and settings')}</li>
                    <li>• {t('privacy.collection.usage_data', 'Application usage data')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('privacy.collection.automatic.title', 'Automatically Collected Information')}
              </h3>
              <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• {t('privacy.collection.device_info', 'Device information (browser type, operating system)')}</li>
                <li>• {t('privacy.collection.analytics', 'Usage analytics and application performance data')}</li>
                <li>• {t('privacy.collection.session_data', 'Session data and authentication tokens')}</li>
                <li>• {t('privacy.collection.local_storage', 'Local storage data for offline functionality')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Settings className="w-6 h-6 mr-3 text-pink-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('privacy.usage.title', 'How We Use Your Information')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('privacy.usage.primary.title', 'Primary Services')}
              </h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• {t('privacy.usage.cv_creation', 'CV creation and editing')}</li>
                <li>• {t('privacy.usage.template_application', 'Template application and customization')}</li>
                <li>• {t('privacy.usage.data_storage', 'Data storage (local and cloud)')}</li>
                <li>• {t('privacy.usage.document_generation', 'Document generation and export')}</li>
              </ul>
            </div>
            
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('privacy.usage.service.title', 'Service Improvement')}
              </h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• {t('privacy.usage.app_improvement', 'Application improvement and optimization')}</li>
                <li>• {t('privacy.usage.technical_support', 'Technical support and troubleshooting')}</li>
                <li>• {t('privacy.usage.security', 'Security and fraud prevention')}</li>
                <li>• {t('privacy.usage.analytics', 'Usage analytics (anonymized)')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Storage */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <HardDrive className="w-6 h-6 mr-3 text-blue-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('privacy.storage.title', 'Data Storage Options')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg border-2 ${
              darkMode ? 'bg-gray-700/50 border-purple-500/30' : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="flex items-center mb-3">
                <HardDrive className="w-5 h-5 mr-2 text-purple-600" />
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('privacy.storage.local.title', 'Local Storage (Default)')}
                </h3>
              </div>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• {t('privacy.storage.local.device_only', 'Data stays on your device only')}</li>
                <li>• {t('privacy.storage.local.no_transmission', 'No data transmission to our servers')}</li>
                <li>• {t('privacy.storage.local.full_privacy', 'Complete privacy and control')}</li>
                <li>• {t('privacy.storage.local.browser_storage', 'Uses browser local storage')}</li>
              </ul>
            </div>
            
            <div className={`p-6 rounded-lg border-2 ${
              darkMode ? 'bg-gray-700/50 border-blue-500/30' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center mb-3">
                <Cloud className="w-5 h-5 mr-2 text-blue-600" />
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('privacy.storage.cloud.title', 'Cloud Storage (Optional)')}
                </h3>
              </div>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• {t('privacy.storage.cloud.google_drive', 'Google Drive integration')}</li>
                <li>• {t('privacy.storage.cloud.encrypted', 'Data encrypted in transit and at rest')}</li>
                <li>• {t('privacy.storage.cloud.user_control', 'User-controlled connection')}</li>
                <li>• {t('privacy.storage.cloud.revocable', 'Permissions revocable anytime')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Sharing */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Eye className="w-6 h-6 mr-3 text-green-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('privacy.sharing.title', 'Data Sharing and Disclosure')}
            </h2>
          </div>

          <div className={`p-6 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'}`}>
            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
              {t('privacy.sharing.no_selling.title', 'We Do Not Sell Your Data')}
            </h3>
            <p className={`mb-4 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
              {t('privacy.sharing.no_selling.description', 'We never sell, rent, or trade your personal information to third parties. Your CV data remains private and under your control.')}
            </p>
          </div>

          <div className="mt-6">
            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('privacy.sharing.limited.title', 'Limited Sharing Scenarios')}
            </h3>
            <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• {t('privacy.sharing.legal_compliance', 'Legal compliance when required by law')}</li>
              <li>• {t('privacy.sharing.security_protection', 'Protection of our rights and security')}</li>
              <li>• {t('privacy.sharing.service_providers', 'Trusted service providers (with strict agreements)')}</li>
              <li>• {t('privacy.sharing.user_consent', 'With your explicit consent only')}</li>
            </ul>
          </div>
        </section>

        {/* Your Rights */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Lock className="w-6 h-6 mr-3 text-yellow-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('privacy.rights.title', 'Your Rights and Choices')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('privacy.rights.access.title', 'Access and Control')}
              </h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• {t('privacy.rights.access.view', 'View all your stored data')}</li>
                <li>• {t('privacy.rights.access.edit', 'Edit or update your information')}</li>
                <li>• {t('privacy.rights.access.delete', 'Delete your data anytime')}</li>
                <li>• {t('privacy.rights.access.export', 'Export your data (portability)')}</li>
              </ul>
            </div>
            
            <div>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('privacy.rights.storage.title', 'Storage Choices')}
              </h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• {t('privacy.rights.storage.local_only', 'Keep data local only')}</li>
                <li>• {t('privacy.rights.storage.cloud_connect', 'Connect/disconnect cloud storage')}</li>
                <li>• {t('privacy.rights.storage.revoke', 'Revoke cloud permissions')}</li>
                <li>• {t('privacy.rights.storage.migrate', 'Migrate between storage options')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 mr-3 text-red-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('privacy.security.title', 'Security Measures')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('privacy.security.encryption.title', 'Encryption')}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('privacy.security.encryption.description', 'All data transmission uses HTTPS encryption')}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('privacy.security.access.title', 'Access Control')}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('privacy.security.access.description', 'Secure authentication and session management')}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('privacy.security.monitoring.title', 'Monitoring')}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('privacy.security.monitoring.description', 'Continuous security monitoring and updates')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 mr-3 text-indigo-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('privacy.contact.title', 'Contact Us')}
            </h2>
          </div>

          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('privacy.contact.description', 'If you have any questions about this Privacy Policy or our data practices, please contact us:')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('privacy.contact.email.title', 'Email')}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('privacy.contact.email.address', 'privacy@cvati.com')}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('privacy.contact.response.title', 'Response Time')}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('privacy.contact.response.time', 'We respond within 48 hours')}
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
              {t('privacy.updates.title', 'Policy Updates')}
            </h2>
            <p className={`text-base mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('privacy.updates.description', 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.')}
            </p>
            
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ${
              darkMode ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'
            } hover:bg-purple-700 transition-all duration-300`}>
              <span className="mr-2">{t('privacy.updates.notification', 'Get Notified of Updates')}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;