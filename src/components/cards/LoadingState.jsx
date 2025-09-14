import { useState, useEffect } from 'react';

const LoadingState = ({ 
  text = 'Loading', 
  duration = 500,
  variant = 'dots'
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (variant === 'dots') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, duration);

      return () => clearInterval(interval);
    }
  }, [duration, variant]);

  const variants = {
    dots: (
      <div className="flex items-center">
        <span>{text}</span>
        <span className="w-8 text-left">{dots}</span>
      </div>
    ),
    spinner: (
      <div className="flex items-center gap-2">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>{text}</span>
      </div>
    ),
    pulse: (
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 bg-current rounded-full animate-pulse" />
        <div className="h-2 w-2 bg-current rounded-full animate-pulse delay-75" />
        <div className="h-2 w-2 bg-current rounded-full animate-pulse delay-150" />
        <span className="ml-2">{text}</span>
      </div>
    )
  };

  return (
    <div className="flex items-center justify-center p-4 text-sm font-medium">
      {variants[variant]}
    </div>
  );
};

export default LoadingState;