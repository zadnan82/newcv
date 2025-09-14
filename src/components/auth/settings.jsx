import { useState, useEffect } from 'react';
import Alert from '../shared/Alert';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';
import API_BASE_URL, { AUTH_ENDPOINTS } from '../../config';

const Settings = ({ darkMode }) => {
  const { t, i18n } = useTranslation();
  const { token, user, logout } = useAuthStore(); // Get auth data from store
  const [loading, setLoading] = useState(false);
  const [downloadingData, setDownloadingData] = useState(false);
  const [status, setStatus] = useState({ error: '', success: '' });
  const [showDelete, setShowDelete] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deletionReason, setDeletionReason] = useState('');
  const [password, setPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ error: '', success: '' });
 
  useEffect(() => {
    setStatus({ error: '', success: '' });
    setPasswordStatus({ error: '', success: '' });
  }, [i18n.language]);
 
  const handleDownloadData = async () => {
    if (!token) {
      setStatus({ error: t('settings.not_authenticated', 'You must be logged in'), success: '' });
      return;
    }

    setDownloadingData(true);
    setStatus({ error: '', success: '' });

    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const res = await fetch(`${API_BASE_URL}/auth/export-data?_t=${timestamp}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      }); 
      
      if (!res.ok) {
        console.error("Download failed with status:", res.status);
        throw new Error(`HTTP error: ${res.status}`);
      }
      
      const blob = await res.blob(); 
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'my-account-data.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setStatus({ error: '', success: t('settings.data_downloaded', 'Data downloaded successfully') });
    } catch (error) {
      console.error("Download error:", error);
      setStatus({ error: t('settings.download_failed', 'Failed to download data'), success: '' });
    } finally {
      setDownloadingData(false);
    }
  };

  const handleDelete = async () => {
    if (!token) {
      setStatus({ error: t('settings.not_authenticated', 'You must be logged in'), success: '' });
      return;
    }

    if (confirmText !== 'DELETE') {
      setStatus({ error: t('settings.type_delete', 'Please type DELETE to confirm'), success: '' });
      return;
    }

    if (!password) {
      setStatus({ error: t('settings.password_required', 'Please enter your password to confirm deletion'), success: '' });
      return;
    }

    setLoading(true);
    setStatus({ error: '', success: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/auth/user`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: password,
          deletion_reason: deletionReason || 'Not specified',
          delete_all_data: true
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to delete account');
      }
      
      setStatus({ error: '', success: t('settings.account_deleted', 'Account deleted successfully') });
      
      // Use the logout function from auth store
      setTimeout(() => {
        logout();
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Delete account error:', error);
      setStatus({ error: error.message || t('settings.delete_failed', 'Failed to delete account'), success: '' });
    } finally {
      setLoading(false);
    }
  };
 
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus({ error: '', success: '' });

    // Basic validation
    if (!currentPassword) {
      setPasswordStatus({ 
        error: t('settings.current_password_required', 'Current password is required'), 
        success: '' 
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ 
        error: t('settings.passwords_not_match', 'Passwords do not match'), 
        success: '' 
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({ 
        error: t('settings.password_too_short', 'Password must be at least 8 characters long'), 
        success: '' 
      });
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /[0-9]/.test(newPassword);

    if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
      setPasswordStatus({ 
        error: t('settings.password_requirements', 'Password must contain uppercase, lowercase, and numeric characters'), 
        success: '' 
      });
      return;
    }

    setChangingPassword(true);

    try {
      const res = await fetch(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
          logout_all_devices: logoutAllDevices,
          current_token: token
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to change password');
      }
      
      setPasswordStatus({ 
        error: '', 
        success: t('settings.password_changed', 'Password changed successfully') 
      });
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // If user chose to log out all devices, we will be logged out too
      if (logoutAllDevices) {
        setTimeout(() => {
          logout();
          window.location.href = '/login';
        }, 2000);
      }
    } catch (error) {
      console.error('Change password error:', error);
      setPasswordStatus({ 
        error: error.message || t('settings.change_password_failed', 'Failed to change password'), 
        success: '' 
      });
    } finally {
      setChangingPassword(false);
    }
  };
 
  const resetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setLogoutAllDevices(false);
    setPasswordStatus({ error: '', success: '' });
    setShowChangePassword(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20'}`}>
      {/* Background Elements - decorative elements similar to cards but more subtle */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -left-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute top-0 -right-48 w-72 h-72 rounded-full bg-pink-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 left-48 w-72 h-72 rounded-full bg-blue-600/20 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-48 right-48 w-72 h-72 rounded-full bg-purple-600/20 mix-blend-multiply filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-10">
        <div className={`border-b pb-4 mb-6 ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>
          <h1 className="text-2xl font-bold">{t('settings.title', 'Settings')}</h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('settings.subtitle', 'Manage your account and privacy settings')}
          </p>
        </div>

        {status.error && <Alert variant="destructive">{status.error}</Alert>}
        {status.success && <Alert variant="success">{status.success}</Alert>}

        {/* Check if token is missing */}
        {!token && (
          <Alert variant="warning">
            {t('settings.not_logged_in', 'You are not logged in. Please log in to access your settings.')}
          </Alert>
        )}

        <section className={`p-4 rounded-xl shadow-md backdrop-blur-sm border border-white/10 mb-4 ${
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        }`}>
          <h2 className="text-lg font-semibold mb-3">{t('settings.profile_info', 'Profile Information')}</h2>
          {user ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <p>
                  <strong className="text-sm">{t('auth.register.first_name', 'First Name')}:</strong> {user.first_name}
                </p>
                <p>
                  <strong className="text-sm">{t('auth.register.last_name', 'Last Name')}:</strong> {user.last_name}
                </p>
              </div>
              <p>
                <strong className="text-sm">{t('auth.login.email', 'Email')}:</strong> {user.email}
              </p>
            </div>
          ) : (
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {t('settings.loading_user', 'Loading user information...')}
            </p>
          )}
        </section>

        {/* Password Change Section */}
        <section className={`p-4 rounded-xl shadow-md backdrop-blur-sm border border-white/10 mb-4 ${
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        }`}>
          <h2 className="text-lg font-semibold mb-3">{t('settings.security', 'Security')}</h2>
          
          {!showChangePassword ? (
            <button 
              onClick={() => setShowChangePassword(true)} 
              disabled={!token}
              className={`px-4 py-2 rounded-md text-sm ${
                !token 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-md hover:shadow-purple-500/20 hover:scale-102'
              } text-white shadow-md transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100`}
            >
              {t('settings.change_password', 'Change Password')}
            </button>
          ) : (
            <div className="space-y-3">
              {passwordStatus.error && <Alert variant="destructive">{passwordStatus.error}</Alert>}
              {passwordStatus.success && <Alert variant="success">{passwordStatus.success}</Alert>}
              
              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">{t('settings.current_password', 'Current Password')}</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`w-full rounded-md border p-2 text-sm ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                        : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">{t('settings.new_password', 'New Password')}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full rounded-md border p-2 text-sm ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                        : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                    }`}
                    required
                    minLength={8}
                  />
                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('settings.password_hint', 'Must be at least 8 characters with uppercase, lowercase, and numbers')}
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">{t('settings.confirm_password', 'Confirm New Password')}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full rounded-md border p-2 text-sm ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                        : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                    }`}
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="logoutDevices"
                    checked={logoutAllDevices}
                    onChange={(e) => setLogoutAllDevices(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="logoutDevices" className="text-xs">
                    {t('settings.logout_all_devices', 'Log out from all devices')}
                  </label>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-4 py-2 rounded-md text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-md transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20 hover:scale-102 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {changingPassword 
                      ? t('settings.updating', 'Updating...') 
                      : t('settings.update_password', 'Update Password')}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetPasswordForm}
                    className={`px-4 py-2 rounded-md text-sm shadow-md transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    {t('common.cancel', 'Cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        {/* Data Privacy & Controls section - GDPR focused */}
        <section className={`p-4 rounded-xl shadow-md backdrop-blur-sm border border-white/10 mb-4 ${
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        }`}>
          <h2 className="text-lg font-semibold mb-3">{t('settings.data_privacy', 'Data Privacy & Controls')}</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-sm">{t('settings.data_portability', 'Data Portability')}</h3>
              <p className={`mb-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('settings.data_portability_desc', 'Download a copy of your personal data in a machine-readable format.')}
              </p>
              <button 
                onClick={handleDownloadData} 
                disabled={downloadingData || !token}
                className={`px-4 py-2 rounded-md text-sm ${
                  !token 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-md hover:shadow-purple-500/20 hover:scale-102'
                } text-white shadow-md transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100`}
              >
                {downloadingData 
                  ? t('settings.downloading', 'Downloading...') 
                  : t('settings.download_data', 'Download My Data')}
              </button>
            </div>
          </div>
        </section>

        <section className={`p-4 rounded-xl shadow-md backdrop-blur-sm border border-red-300/50 mb-4 ${
          darkMode ? 'bg-gray-800/80' : 'bg-white/80'
        }`}>
          <h2 className="text-lg font-semibold text-red-500 mb-3">
            {t('settings.danger_zone', 'Danger Zone')}
          </h2>
          {!showDelete ? (
            <button 
              onClick={() => setShowDelete(true)} 
              disabled={!token}
              className={`px-4 py-2 rounded-md text-sm ${
                !token 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-md hover:shadow-red-500/20 hover:scale-102'
              } text-white shadow-md transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100`}
            >
              {t('settings.delete_account', 'Delete My Account')}
            </button>
          ) : (
            <div className="space-y-3">
              <Alert variant="warning">
                <p className="text-sm">{t('settings.permanent_warning', 'This action cannot be undone. Your account will be permanently deleted.')}</p>
                <ul className="list-disc ml-5 mt-2 text-xs">
                  <li>{t('settings.delete_warning_1', 'All your personal information will be deleted')}</li>
                  <li>{t('settings.delete_warning_2', 'All your resumes and cover letters will be removed')}</li>
                  <li>{t('settings.delete_warning_3', 'You will lose access to all saved content')}</li>
                </ul>
              </Alert>
              
              {/* Offer data download before deletion */}
              <div className="p-3 bg-blue-50/70 text-blue-800 rounded-md border border-blue-200 text-sm">
                <p>{t('settings.download_before_delete', 'We recommend downloading your data before deleting your account.')}</p>
                <button 
                  onClick={handleDownloadData}
                  disabled={downloadingData || !token}
                  className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-md hover:shadow-sm hover:shadow-blue-500/20 transition-all duration-300"
                >
                  {downloadingData 
                    ? t('settings.downloading', 'Downloading...') 
                    : t('settings.download_data', 'Download My Data')}
                </button>
              </div>
              
              {/* Password confirmation */}
              <div>
                <label className="block text-xs font-medium mb-1">{t('settings.enter_pass', 'Enter your password:')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('settings.your_pass', 'Your password')}
                  className={`w-full rounded-md border p-2 text-sm ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                      : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                  }`}
                />
              </div>
              
              {/* Optional feedback on why they're deleting */}
              <div>
                <label className="block text-xs font-medium mb-1">{t('settings.deletion_reason', 'Reason for leaving (optional):')}</label>
                <select
                  value={deletionReason}
                  onChange={(e) => setDeletionReason(e.target.value)}
                  className={`w-full rounded-md border p-2 text-sm ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                      : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                  }`}
                >
                  <option value="">{t('settings.select_reason', 'Select a reason')}</option>
                  <option value="no_longer_needed">{t('settings.reason_no_longer_needed', 'No longer need the service')}</option>
                  <option value="dissatisfied">{t('settings.reason_dissatisfied', 'Dissatisfied with the service')}</option>
                  <option value="privacy_concerns">{t('settings.reason_privacy', 'Privacy concerns')}</option>
                  <option value="other">{t('settings.reason_other', 'Other reason')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium mb-1">
                  {t('settings.confirm_delete_prompt', 'Type DELETE to confirm account deletion:')}
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={t('settings.type_delete', 'Type DELETE')}
                  className={`w-full rounded-md border p-2 text-sm ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500' 
                      : 'bg-white/90 border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                  }`}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-md text-sm bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-md transition-all duration-300 hover:shadow-md hover:shadow-red-500/20 hover:scale-102 disabled:opacity-50 disabled:hover:scale-100"
                  disabled={loading || !token}
                >
                  {loading 
                    ? t('settings.deleting', 'Deleting...') 
                    : t('settings.confirm_delete', 'Confirm Delete')}
                </button>
                <button 
                  onClick={() => { 
                    setShowDelete(false); 
                    setConfirmText(''); 
                    setDeletionReason('');
                    setPassword('');
                    setStatus({ error: '', success: '' });
                  }} 
                  className={`px-4 py-2 rounded-md text-sm shadow-md transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  {t('common.cancel', 'Cancel')}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Settings;