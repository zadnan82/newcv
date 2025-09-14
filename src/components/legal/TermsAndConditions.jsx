import { useTranslation } from 'react-i18next';

const TermsAndConditions = ({ darkMode }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-800'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t('terms.title', 'Terms and Conditions')}
        </h1>
        
        <div className="mb-6 text-sm opacity-75 text-center">
          {t('terms.lastUpdated', 'Last Updated')}: {t('terms.updateDate', 'April 4, 2025')}
        </div>
        
        <div className={`rounded-lg p-6 mb-8 ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <p className="mb-6">
            {t('terms.intro', 'Welcome to CVATI. These Terms and Conditions govern your use of our resume building service and website. By accessing or using CVATI, you agree to be bound by these Terms.')}
          </p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.definitions.title', '1. Definitions')}
              </h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>{t('terms.definitions.service', '"Service"')}</strong>: {t('terms.definitions.serviceDesc', 'Refers to the CVATI website and resume building application.')}
                </li>
                <li>
                  <strong>{t('terms.definitions.content', '"Content"')}</strong>: {t('terms.definitions.contentDesc', 'Refers to resumes, cover letters, and any other materials created, uploaded, or generated through our Service.')}
                </li>
                <li>
                  <strong>{t('terms.definitions.user', '"User"')}</strong>: {t('terms.definitions.userDesc', 'Any individual who accesses or uses our Service.')}
                </li>
                <li>
                  <strong>{t('terms.definitions.account', '"Account"')}</strong>: {t('terms.definitions.accountDesc', 'A registered user profile within our Service.')}
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.accounts.title', '2. User Accounts')}
              </h2>
              <p className="mb-3">
                {t('terms.accounts.registration', 'When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for all activities that occur under your account.')}
              </p>
              <p>
                {t('terms.accounts.terminate', 'We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.use.title', '3. Acceptable Use')}
              </h2>
              <p className="mb-3">
                {t('terms.use.desc', 'You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:')}
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>{t('terms.use.false', 'Provide any false or misleading information')}</li>
                <li>{t('terms.use.impersonate', 'Impersonate any person or entity')}</li>
                <li>{t('terms.use.infringe', 'Infringe upon any patents, trademarks, trade secrets, copyrights, or other proprietary rights')}</li>
                <li>{t('terms.use.harmful', 'Upload viruses or other malicious code')}</li>
                <li>{t('terms.use.interfere', 'Interfere with or disrupt the Service or servers')}</li>
                <li>{t('terms.use.automated', 'Use automated methods to access or use the Service')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.content.title', '4. Content Ownership and License')}
              </h2>
              <p className="mb-3">
                {t('terms.content.ownership', 'You retain all ownership rights to any resumes, cover letters, or other content you create through our Service. However, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display your content solely for the purpose of providing and improving our Service.')}
              </p>
              <p>
                {t('terms.content.responsibility', 'You are solely responsible for all content you create, upload, or otherwise make available through the Service. You represent and warrant that you have the right to use all information included in your resumes and that the content does not violate any laws or third-party rights.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.ai.title', '5. AI-Generated Content')}
              </h2>
              <p className="mb-3">
                {t('terms.ai.desc', 'Our Service uses artificial intelligence to assist in creating resumes and cover letters. You acknowledge that:')}
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>{t('terms.ai.accuracy', 'AI-generated content may not always be accurate or appropriate for your specific needs')}</li>
                <li>{t('terms.ai.review', 'You should review and edit all AI-generated content before using it')}</li>
                <li>{t('terms.ai.responsibility', 'You are ultimately responsible for all content in your resume or cover letter, including AI-generated portions')}</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.disclaimer.title', '6. Disclaimer of Warranties')}
              </h2>
              <p className="mb-3">
                {t('terms.disclaimer.desc', 'Our Service is provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.')}
              </p>
              <p>
                {t('terms.disclaimer.success', 'We do not guarantee that our Service will help you secure employment or interviews. The effectiveness of resumes and cover letters depends on many factors beyond our control.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.limitation.title', '7. Limitation of Liability')}
              </h2>
              <p>
                {t('terms.limitation.desc', 'To the maximum extent permitted by law, in no event shall CVATI, its directors, employees, or agents be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including without limitation damages for loss of profits, goodwill, use, data, or other intangible losses, that result from the use of, or inability to use, this Service.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.privacy.title', '8. Privacy Policy')}
              </h2>
              <p>
                {t('terms.privacy.desc', 'Your use of our Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding your personal information.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.termination.title', '9. Termination')}
              </h2>
              <p className="mb-3">
                {t('terms.termination.userRight', 'You may terminate your account at any time by following the instructions in the Service. All your data will be deleted in accordance with our Privacy Policy.')}
              </p>
              <p>
                {t('terms.termination.ourRight', 'We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.changes.title', '10. Changes to Terms')}
              </h2>
              <p>
                {t('terms.changes.desc', 'We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days\' notice prior to any new terms taking effect. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.governing.title', '11. Governing Law')}
              </h2>
              <p>
                {t('terms.governing.desc', 'These Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.')}
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t('terms.contact.title', '12. Contact Us')}
              </h2>
              <p>
                {t('terms.contact.desc', 'If you have any questions about these Terms, please contact us at:')}
              </p>
              <p className="mt-2 font-medium">
                {t('terms.contact.email', 'legal@cvati.com')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;