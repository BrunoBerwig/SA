import React from 'react';
const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-16 h-16 border-8',
  };

  return (
    <div
      className={`spinner rounded-full border-blue-600 border-t-transparent ${sizeClasses[size]}`}
      role="status" 
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

export default Spinner;