import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class, e.g., 'text-blue-500'
  className?: string; // Additional classes
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'text-blue-500', className = '' }) => {
  let spinnerSize = 'w-6 h-6'; // Default medium
  let borderWidth = 'border-4';

  switch (size) {
    case 'sm':
      spinnerSize = 'w-4 h-4';
      borderWidth = 'border-2';
      break;
    case 'lg':
      spinnerSize = 'w-8 h-8';
      borderWidth = 'border-4';
      break;
    case 'md':
    default:
      // default is w-6 h-6, border-4
      break;
  }

  return (
    <div
      className={`inline-block ${spinnerSize} ${borderWidth} ${color} border-solid border-current border-r-transparent rounded-full animate-spin ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
