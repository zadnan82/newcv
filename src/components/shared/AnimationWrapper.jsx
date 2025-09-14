// src/components/shared/AnimationWrapper.jsx
import { useState, useEffect } from 'react';

const AnimationWrapper = ({ 
  children, 
  animation = 'fadeIn',
  delay = 0,
  duration = 300,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animations = {
    fadeIn: `
      opacity-0 transition-opacity duration-${duration}
      ${isVisible ? 'opacity-100' : ''}
    `,
    slideUp: `
      transform translate-y-4 opacity-0 
      transition-all duration-${duration}
      ${isVisible ? 'translate-y-0 opacity-100' : ''}
    `,
    slideIn: `
      transform -translate-x-4 opacity-0 
      transition-all duration-${duration}
      ${isVisible ? 'translate-x-0 opacity-100' : ''}
    `,
    scale: `
      transform scale-95 opacity-0 
      transition-all duration-${duration}
      ${isVisible ? 'scale-100 opacity-100' : ''}
    `,
    bounce: `
      transform scale-95 opacity-0 
      transition-all duration-${duration}
      ${isVisible ? 'scale-100 opacity-100 animate-bounce' : ''}
    `
  };

  return (
    <div className={`${animations[animation]} ${className}`}>
      {children}
    </div>
  );
};

export default AnimationWrapper;