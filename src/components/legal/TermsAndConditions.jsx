import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, FileText, AlertTriangle, Users, Globe, Shield, Gavel, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';

const TermsConditions = ({ darkMode }) => {
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
              <Scale className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600`}>
            {t('terms.title', 'Terms and Conditions')}
          </h1>
          
          <p className={`text-base md:text-lg max-w-2xl mx-auto mb-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('terms.subtitle', 'Clear terms for using CVati. Your rights, our responsibilities, and what to expect.')}
          </p>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            darkMode ? 'bg-green-900/30 text-green-400 border border-green-700/50' : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            <UserCheck className="w-4 h-4 mr-2" />
            {t('terms.effective_date', 'Effective Date')}: {t('terms.date', 'December 2024')}
          </div>
        </header>

        {/* Agreement Notice */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'
        } shadow-xl`}>
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 mr-3 text-blue-600" />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
              {t('terms.agreement.title', 'Agreement to Terms')}
            </h2>
          </div>
          <p className={`text-base ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            {t('terms.agreement.content', 'By accessing and using CVati, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.')}
          </p>
        </section>

        {/* Service Description */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 mr-3 text-purple-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('terms.service.title', 'Service Description')}
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.service.what_we_provide.title', 'What We Provide')}
              </h3>
              <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• {t('terms.service.cv_builder', 'Professional CV/resume building tools')}</li>
                <li>• {t('terms.service.templates', 'Multiple customizable templates')}</li>
                <li>• {t('terms.service.local_storage', 'Local storage capabilities')}</li>
                <li>• {t('terms.service.cloud_integration', 'Optional cloud storage integration')}</li>
                <li>• {t('terms.service.export_features', 'Export and download features')}</li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.service.no_signup.title', 'No Registration Required')}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('terms.service.no_signup.description', 'CVati operates on a no-signup model. You can use all core features immediately without creating an account. Cloud storage connection is optional and user-controlled.')}
              </p>
            </div>
          </div>
        </section>

        {/* User Responsibilities */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 mr-3 text-pink-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('terms.responsibilities.title', 'User Responsibilities')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.responsibilities.acceptable_use.title', 'Acceptable Use')}
              </h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• {t('terms.responsibilities.lawful_use', 'Use the service for lawful purposes only')}</li>
                <li>• {t('terms.responsibilities.accurate_info', 'Provide accurate information in your CVs')}</li>
                <li>• {t('terms.responsibilities.no_harmful_content', 'Do not upload harmful or offensive content')}</li>
                <li>• {t('terms.responsibilities.respect_others', 'Respect intellectual property rights')}</li>
              </ul>
            </div>
            
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.responsibilities.prohibited.title', 'Prohibited Activities')}
              </h3>
              <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• {t('terms.responsibilities.no_reverse_engineering', 'Reverse engineering or copying the service')}</li>
                <li>• {t('terms.responsibilities.no_automated_access', 'Automated data collection or scraping')}</li>
                <li>• {t('terms.responsibilities.no_interference', 'Interfering with service operations')}</li>
                <li>• {t('terms.responsibilities.no_malicious_use', 'Using the service for malicious purposes')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data and Privacy */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 mr-3 text-blue-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('terms.data_privacy.title', 'Data and Privacy')}
            </h2>
          </div>

          <div className="space-y-6">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                {t('terms.data_privacy.ownership.title', 'Your Data Ownership')}
              </h3>
              <p className={`${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                {t('terms.data_privacy.ownership.description', 'You retain full ownership and control of all content you create using CVati. We do not claim any rights to your CV content, personal information, or uploaded materials.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('terms.data_privacy.local_storage.title', 'Local Storage')}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('terms.data_privacy.local_storage.description', 'Data stored locally remains on your device and is not transmitted to our servers.')}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('terms.data_privacy.cloud_storage.title', 'Cloud Storage')}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('terms.data_privacy.cloud_storage.description', 'Cloud storage is optional and uses your own Google Drive account with revocable permissions.')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Availability */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 mr-3 text-yellow-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('terms.availability.title', 'Service Availability')}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.availability.uptime.title', 'Service Uptime')}
              </h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('terms.availability.uptime.description', 'We strive to maintain high service availability but cannot guarantee 100% uptime. Scheduled maintenance will be announced in advance when possible.')}
              </p>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.availability.local_functionality.title', 'Local Functionality')}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('terms.availability.local_functionality.description', 'Core CV building features work locally on your device and do not require internet connectivity. Cloud features require internet access.')}
              </p>
            </div>
          </div>
        </section>

        {/* Limitations and Disclaimers */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('terms.limitations.title', 'Limitations and Disclaimers')}
            </h2>
          </div>

          <div className="space-y-6">
            <div className={`p-6 rounded-lg border-2 ${
              darkMode ? 'bg-red-900/20 border-red-700/50' : 'bg-red-50 border-red-200'
            }`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-red-400' : 'text-red-800'}`}>
                {t('terms.limitations.warranty.title', 'No Warranty')}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                {t('terms.limitations.warranty.description', 'CVati is provided "as is" without any warranties, express or implied. We do not guarantee that the service will be error-free, secure, or continuously available.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('terms.limitations.liability.title', 'Limitation of Liability')}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('terms.limitations.liability.description', 'We are not liable for any damages arising from the use or inability to use our service.')}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('terms.limitations.third_party.title', 'Third-Party Services')}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('terms.limitations.third_party.description', 'Integration with third-party services (like Google Drive) is subject to their terms and availability.')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Modifications */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 mr-3 text-purple-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('terms.modifications.title', 'Modifications to Service and Terms')}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.modifications.service_changes.title', 'Service Changes')}
              </h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('terms.modifications.service_changes.description', 'We reserve the right to modify, suspend, or discontinue any part of the service at any time. We will provide reasonable notice of significant changes when possible.')}
              </p>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.modifications.terms_changes.title', 'Terms Changes')}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('terms.modifications.terms_changes.description', 'These terms may be updated from time to time. Continued use of the service after changes constitutes acceptance of the new terms.')}
              </p>
            </div>
          </div>
        </section>

        {/* Termination */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Gavel className="w-6 h-6 mr-3 text-red-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('terms.termination.title', 'Termination')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.termination.by_user.title', 'Termination by You')}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('terms.termination.by_user.description', 'You may stop using the service at any time. Your locally stored data remains on your device. You can revoke cloud storage permissions independently.')}
              </p>
            </div>
            
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.termination.by_us.title', 'Termination by Us')}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('terms.termination.by_us.description', 'We may restrict access if terms are violated. We will provide notice when possible and reasonable time to retrieve your data.')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact and Governing Law */}
        <section className={`mb-12 p-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/90 border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center mb-6">
            <Scale className="w-6 h-6 mr-3 text-indigo-600" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('terms.legal.title', 'Legal Information')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.legal.contact.title', 'Contact Information')}
              </h3>
              <div className="space-y-2 text-sm">
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>{t('terms.legal.contact.email.label', 'Email')}:</strong> {t('terms.legal.contact.email.address', 'legal@cvati.com')}
                </p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>{t('terms.legal.contact.response.label', 'Response Time')}:</strong> {t('terms.legal.contact.response.time', 'Within 48 hours')}
                </p>
              </div>
            </div>
            
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('terms.legal.governing_law.title', 'Governing Law')}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('terms.legal.governing_law.description', 'These terms are governed by and construed in accordance with applicable laws. Any disputes will be resolved through appropriate legal channels.')}
              </p>
            </div>
          </div>
        </section>

        {/* Acceptance */}
        <section className={`p-8 rounded-2xl ${
          darkMode ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-700/50' : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
        } shadow-xl`}>
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('terms.acceptance.title', 'Acceptance of Terms')}
            </h2>
            <p className={`text-base mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('terms.acceptance.description', 'By using CVati, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.')}
            </p>
            
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className={`w-6 h-6 mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                {t('terms.acceptance.effective', 'These terms are effective immediately upon your use of the service')}
              </span>
            </div>
            
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ${
              darkMode ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'
            } hover:bg-purple-700 transition-all duration-300`}>
              <span className="mr-2">{t('terms.acceptance.questions', 'Questions About These Terms?')}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;