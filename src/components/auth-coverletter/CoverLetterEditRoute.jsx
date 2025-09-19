// src/components/auth-coverletter/CoverLetterEditRoute.jsx
// Route handler for editing cover letters - redirects to the existing editor

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CoverLetterEditRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Redirect to the existing cover letter editor
      navigate(`/cover-letter/${id}/edit`);
    } else {
      // If no ID, redirect to dashboard
      navigate('/cover-letters');
    }
  }, [id, navigate]);

  return null; // This component just redirects, no UI
};

export default CoverLetterEditRoute;