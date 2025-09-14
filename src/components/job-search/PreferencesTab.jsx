import React from 'react';
import { Settings, X, Bell, Globe } from 'lucide-react';

const PreferencesTab = ({ 
  preferencesForm, 
  setPreferencesForm, 
  savePreferences, 
  loading,
  userResumes,
  selectedResumeId 
}) => {
  // Simplified countries list matching backend tiers
  const SUPPORTED_COUNTRIES = [
    // Tier 1: High reliability
    { code: 'USA', name: 'United States', flag: '🇺🇸', tier: 'Tier 1' },
    { code: 'Canada', name: 'Canada', flag: '🇨🇦', tier: 'Tier 1' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', tier: 'Tier 1' },
    { code: 'Germany', name: 'Germany', flag: '🇩🇪', tier: 'Tier 1' },
    { code: 'Australia', name: 'Australia', flag: '🇦🇺', tier: 'Tier 1' },
    { code: 'Singapore', name: 'Singapore', flag: '🇸🇬', tier: 'Tier 1' },
    
    // Tier 2: Good reliability
    { code: 'France', name: 'France', flag: '🇫🇷', tier: 'Tier 2' },
    { code: 'Netherlands', name: 'Netherlands', flag: '🇳🇱', tier: 'Tier 2' },
    { code: 'Sweden', name: 'Sweden', flag: '🇸🇪', tier: 'Tier 2' },
    { code: 'Norway', name: 'Norway', flag: '🇳🇴', tier: 'Tier 2' },
    { code: 'Denmark', name: 'Denmark', flag: '🇩🇰', tier: 'Tier 2' },
    { code: 'Switzerland', name: 'Switzerland', flag: '🇨🇭', tier: 'Tier 2' },
    { code: 'Austria', name: 'Austria', flag: '🇦🇹', tier: 'Tier 2' },
    { code: 'Belgium', name: 'Belgium', flag: '🇧🇪', tier: 'Tier 2' },
    { code: 'New Zealand', name: 'New Zealand', flag: '🇳🇿', tier: 'Tier 2' },
    
    // Tier 3: Regional coverage
    { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', tier: 'Tier 3' },
    { code: 'Saudi Arabia', name: 'Saudi Arabia', flag: '🇸🇦', tier: 'Tier 3' },
    { code: 'Qatar', name: 'Qatar', flag: '🇶🇦', tier: 'Tier 3' },
    { code: 'Malaysia', name: 'Malaysia', flag: '🇲🇾', tier: 'Tier 3' },
    { code: 'Thailand', name: 'Thailand', flag: '🇹🇭', tier: 'Tier 3' },
    { code: 'Philippines', name: 'Philippines', flag: '🇵🇭', tier: 'Tier 3' },
    { code: 'Indonesia', name: 'Indonesia', flag: '🇮🇩', tier: 'Tier 3' },
    { code: 'Vietnam', name: 'Vietnam', flag: '🇻🇳', tier: 'Tier 3' },
    
    // Tier 4: Basic coverage
    { code: 'Spain', name: 'Spain', flag: '🇪🇸', tier: 'Tier 4' },
    { code: 'Italy', name: 'Italy', flag: '🇮🇹', tier: 'Tier 4' },
    { code: 'Poland', name: 'Poland', flag: '🇵🇱', tier: 'Tier 4' },
    { code: 'Brazil', name: 'Brazil', flag: '🇧🇷', tier: 'Tier 4' },
    { code: 'Mexico', name: 'Mexico', flag: '🇲🇽', tier: 'Tier 4' },
    { code: 'India', name: 'India', flag: '🇮🇳', tier: 'Tier 4' },
    { code: 'Japan', name: 'Japan', flag: '🇯🇵', tier: 'Tier 4' },
    
    // Special
    { code: 'Remote', name: 'Remote Only', flag: '💻', tier: 'Remote' },
  ];

  // Helper functions for form management
  const addArrayItem = (field) => {
    setPreferencesForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setPreferencesForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (field, index) => {
    setPreferencesForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addCountryToPreferences = (countryCode) => {
    if (!preferencesForm.target_countries.includes(countryCode)) {
      setPreferencesForm(prev => ({
        ...prev,
        target_countries: [...prev.target_countries.filter(c => c.trim()), countryCode]
      }));
    }
  };

  const removeCountryFromPreferences = (countryCode) => {
    setPreferencesForm(prev => ({
      ...prev,
      target_countries: prev.target_countries.filter(c => c !== countryCode)
    }));
  };

  const getSelectedResumeName = () => {
    const resume = userResumes.find(r => r.id === selectedResumeId);
    return resume ? (resume.title || `Resume ${resume.id}`) : 'No resume selected';
  };

  const getCountryName = (code) => {
    const country = SUPPORTED_COUNTRIES.find(c => c.code === code);
    return country ? `${country.flag} ${country.name}` : code;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings size={20} />
          Job Search Preferences
        </h3>

        {/* Two-Phase System Info */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Globe size={24} className="text-blue-600" />
            <div>
              <h4 className="font-semibold text-green-800">Two-Phase Global Job Search</h4>
              <p className="text-sm text-green-600">
                Set preferences for automatic job discovery across {SUPPORTED_COUNTRIES.length} countries. Phase 1 (Discovery) is FREE, Phase 2 (AI Analysis) is $0.012/job.
              </p>
            </div>
          </div>
        </div>

        {/* Resume Selection */}
        {selectedResumeId && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Resume for Auto-Search:</strong> {getSelectedResumeName()}
              <br />
              <span className="text-xs">This resume will be used for automatic job matching.</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Roles *
            </label>
            {preferencesForm.target_roles.map((role, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={role}
                  onChange={(e) => updateArrayItem('target_roles', index, e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {preferencesForm.target_roles.length > 1 && (
                  <button
                    onClick={() => removeArrayItem('target_roles', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addArrayItem('target_roles')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add role
            </button>
          </div>

          {/* Target Locations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Locations
            </label>
            {preferencesForm.target_locations.map((location, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => updateArrayItem('target_locations', index, e.target.value)}
                  placeholder="e.g., Dubai, London, Remote"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {preferencesForm.target_locations.length > 1 && (
                  <button
                    onClick={() => removeArrayItem('target_locations', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addArrayItem('target_locations')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add location
            </button>
          </div>
        </div>

        {/* Target Countries */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🌍 Target Countries ({SUPPORTED_COUNTRIES.length} Countries Available)
          </label>
          
          {/* Currently Selected Countries */}
          {preferencesForm.target_countries.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-600 mb-2">Selected Countries:</h5>
              <div className="flex flex-wrap gap-2">
                {preferencesForm.target_countries.filter(c => c.trim()).map((country, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {getCountryName(country)}
                    <button
                      onClick={() => removeCountryFromPreferences(country)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Popular Countries Quick Add */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-600 mb-2">🔥 Popular Markets (Click to Add):</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {[
                { code: 'USA', name: 'USA', flag: '🇺🇸' },
                { code: 'UK', name: 'UK', flag: '🇬🇧' },
                { code: 'Germany', name: 'Germany', flag: '🇩🇪' },
                { code: 'Canada', name: 'Canada', flag: '🇨🇦' },
                { code: 'Australia', name: 'Australia', flag: '🇦🇺' },
                { code: 'Singapore', name: 'Singapore', flag: '🇸🇬' },
                { code: 'UAE', name: 'UAE', flag: '🇦🇪' },
                { code: 'Netherlands', name: 'Netherlands', flag: '🇳🇱' },
                { code: 'Switzerland', name: 'Switzerland', flag: '🇨🇭' },
                { code: 'Sweden', name: 'Sweden', flag: '🇸🇪' },
                { code: 'Remote', name: 'Remote', flag: '💻' },
                { code: 'France', name: 'France', flag: '🇫🇷' },
              ].map(country => {
                const isSelected = preferencesForm.target_countries.includes(country.code);
                return (
                  <button
                    key={country.code}
                    onClick={() => isSelected ? removeCountryFromPreferences(country.code) : addCountryToPreferences(country.code)}
                    className={`p-2 text-center rounded-lg border text-sm transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-lg">{country.flag}</div>
                    <div className="text-xs font-medium">{country.name}</div>
                    {isSelected && <div className="text-xs text-blue-500">✓</div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* All Countries Dropdown */}
          <div>
            <h5 className="text-sm font-medium text-gray-600 mb-2">All Available Countries:</h5>
            <select
              onChange={(e) => {
                if (e.target.value && !preferencesForm.target_countries.includes(e.target.value)) {
                  addCountryToPreferences(e.target.value);
                }
                e.target.value = '';
              }}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value=""
            >
              <option value="">Select a country to add...</option>
              <optgroup label="🏆 Tier 1 - High Coverage">
                {SUPPORTED_COUNTRIES.filter(c => c.tier === 'Tier 1').map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="⭐ Tier 2 - Good Coverage">
                {SUPPORTED_COUNTRIES.filter(c => c.tier === 'Tier 2').map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌟 Tier 3 - Regional Coverage">
                {SUPPORTED_COUNTRIES.filter(c => c.tier === 'Tier 3').map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="📍 Tier 4 - Basic Coverage">
                {SUPPORTED_COUNTRIES.filter(c => c.tier === 'Tier 4').map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="💻 Special">
                <option value="Remote">💻 Remote Only</option>
              </optgroup>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select multiple countries for broader job discovery. Each country uses specialized job sources.
            </p>
          </div>
        </div>

        {/* Target Industries */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Industries
          </label>
          {preferencesForm.target_industries.map((industry, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={industry}
                onChange={(e) => updateArrayItem('target_industries', index, e.target.value)}
                placeholder="e.g., Technology, Healthcare, Finance"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {preferencesForm.target_industries.length > 1 && (
                <button
                  onClick={() => removeArrayItem('target_industries', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addArrayItem('target_industries')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            + Add industry
          </button>
        </div>

        {/* Salary Range */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={preferencesForm.salary_min}
                onChange={(e) => setPreferencesForm(prev => ({ ...prev, salary_min: e.target.value }))}
                placeholder="Min"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="number"
                value={preferencesForm.salary_max}
                onChange={(e) => setPreferencesForm(prev => ({ ...prev, salary_max: e.target.value }))}
                placeholder="Max"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <select
                value={preferencesForm.salary_currency}
                onChange={(e) => setPreferencesForm(prev => ({ ...prev, salary_currency: e.target.value }))}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="AED">د.إ AED</option>
                <option value="SGD">S$ SGD</option>
                <option value="CAD">C$ CAD</option>
                <option value="AUD">A$ AUD</option>
                <option value="CHF">₣ CHF</option>
                <option value="SEK">kr SEK</option>
                <option value="NOK">kr NOK</option>
                <option value="DKK">kr DKK</option>
              </select>
            </div>
          </div>

          {/* Job Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Types
            </label>
            <div className="space-y-2">
              {['full-time', 'part-time', 'contract', 'remote', 'internship'].map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferencesForm.job_types.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPreferencesForm(prev => ({
                          ...prev,
                          job_types: [...prev.job_types, type]
                        }));
                      } else {
                        setPreferencesForm(prev => ({
                          ...prev,
                          job_types: prev.job_types.filter(t => t !== type)
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Levels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Levels
            </label>
            <div className="space-y-2">
              {['entry', 'mid', 'senior', 'lead', 'executive'].map(level => (
                <label key={level} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferencesForm.experience_levels.includes(level)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPreferencesForm(prev => ({
                          ...prev,
                          experience_levels: [...prev.experience_levels, level]
                        }));
                      } else {
                        setPreferencesForm(prev => ({
                          ...prev,
                          experience_levels: prev.experience_levels.filter(l => l !== level)
                        }));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium mb-4 flex items-center gap-2">
            <Bell size={18} />
            Notification Settings
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferencesForm.notification_enabled}
                onChange={(e) => setPreferencesForm(prev => ({ ...prev, notification_enabled: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Notifications</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={preferencesForm.notification_frequency}
                onChange={(e) => setPreferencesForm(prev => ({ ...prev, notification_frequency: e.target.value }))}
                disabled={!preferencesForm.notification_enabled}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="daily">Daily Discovery</option>
                <option value="weekly">Weekly Summary</option>
                <option value="monthly">Monthly Report</option>
              </select>
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferencesForm.email_notifications}
                onChange={(e) => setPreferencesForm(prev => ({ ...prev, email_notifications: e.target.checked }))}
                disabled={!preferencesForm.notification_enabled}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
            </label>
          </div>
        </div>

        {/* Search Status */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferencesForm.search_active}
              onChange={(e) => setPreferencesForm(prev => ({ ...prev, search_active: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              🌍 Enable Automatic Job Search
              <span className="block text-xs text-gray-500">
                Automatically discover jobs across {preferencesForm.target_countries.filter(c => c.trim()).length || 'selected'} countries
              </span>
            </span>
          </label>
        </div>

        <button
          onClick={savePreferences}
          disabled={loading}
          className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Settings size={16} />
          )}
          {loading ? 'Saving Preferences...' : '🌍 Save Global Preferences'}
        </button>

        {/* Preferences Summary */}
        {preferencesForm.target_countries.filter(c => c.trim()).length > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">Configuration Summary:</h5>
            <div className="text-sm text-green-700">
              <p>🎯 Active in: {preferencesForm.target_countries.filter(c => c.trim()).map(c => getCountryName(c)).join(', ')}</p>
              <p>🔍 Searching for: {preferencesForm.target_roles.filter(r => r.trim()).join(', ') || 'All roles'}</p>
              <p>💰 Salary range: {preferencesForm.salary_min || 'Any'} - {preferencesForm.salary_max || 'Any'} {preferencesForm.salary_currency}</p>
              <p>📧 Notifications: {preferencesForm.notification_enabled ? preferencesForm.notification_frequency : 'Disabled'}</p>
              <p>🤖 Two-Phase System: Discovery (FREE) + AI Analysis ($0.012/job)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferencesTab;