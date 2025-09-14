import { useState, useEffect } from 'react';

const DataDeletion = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would implement the actual data deletion request logic
    // This is just a placeholder UI example
    setSubmitted(true);
    setMessage('Your data deletion request has been submitted. We will process your request and contact you at ' + email + ' within 30 days.');
  };
  
  return (
    <div className={`container mx-auto px-4 py-8 max-w-4xl ${
      darkMode ? 'text-gray-200' : 'text-gray-800'
    }`}>
      <h1 className={`text-3xl font-bold mb-6 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>Data Deletion Request</h1>
      
      <div className="space-y-6">
        <section>
          <p className="mb-6">
            Under various privacy regulations, you have the right to request the deletion of your personal data.
            To submit a data deletion request, please fill out the form below. We will process your request and
            respond within 30 days.
          </p>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400'
                  }`}
                  placeholder="Enter your email address"
                />
                <p className="mt-1 text-sm text-gray-500">
                  We will use this email to identify your account and communicate about your request.
                </p>
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-2 font-medium">Additional Information (Optional)</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-400'
                  }`}
                  rows="4"
                  placeholder="Please provide any additional information about your request"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className={`px-6 py-3 rounded font-medium ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Submit Deletion Request
              </button>
            </form>
          ) : (
            <div className={`p-4 rounded ${
              darkMode ? 'bg-green-800' : 'bg-green-100'
            }`}>
              <p className={darkMode ? 'text-green-200' : 'text-green-800'}>
                {message}
              </p>
            </div>
          )}
        </section>
        
        <section>
          <h2 className={`text-xl font-semibold mb-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>What Data Will Be Deleted</h2>
          <p className="mb-3">
            Upon processing your request, we will delete the following data associated with your account:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your account information (name, email, password)</li>
            <li>Resumes and cover letters you've created</li>
            <li>Any saved templates or customizations</li>
            <li>Usage history and preferences</li>
          </ul>
          <p className="mt-3">
            Note that some information may be retained for legal and regulatory purposes, as outlined in our Privacy Policy.
          </p>
        </section>
      </div>
    </div>
  );
};

export default DataDeletion;
