import React from 'react';

const Card = ({ children, className = '', onClick, hoverable = false, ...props }) => {
  const baseStyles = 'bg-[var(--surface)] rounded-lg border border-[var(--border)] shadow-sm';
  const hoverStyles = hoverable ? 'cursor-pointer transition-shadow hover:shadow-md' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className = '' }) => (
  <div className={`px-4 py-3 border-b border-[var(--border)] ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={`px-4 py-4 ${className}`}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`px-4 py-3 border-t border-[var(--border)] bg-[var(--surface-hover)] rounded-b-lg ${className}`}>
    {children}
  </div>
);

export default Card;