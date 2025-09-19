import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Eye, 
  Share, 
  Download, 
  Copy, 
  ExternalLink, 
  QrCode,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

// Fix the import - import all functions properly
import { 
  generatePublicURL, 
  estimateQRComplexity 
} from '../../../utils/cvEncoder';

const PublicCVManager = ({ 
  formData, 
  selectedTemplate, 
  customSettings, 
  isDarkMode,
  onPublishSuccess 
}) => {
  const { t } = useTranslation();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publicURL, setPublicURL] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState(null);

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);

    try {
      // Combine form data with customization
      const cvDataToPublish = {
        ...formData,
        customization: {
          template: selectedTemplate,
          accent_color: customSettings.accentColor,
          font_family: customSettings.fontFamily,
          line_spacing: customSettings.lineSpacing,
          headings_uppercase: customSettings.headingsUppercase,
          hide_skill_level: customSettings.hideSkillLevel
        }
      };

      console.log('🚀 Publishing CV data:', cvDataToPublish);

      // Generate public URL
      const url = generatePublicURL(cvDataToPublish);
      console.log('✅ Generated public URL:', url.length, 'characters');
      
      setPublicURL(url);
      
      // Store in localStorage for management
      const publicCVs = JSON.parse(localStorage.getItem('published_cvs') || '[]');
      const newPublicCV = {
        id: Date.now().toString(),
        title: formData.title || 'My Resume',
        url: url,
        created_at: new Date().toISOString(),
        personal_name: formData.personal_info?.full_name || 'Unknown'
      };
      
      publicCVs.push(newPublicCV);
      localStorage.setItem('published_cvs', JSON.stringify(publicCVs));
      
      if (onPublishSuccess) {
        onPublishSuccess(url);
      }

    } catch (err) {
      console.error('❌ Publishing failed:', err);
      setError(err.message || 'Failed to publish CV');
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareURL = async () => {
    if (navigator.share && publicURL) {
      try {
        await navigator.share({
          title: formData.title || 'My Resume',
          text: `Check out ${formData.personal_info?.full_name || 'this'} resume`,
          url: publicURL
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy
      copyToClipboard(publicURL);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `resume-qr-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const openInNewTab = () => {
    if (publicURL) {
      console.log('🔗 Opening URL in new tab:', publicURL);
      window.open(publicURL, '_blank');
    }
  };

  // Get QR complexity info - with error handling
  let qrComplexity = null;
  try {
    qrComplexity = publicURL ? estimateQRComplexity(publicURL) : null;
  } catch (err) {
    console.error('Error estimating QR complexity:', err);
    qrComplexity = { level: 'unknown', description: 'Unable to estimate complexity' };
  }

  return (
    <div className={`p-4 border rounded-lg ${
      isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white/80'
    }`}>
      <h4 className={`font-medium mb-3 flex items-center ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        <QrCode className="w-4 h-4 mr-2" />
        Public CV & QR Code
      </h4>

      {/* Error Display */}
      {error && (
        <div className={`mb-3 p-2 rounded border flex items-center ${
          isDarkMode 
            ? 'bg-red-900/20 border-red-700 text-red-300' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!publicURL && (
        <div className="space-y-3">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Create a public link that anyone can access to view your CV. No account required for viewers.
          </p>
          
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
              isPublishing
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg text-white hover:scale-105'
            }`}
          >
            {isPublishing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Publishing...
              </>
            ) : (
              <>
                <Share className="w-4 h-4 mr-2" />
                Publish CV Publicly
              </>
            )}
          </button>
        </div>
      )}

      {publicURL && (
        <div className="space-y-4">
          <div className={`p-3 rounded border ${
            isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium text-sm flex items-center ${
                isDarkMode ? 'text-green-400' : 'text-green-700'
              }`}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Published Successfully
              </span>
            </div>

            {/* URL Display */}
            <div className="space-y-2">
              <label className={`text-xs font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Public URL ({publicURL.length} characters):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={publicURL}
                  readOnly
                  className={`flex-1 text-xs p-2 rounded border font-mono ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-gray-300' 
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                />
                <button
                  onClick={() => copyToClipboard(publicURL)}
                  className={`p-2 rounded border transition-colors ${
                    copySuccess
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : isDarkMode
                      ? 'border-gray-600 hover:bg-gray-600 text-gray-400'
                      : 'border-gray-300 hover:bg-gray-100 text-gray-600'
                  }`}
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={openInNewTab}
                  className={`p-2 rounded border transition-colors ${
                    isDarkMode
                      ? 'border-gray-600 hover:bg-gray-600 text-gray-400'
                      : 'border-gray-300 hover:bg-gray-100 text-gray-600'
                  }`}
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={shareURL}
                className="flex-1 py-2 px-3 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center justify-center"
              >
                <Share className="w-3 h-3 mr-1" />
                Share
              </button>
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex-1 py-2 px-3 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors flex items-center justify-center"
              >
                <QrCode className="w-3 h-3 mr-1" />
                {showQR ? 'Hide QR' : 'Show QR'}
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          {showQR && (
            <div className={`p-4 rounded border text-center ${
              isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="mb-3">
                <QRCodeCanvas
                  id="qr-canvas"
                  value={publicURL}
                  size={160}
                  level="M"
                  includeMargin={true}
                  className="mx-auto border rounded"
                />
              </div>

              {/* QR Complexity Warning */}
              {qrComplexity && qrComplexity.level !== 'simple' && (
                <div className={`mb-3 p-2 rounded text-xs ${
                  qrComplexity.level === 'very-complex'
                    ? isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
                    : isDarkMode ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  {qrComplexity.description}
                </div>
              )}

              <div className="flex gap-2 justify-center">
                <button
                  onClick={downloadQR}
                  className="py-1 px-3 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download QR
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className={`py-1 px-3 text-xs rounded transition-colors flex items-center ${
                    isDarkMode
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <X className="w-3 h-3 mr-1" />
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Unpublish Button */}
          <button
            onClick={() => {
              setPublicURL(null);
              setShowQR(false);
              // Remove from localStorage
              const publicCVs = JSON.parse(localStorage.getItem('published_cvs') || '[]');
              const updated = publicCVs.filter(cv => cv.url !== publicURL);
              localStorage.setItem('published_cvs', JSON.stringify(updated));
            }}
            className={`w-full py-2 px-4 text-sm rounded transition-colors ${
              isDarkMode
                ? 'bg-red-900/20 text-red-300 hover:bg-red-900/40'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Unpublish CV
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicCVManager;