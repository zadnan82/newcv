const Alert = ({ children, variant = 'default', className = '' }) => {
  const getAlertStyles = () => {
    // Check for dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    switch (variant) {
      case 'destructive':
        return isDarkMode
          ? 'bg-red-900/30 text-red-200 border-red-800/50'
          : 'bg-red-100 text-red-700 border-red-200';
      case 'warning':
        return isDarkMode
          ? 'bg-yellow-900/30 text-yellow-200 border-yellow-800/50'
          : 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'success':
        return isDarkMode
          ? 'bg-green-900/30 text-green-200 border-green-800/50'
          : 'bg-green-100 text-green-700 border-green-200';
      default:
        return isDarkMode
          ? 'bg-blue-900/30 text-blue-200 border-blue-800/50'
          : 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className={`p-4 rounded-md border ${getAlertStyles()} ${className}`}>
      {children}
    </div>
  );
};

export default Alert;