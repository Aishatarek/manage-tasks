import React from 'react';

const Button = ({ children, variant = 'primary', size = 'medium', ...props }) => {
  const baseClasses = 'rounded font-medium transition-colors focus:outline-none focus:ring-2';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  const sizes = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${props.className || ''}`;

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
};

export default Button;