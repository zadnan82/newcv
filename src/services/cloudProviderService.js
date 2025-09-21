// src/services/cloudProviderService.js
// Updated to support both CVs and Cover Letters across multiple providers

import { API_BASE_URL, COVER_LETTER_ENDPOINTS } from '../config';

// Provider configurations
const PROVIDERS = {
  'google_drive': {
    name: 'Google Drive',
    icon: '📄',
    color: 'bg-blue-500',
    endpoints: {
      CONNECT: `${API_BASE_URL}/api/google-drive/connect`,
      STATUS: `${API_BASE_URL}/api/google-drive/status`,
      SAVE: `${API_BASE_URL}/api/google-drive/save`,
      LIST: `${API_BASE_URL}/api/google-drive/list`,
      LOAD: (fileId) => `${API_BASE_URL}/api/google-drive/load/${fileId}`,
      DELETE: (fileId) => `${API_BASE_URL}/api/google-drive/delete/${fileId}`,
      UPDATE: (fileId) => `${API_BASE_URL}/api/google-drive/update-file/${fileId}`,
      DISCONNECT: `${API_BASE_URL}/api/google-drive/disconnect`,
      DEBUG: `${API_BASE_URL}/api/google-drive/debug`,
      // Cover letter endpoints
      SAVE_COVER_LETTER: `${API_BASE_URL}/api/google-drive/save-cover-letter`,
      LIST_COVER_LETTERS: `${API_BASE_URL}/api/google-drive/list-cover-letters`,
      LOAD_COVER_LETTER: (fileId) => `${API_BASE_URL}/api/google-drive/load-cover-letter/${fileId}`,
      DELETE_COVER_LETTER: (fileId) => `${API_BASE_URL}/api/google-drive/delete-cover-letter/${fileId}`,
      UPDATE_COVER_LETTER: (fileId) => `${API_BASE_URL}/api/google-drive/update-cover-letter/${fileId}`,
    }
  },
  'onedrive': {
    name: 'OneDrive',
    icon: '☁️',
    color: 'bg-purple-500',
    endpoints: {
      CONNECT: `${API_BASE_URL}/api/onedrive/connect`,
      STATUS: `${API_BASE_URL}/api/onedrive/status`,
      SAVE: `${API_BASE_URL}/api/onedrive/save`,
      LIST: `${API_BASE_URL}/api/onedrive/list`,
      LOAD: (fileId) => `${API_BASE_URL}/api/onedrive/load/${fileId}`,
      DELETE: (fileId) => `${API_BASE_URL}/api/onedrive/delete/${fileId}`,
      UPDATE: (fileId) => `${API_BASE_URL}/api/onedrive/update-file/${fileId}`,
      DISCONNECT: `${API_BASE_URL}/api/onedrive/disconnect`,
      DEBUG: `${API_BASE_URL}/api/onedrive/debug`,
      // Cover letter endpoints
      SAVE_COVER_LETTER: `${API_BASE_URL}/api/onedrive/save-cover-letter`,
      LIST_COVER_LETTERS: `${API_BASE_URL}/api/onedrive/list-cover-letters`,
      LOAD_COVER_LETTER: (fileId) => `${API_BASE_URL}/api/onedrive/load-cover-letter/${fileId}`,
      DELETE_COVER_LETTER: (fileId) => `${API_BASE_URL}/api/onedrive/delete-cover-letter/${fileId}`,
      UPDATE_COVER_LETTER: (fileId) => `${API_BASE_URL}/api/onedrive/update-cover-letter/${fileId}`,
    }
  }
};

class CloudProviderService {
  constructor() {
    this.sessionToken = null;
  }

  // Set session token for API calls
  setSessionToken(token) {
    this.sessionToken = token;
  }

  // Get session token from localStorage or store
  getSessionToken() {
    if (this.sessionToken) return this.sessionToken;
    
    const token = localStorage.getItem('cv_session_token');
    if (token) {
      this.sessionToken = token;
      return token;
    }
    
    throw new Error('No session token available');
  }

  // Generic API call method
  async makeApiCall(url, method = 'GET', body = null) {
    const token = this.getSessionToken();
    
    const config = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    console.log(`🔄 ${method} ${url}`);
    
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`❌ API Error: ${response.status}`, errorData);
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    return response.json();
  }

  // Get available providers
  getAvailableProviders() {
    return Object.keys(PROVIDERS);
  }

  // Get provider configuration
  getProviderConfig(provider) {
    if (!PROVIDERS[provider]) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    return PROVIDERS[provider];
  }

  // Check if provider is supported
  isProviderSupported(provider) {
    return provider in PROVIDERS;
  }

  // ================== CV METHODS ==================

  // Generic save method that routes to the correct provider
  async saveCVToProvider(provider, cvData) {
    console.log(`📁 Saving CV to ${provider}...`);
    
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const response = await this.makeApiCall(config.endpoints.SAVE, 'POST', cvData);
      
      if (response.success || response.file_id) {
        console.log(`✅ CV saved to ${provider} successfully`);
        return {
          success: true,
          file_id: response.file_id,
          message: `CV saved to ${config.name} successfully`,
          provider: provider
        };
      } else {
        throw new Error(response.error || 'Save failed');
      }
    } catch (error) {
      console.error(`❌ Save to ${provider} failed:`, error);
      throw new Error(`Failed to save to ${provider}: ${error.message}`);
    }
  }

  // Generic update method that routes to the correct provider
  async updateCVInProvider(provider, fileId, cvData) {
    console.log(`📝 Updating CV in ${provider}...`);
    
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const response = await this.makeApiCall(config.endpoints.UPDATE(fileId), 'PUT', cvData);
      
      if (response.success) {
        console.log(`✅ CV updated in ${provider} successfully`);
        return {
          success: true,
          file_id: fileId,
          message: `CV updated in ${config.name} successfully`,
          provider: provider
        };
      } else {
        throw new Error(response.error || 'Update failed');
      }
    } catch (error) {
      console.error(`❌ Update in ${provider} failed:`, error);
      throw new Error(`Failed to update in ${provider}: ${error.message}`);
    }
  }

  async listCVsFromProvider(provider) {
    console.log(`📋 Listing CVs from ${provider}...`);
    
    try {
      const config = this.getProviderConfig(provider);
      const response = await this.makeApiCall(config.endpoints.LIST);
      
      if (response.files || Array.isArray(response)) {
        const files = response.files || response || [];
        console.log(`✅ Listed ${files.length} CVs from ${provider}`);
        return files.map(file => ({
          ...file,
          provider: provider // Ensure provider is included
        }));
      } else if (response.error && response.error.includes('404')) {
        console.warn(`⚠️ No CVs folder found in ${provider}, returning empty list`);
        return [];
      } else {
        return [];
      }
    } catch (error) {
      if (error.message.includes('404') || error.message.includes('itemNotFound')) {
        console.warn(`⚠️ No CVs found in ${provider}, returning empty list`);
        return [];
      }
      console.error(`❌ List from ${provider} failed:`, error);
      throw new Error(`Failed to list CVs from ${provider}: ${error.message}`);
    }
  }

  // Generic load method that routes to the correct provider
  async loadCVFromProvider(provider, fileId) {
    console.log(`📥 Loading CV from ${provider}...`);
    
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const response = await this.makeApiCall(config.endpoints.LOAD(fileId));
      
      if (response.success && response.cv_data) {
        console.log(`✅ CV loaded from ${provider} successfully`);
        return {
          ...response.cv_data,
          provider: provider
        };
      } else {
        throw new Error(response.error || 'Load failed');
      }
    } catch (error) {
      console.error(`❌ Load from ${provider} failed:`, error);
      throw new Error(`Failed to load CV from ${provider}: ${error.message}`);
    }
  }

  // Generic delete method that routes to the correct provider
  async deleteCVFromProvider(provider, fileId) {
    console.log(`🗑️ Deleting CV from ${provider}...`);
    
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const response = await this.makeApiCall(config.endpoints.DELETE(fileId), 'DELETE');
      
      if (response.success) {
        console.log(`✅ CV deleted from ${provider} successfully`);
        return {
          success: true,
          message: `CV deleted from ${config.name} successfully`,
          provider: provider
        };
      } else {
        throw new Error(response.error || 'Delete failed');
      }
    } catch (error) {
      console.error(`❌ Delete from ${provider} failed:`, error);
      throw new Error(`Failed to delete CV from ${provider}: ${error.message}`);
    }
  }

  // ================== COVER LETTER METHODS ==================

  // Save cover letter to provider
  async saveCoverLetterToProvider(provider, coverLetterData) {
    console.log(`💌 Saving cover letter to ${provider}...`);
    
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const response = await this.makeApiCall(COVER_LETTER_ENDPOINTS.SAVE, 'POST', coverLetterData);
      
      if (response.success || response.file_id) {
        console.log(`✅ Cover letter saved to ${provider} successfully`);
        return {
          success: true,
          file_id: response.file_id,
          message: `Cover letter saved to ${config.name} successfully`,
          provider: provider
        };
      } else {
        throw new Error(response.error || 'Save failed');
      }
    } catch (error) {
      console.error(`❌ Cover letter save to ${provider} failed:`, error);
      throw new Error(`Failed to save cover letter to ${provider}: ${error.message}`);
    }
  }

  // List cover letters from provider
  async listCoverLettersFromProvider(provider) {
    try {
    const response = await fetch(`/api/cover-letter/list?provider=${provider}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.sessionToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.warn(`⚠️ ${provider} returned non-JSON response:`, text.substring(0, 200));
      return []; // Return empty array instead of throwing error
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    const result = await response.json();
    return result.cover_letters || [];
  } catch (error) {
    console.error(`❌ Failed to list cover letters from ${provider}:`, error);
    return []; // Return empty array instead of throwing
  }
}

  // Load cover letter from provider
  async loadCoverLetterFromProvider(provider, fileId) {
    console.log(`📥 Loading cover letter from ${provider}...`);
    
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const response = await this.makeApiCall(config.endpoints.LOAD_COVER_LETTER(fileId));
      
      if (response.success && response.cover_letter_data) {
        console.log(`✅ Cover letter loaded from ${provider} successfully`);
        return {
          ...response.cover_letter_data,
          provider: provider
        };
      } else {
        throw new Error(response.error || 'Load failed');
      }
    } catch (error) {
      console.error(`❌ Load cover letter from ${provider} failed:`, error);
      throw new Error(`Failed to load cover letter from ${provider}: ${error.message}`);
    }
  }

  // Update cover letter in provider
  async updateCoverLetterInProvider(provider, fileId, updateData) {
    console.log(`📝 Updating cover letter in ${provider}...`);
    
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const response = await this.makeApiCall(config.endpoints.UPDATE_COVER_LETTER(fileId), 'PUT', updateData);
      
      if (response.success) {
        console.log(`✅ Cover letter updated in ${provider} successfully`);
        return {
          success: true,
          file_id: fileId,
          message: `Cover letter updated in ${config.name} successfully`,
          provider: provider
        };
      } else {
        throw new Error(response.error || 'Update failed');
      }
    } catch (error) {
      console.error(`❌ Update cover letter in ${provider} failed:`, error);
      throw new Error(`Failed to update cover letter in ${provider}: ${error.message}`);
    }
  }

  // Delete cover letter from provider
  async deleteCoverLetterFromProvider(provider, fileId) {
    console.log(`🗑️ Deleting cover letter from ${provider}...`);
    
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const response = await this.makeApiCall(config.endpoints.DELETE_COVER_LETTER(fileId), 'DELETE');
      
      if (response.success) {
        console.log(`✅ Cover letter deleted from ${provider} successfully`);
        return {
          success: true,
          message: `Cover letter deleted from ${config.name} successfully`,
          provider: provider
        };
      } else {
        throw new Error(response.error || 'Delete failed');
      }
    } catch (error) {
      console.error(`❌ Delete cover letter from ${provider} failed:`, error);
      throw new Error(`Failed to delete cover letter from ${provider}: ${error.message}`);
    }
  }

  // ================== PROVIDER CONNECTION METHODS ==================

  // Connect to any provider
  async connectToProvider(provider) {
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const response = await this.makeApiCall(config.endpoints.CONNECT, 'POST');
      
      if (response.auth_url) {
        // Store OAuth context
        localStorage.setItem('oauth_return_context', JSON.stringify({
          provider,
          action: 'connect_only',
          timestamp: Date.now()
        }));
        
        // Redirect to OAuth
        window.location.href = response.auth_url;
        return { success: true };
      }
      
      throw new Error('No auth URL received');
    } catch (error) {
      console.error(`❌ ${config.name} connection failed:`, error);
      throw new Error(`Failed to connect to ${config.name}: ${error.message}`);
    }
  }

  // Check provider status
  async checkProviderStatus(provider) {
    if (!this.isProviderSupported(provider)) {
      return { 
        connected: false, 
        provider, 
        error: 'Unsupported provider',
        errorType: 'unsupported_provider'
      };
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const status = await this.makeApiCall(config.endpoints.STATUS);
      return { ...status, provider };
    } catch (error) {
      console.error(`❌ ${config.name} status check failed:`, error);
      return { 
        connected: false, 
        provider, 
        error: error.message,
        errorType: 'status_check_failed',
        providerName: config.name
      };
    }
  }

  // Generic disconnect method that routes to the correct provider
  async disconnectFromProvider(provider) {
    console.log(`🔌 Disconnecting from ${provider}...`);
    
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const response = await this.makeApiCall(config.endpoints.DISCONNECT, 'POST');
      
      if (response.success) {
        console.log(`✅ Disconnected from ${provider} successfully`);
        return true;
      } else {
        throw new Error(response.error || 'Disconnect failed');
      }
    } catch (error) {
      console.error(`❌ Disconnect from ${provider} failed:`, error);
      throw new Error(`Failed to disconnect from ${provider}: ${error.message}`);
    }
  }

  // Provider-specific debug method
  async getProviderDebugInfo(provider) {
    console.log(`🔍 Getting debug info for ${provider}...`);
    
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    try {
      const response = await this.makeApiCall(config.endpoints.DEBUG);
      return response;
    } catch (error) {
      console.error(`❌ Debug info failed for ${provider}:`, error);
      throw new Error(`Failed to get debug info from ${provider}: ${error.message}`);
    }
  }

  // Test minimal save for debugging
  async testMinimalSave(provider) {
    console.log(`🧪 Testing minimal save for ${provider}...`);
    
    if (!this.isProviderSupported(provider)) {
      throw new Error(`Provider ${provider} is not supported`);
    }

    const config = this.getProviderConfig(provider);
    
    const testData = {
      title: 'Test CV',
      personal_info: {
        full_name: 'Test User',
        email: 'test@example.com'
      },
      experiences: [],
      educations: [],
      skills: []
    };
    
    try {
      const response = await this.makeApiCall(config.endpoints.SAVE, 'POST', testData);
      
      if (response.success || response.file_id) {
        return {
          success: true,
          file_id: response.file_id,
          message: `Test save to ${config.name} successful`
        };
      } else {
        throw new Error(response.error || 'Test save failed');
      }
    } catch (error) {
      console.error(`❌ Test save to ${provider} failed:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export default new CloudProviderService();