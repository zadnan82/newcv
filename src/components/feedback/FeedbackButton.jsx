import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FeedbackForm from './FeedbackForm';

const FeedbackButton = ({ darkMode, fixed = true, className = '' }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const openFeedback = () => setIsOpen(true);
  const closeFeedback = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openFeedback}
        className={`${
          fixed
            ? 'fixed bottom-4 right-4 z-20 rounded-full shadow-lg p-3 flex items-center justify-center transition-all duration-300 hover:scale-105'
            : `rounded-lg px-4 py-2 ${className}`
        } ${
          darkMode
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-md hover:shadow-purple-500/20 text-white'
        }`}
        // aria-label={t('feedback.open_feedback', 'Open feedback form')}
      >
        {fixed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span>{t('feedback.give_feedback', 'Give Feedback')}</span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={closeFeedback}
            >
              <div className={`absolute inset-0 ${darkMode ? 'bg-black' : 'bg-gray-500'} opacity-75`}></div>
            </div>

            {/* Modal panel */}
            <div className="inline-block align-bottom sm:align-middle sm:max-w-lg sm:w-full w-full max-w-md my-8 overflow-hidden text-left transition-all transform rounded-lg shadow-xl">
              <FeedbackForm darkMode={darkMode} onClose={closeFeedback} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;