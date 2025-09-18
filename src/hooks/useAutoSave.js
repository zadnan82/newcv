// src/hooks/useAutoSave.js - NEW FILE (doesn't modify existing code)
import { useEffect, useRef } from 'react';

/**
 * Auto-save hook that saves CV data to localStorage on every change
 * This ensures user never loses their work
 */
const useAutoSave = (formData, options = {}) => {
  const {
    key = 'cv_draft_autosave', // Different key from existing cv_draft to avoid conflicts
    debounceMs = 300, // Small delay to avoid excessive saves
    enabled = true
  } = options;
  
  const timeoutRef = useRef(null);
  const previousDataRef = useRef(null);

  useEffect(() => {
    if (!enabled || !formData) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if data actually changed to avoid unnecessary saves
    const currentDataString = JSON.stringify(formData);
    if (currentDataString === previousDataRef.current) {
      return;
    }

    // Debounced save
    timeoutRef.current = setTimeout(() => {
      try {
        const autoSaveData = {
          ...formData,
          _autoSave: {
            timestamp: Date.now(),
            version: '1.0'
          }
        };
        
        localStorage.setItem(key, JSON.stringify(autoSaveData));
        previousDataRef.current = currentDataString;
        
        // Optional: Dispatch event for debugging/monitoring
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Auto-saved CV draft to localStorage');
        }
      } catch (error) {
        console.error('❌ Auto-save failed:', error);
      }
    }, debounceMs);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, key, debounceMs, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Return utility functions
  return {
    clearAutoSave: () => {
      localStorage.removeItem(key);
    },
    hasAutoSave: () => {
      return localStorage.getItem(key) !== null;
    },
    getAutoSaveData: () => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
  };
};

export default useAutoSave;