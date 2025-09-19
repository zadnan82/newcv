import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { decompressCV, hasEncodedCV } from './utils/cvEncoder';

const TestCV = () => {
  const location = useLocation();
  const [decompressedData, setDecompressedData] = useState(null);
  const [error, setError] = useState(null);
  const processedRef = useRef(false); // Prevent multiple processing
  
  console.log('🧪 TestCV component loaded');
  
  useEffect(() => {
    // Prevent multiple processing
    if (processedRef.current) {
      console.log('🧪 Already processed, skipping...');
      return;
    }

    if (hasEncodedCV(location)) {
      try {
        console.log('🧪 Attempting decompression...');
        const encodedData = location.hash.substring(1);
        const cvData = decompressCV(encodedData);
        console.log('🧪 Decompression successful:', cvData);
        setDecompressedData(cvData);
        processedRef.current = true; // Mark as processed
      } catch (err) {
        console.error('🧪 Decompression failed:', err);
        setError(err.message);
        processedRef.current = true; // Mark as processed even on error
      }
    }
  }, []); // EMPTY dependency array - only run once on mount

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test CV Page</h1>
      <p>Hash: {location.hash ? 'Present' : 'None'}</p>
      <p>Hash length: {location.hash.length}</p>
      
      {error && (
        <div style={{ background: '#fee', padding: '10px', margin: '10px 0', border: '1px solid red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {decompressedData && (
        <div style={{ background: '#efe', padding: '10px', margin: '10px 0', border: '1px solid green' }}>
          <h3>✅ Decompressed Data Successfully:</h3>
          <p><strong>Title:</strong> {decompressedData.title}</p>
          <p><strong>Name:</strong> {decompressedData.personal_info?.full_name}</p>
          <p><strong>Template:</strong> {decompressedData.customization?.template}</p>
          <p><strong>Experiences:</strong> {decompressedData.experiences?.length || 0}</p>
          <p><strong>Skills:</strong> {decompressedData.skills?.length || 0}</p>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => window.location.reload()}>
          🔄 Reload Test
        </button>
        <button 
          onClick={() => window.location.href = '/cv/view' + location.hash}
          style={{ marginLeft: '10px' }}
        >
          🚀 Try Real CV Component
        </button>
      </div>
    </div>
  );
};

export default TestCV;