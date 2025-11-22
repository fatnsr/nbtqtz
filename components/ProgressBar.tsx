import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number | string;
  max?: number;
  colorClass: string;
  icon?: React.ReactNode;
  unit?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, max = 100, colorClass, icon, unit }) => {
  // Calculate percentage for width, capping at 100%
  const numericValue = typeof value === 'number' ? value : parseInt(value as string, 10);
  const percentage = Math.min(Math.max((numericValue / max) * 100, 5), 100); // Min 5% for visual visibility

  return (
    <div className="mb-4 bg-gray-50 p-3 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          {label} {icon}
        </div>
        <div className="text-sm font-extrabold text-gray-800">
          {value} <span className="text-xs font-normal text-gray-500">{unit}</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
          style={{ width: `${percentage}%` }}
        ></div>
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 rounded-full transform -translate-x-1/2 skew-x-12"></div>
      </div>
    </div>
  );
};