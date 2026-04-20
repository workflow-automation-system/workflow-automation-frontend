import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: 'bg-[#F6F5FA] text-[var(--text-primary)] border-[#D8DFE9]',
    primary: 'bg-[#EFF0A3] text-[#212121] border-[#D8DFE9]',
    success: 'bg-[#CFDECA] text-[#212121] border-[#D8DFE9]',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    active: 'bg-[#CFDECA] text-[#212121] border-[#D8DFE9]',
    inactive: 'bg-[#F6F5FA] text-[#5C5C5C] border-[#D8DFE9]',
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
