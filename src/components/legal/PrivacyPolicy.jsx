import { useTranslation } from 'react-i18next';

const PrivacyPolicy = ({ darkMode }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-800'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t('privacy.title', 'Privacy Policy')}
        </h1>
        
        <div className="mb-6 text-sm opacity-75 text-center">
          {t('privacy.lastUpdated', 'Last Updated')}: {t('privacy.updateDate', 'April 4, 2025')}
        </div>
        
        <div className={`rounded-lg p-6 mb-8 ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <p className="mb-4">
            {t('privacy.intro', 'CVATI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our resume building service.')}
          </p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('privacy.collection.title', 'Information We Collect')}
              </h2>
              <p className="mb-2">
                {t('privacy.collection.desc', 'We collect personal information that you voluntarily provide to us when you use our service, including:')}
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>{t('privacy.collection.personal', 'Personal details (name, email address, phone number)')}</li>
                <li>{t('privacy.collection.professional', 'Professional information (work experience, skills, education)')}</li>
                <li>{t('privacy.collection.optional', 'Optional information (date of birth, nationality, address, photo)')}</li>
                <li>{t('privacy.collection.account', 'Account credentials')}</li>
                <li>{t('privacy.collection.usage', 'Usage data and interactions with our service')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('privacy.use.title', 'How We Use Your Information')}
              </h2>
              <p className="mb-2">
                {t('privacy.use.desc', 'We use your information for the following purposes:')}
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>{t('privacy.use.provide', 'To provide and maintain our service')}</li>
                <li>{t('privacy.use.improve', 'To improve our service and user experience')}</li>
                <li>{t('privacy.use.communicate', 'To communicate with you about service updates')}</li>
                <li>{t('privacy.use.ai', 'To provide AI-enhanced resume and cover letter generation')}</li>
                <li>{t('privacy.use.security', 'To ensure security and prevent fraud')}</li>
                <li>{t('privacy.use.legal', 'To comply with legal obligations')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('privacy.sharing.title', 'Information Sharing and Disclosure')}
              </h2>
              <p className="mb-2">
                {t('privacy.sharing.desc', 'We may share your information with:')}
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>{t('privacy.sharing.service', 'Service providers (cloud storage, image hosting, analytics)')}</li>
                <li>{t('privacy.sharing.legal', 'Legal authorities when required by law')}</li>
                <li>{t('privacy.sharing.business', 'Business partners with your explicit consent')}</li>
              </ul>
              <p className="mt-2">
                {t('privacy.sharing.note', 'We use Cloudinary for image storage and processing. Your uploaded photos are subject to Cloudinary\'s privacy policy as well.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('privacy.storage.title', 'Data Storage and Security')}
              </h2>
              <p className="mb-2">
                {t('privacy.storage.desc', 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.')}
              </p>
              <p>
                {t('privacy.storage.retention', 'We retain your personal information as long as your account is active or as needed to provide you services. You can request deletion of your data at any time.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('privacy.rights.title', 'Your Data Rights')}
              </h2>
              <p className="mb-2">
                {t('privacy.rights.desc', 'Under the GDPR and other applicable data protection laws, you have rights regarding your personal data, including:')}
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>{t('privacy.rights.access', 'Right to access your personal data')}</li>
                <li>{t('privacy.rights.rectify', 'Right to correct inaccurate data')}</li>
                <li>{t('privacy.rights.delete', 'Right to erasure (\"right to be forgotten\")')}</li>
                <li>{t('privacy.rights.restrict', 'Right to restrict processing')}</li>
                <li>{t('privacy.rights.portability', 'Right to data portability')}</li>
                <li>{t('privacy.rights.object', 'Right to object to processing')}</li>
              </ul>
              <p className="mt-2">
                {t('privacy.rights.exercise', 'To exercise these rights, you can use the account settings in our application or contact us directly.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('privacy.cookies.title', 'Cookies and Similar Technologies')}
              </h2>
              <p>
                {t('privacy.cookies.desc', 'We use cookies and similar tracking technologies to enhance your experience on our website, analyze usage, and assist in our marketing efforts. You can control cookies through your browser settings.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('privacy.ai.title', 'AI-Generated Content')}
              </h2>
              <p>
                {t('privacy.ai.desc', 'Our service uses AI to help generate resume content and cover letters. The data you provide may be processed by our AI systems to generate personalized content. We implement measures to protect your data during AI processing and do not use your personal data to train our AI models without explicit consent.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('privacy.children.title', 'Children\'s Privacy')}
              </h2>
              <p>
                {t('privacy.children.desc', 'Our service is not directed to individuals under the age of 16. If you are aware that a minor has provided us with personal information without parental consent, please contact us.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('privacy.changes.title', 'Changes to This Privacy Policy')}
              </h2>
              <p>
                {t('privacy.changes.desc', 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('privacy.contact.title', 'Contact Us')}
              </h2>
              <p>
                {t('privacy.contact.desc', 'If you have any questions about this Privacy Policy, please contact us at:')}
              </p>
              <p className="mt-2 font-medium">
                {t('privacy.contact.email', 'privacy@cvati.com')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;