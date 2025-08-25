import React from 'react';

interface Props {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const ActionButton: React.FC<Props> = ({
  icon,
  label,
  onClick,
  variant = 'secondary'
}) => {
  const baseClasses =
    "flex items-center justify-center space-x-2 px-6 py-6 rounded-lg text-base font-medium transition-colors cursor-pointer";
  const variantClasses =
    variant === 'primary'
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-white text-gray-900 hover:bg-gray-100 border border-gray-200";

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      <span className='p-3 bg-[#DBEAFE] text-secondary rounded-md'>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default ActionButton;
