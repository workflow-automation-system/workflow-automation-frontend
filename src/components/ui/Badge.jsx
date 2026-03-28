import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)]',
    primary: 'bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]',
    success: 'bg-[var(--success)] bg-opacity-10 text-[var(--success)]',
    warning: 'bg-[var(--warning)] bg-opacity-10 text-[var(--warning)]',
    error: 'bg-[var(--error)] bg-opacity-10 text-[var(--error)]',
    active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;