// File: hooks/usePdfExport.js
import { useState } from 'react';
import pdfExportService from './pdfExportService';

const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  
  const exportToPdf = async (options) => {
    setIsExporting(true);
    setError(null);
    
    try {
      await pdfExportService.smartExport({
        ...options,
        onSuccess: () => {
          setIsExporting(false);
          if (options.onSuccess) options.onSuccess();
        },
        onError: (err) => {
          setError(err.message);
          setIsExporting(false);
          if (options.onError) options.onError(err);
        }
      });
    } catch (err) {
      setError(err.message);
      setIsExporting(false);
    }
  };
  
  return { exportToPdf, isExporting, error };
};

export default usePdfExport;