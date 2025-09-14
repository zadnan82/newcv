// src/components/shared/animations.jsx
import { useState, useEffect, useRef } from 'react';

export const FadeScale = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`
        transition-all duration-300 transform
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const SlideIn = ({ children, direction = 'left', delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTransformStyle = () => {
    switch (direction) {
      case 'left': return isVisible ? 'translate-x-0' : 'translate-x-4';
      case 'right': return isVisible ? 'translate-x-0' : '-translate-x-4';
      case 'up': return isVisible ? 'translate-y-0' : 'translate-y-4';
      case 'down': return isVisible ? 'translate-y-0' : '-translate-y-4';
      default: return '';
    }
  };

  return (
    <div
      className={`
        transition-all duration-300 transform
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${getTransformStyle()}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const Pulse = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 ${colors[color] || colors.blue} animate-pulse rounded-lg opacity-25`} />
      <div className="relative">{children}</div>
    </div>
  );
};

export const Bounce = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`
        transition-all duration-300
        ${isVisible ? 'opacity-100 animate-bounce' : 'opacity-0'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const Rotate = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      style={{
        transition: 'all 0.5s',
        transform: isVisible ? 'rotate(0deg)' : 'rotate(-180deg)',
        opacity: isVisible ? 1 : 0
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export const TypeWriter = ({ text, delay = 50, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, delay, text]);

  return <div className={className}>{displayedText}</div>;
};

export const ScrollReveal = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      style={{
        transition: 'all 0.5s',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: isVisible ? 1 : 0
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export const LoadingDots = ({ color = 'blue', size = 'md', className = '' }) => {
  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  const sizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${colors[color] || colors.blue}
            ${sizes[size] || sizes.md}
            rounded-full animate-bounce
          `}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};

// Usage examples:
// <FadeScale delay={200}>Content</FadeScale>
// <SlideIn direction="left" delay={300}>Content</SlideIn>
// <Pulse color="purple">Content</Pulse>
// <Bounce delay={400}>Content</Bounce>
// <Rotate delay={500}>Content</Rotate>
// <TypeWriter text="Hello, World!" delay={50} />
// <ScrollReveal>Content</ScrollReveal>
// <LoadingDots color="blue" size="md" />