'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LabelBadge = ({ 
  label, 
  onRemove, 
  size = 'sm', 
  showRemove = false, 
  className = '',
  onClick 
}) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3.5 py-2 text-sm'
  };

  const getColorClasses = (color) => {
    const colorMap = {
      red: 'text-red-300 border-red-800/30',
      orange: 'text-orange-300 border-orange-800/30',
      yellow: 'text-yellow-300 border-yellow-800/30',
      green: 'text-green-300 border-green-800/30',
      blue: 'text-blue-300 border-blue-800/30',
      purple: 'text-purple-300 border-purple-800/30',
      pink: 'text-pink-300 border-pink-800/30',
      indigo: 'text-indigo-300 border-indigo-800/30',
      gray: 'text-gray-300 border-gray-800/30',
      teal: 'text-teal-300 border-teal-800/30',
      cyan: 'text-cyan-300 border-cyan-800/30',
      emerald: 'text-emerald-300 border-emerald-800/30',
      violet: 'text-violet-300 border-violet-800/30',
      rose: 'text-rose-300 border-rose-800/30',
      amber: 'text-amber-300 border-amber-800/30',
      lime: 'text-lime-300 border-lime-800/30',
      sky: 'text-sky-300 border-sky-800/30',
      fuchsia: 'text-fuchsia-300 border-fuchsia-800/30'
    };
    return colorMap[color] || 'bg-gray-900/20 text-gray-300 border-gray-800/30';
  };

  // ✅ New: solid circle background colors
  const getCircleColor = (color) => {
    const colorMap = {
      red: 'bg-red-400',
      orange: 'bg-orange-400',
      yellow: 'bg-yellow-400',
      green: 'bg-green-400',
      blue: 'bg-blue-400',
      purple: 'bg-purple-400',
      pink: 'bg-pink-400',
      indigo: 'bg-indigo-400',
      gray: 'bg-gray-400',
      teal: 'bg-teal-400',
      cyan: 'bg-cyan-400',
      emerald: 'bg-emerald-400',
      violet: 'bg-violet-400',
      rose: 'bg-rose-400',
      amber: 'bg-amber-400',
      lime: 'bg-lime-400',
      sky: 'bg-sky-400',
      fuchsia: 'bg-fuchsia-400'
    };
    return colorMap[color] || 'bg-gray-400';
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(label);
    }
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        inline-flex items-center gap-1 rounded-xl border font-medium transition-all duration-200
        ${sizeClasses[size]}
        ${onClick ? 'cursor-pointer hover:shadow-sm' : ''}
        ${className}
        ${getColorClasses(label.color)}
      `}
      onClick={onClick}
    >
      {/* ✅ circle uses solid color */}
      <div className={`w-2 h-2 rounded-full ${getCircleColor(label.color)}`}></div>
      <span className="truncate max-w-24">{label.name}</span>
      {showRemove && onRemove && (
        <button
          onClick={handleRemove}
          className="hover:bg-white/10 rounded-full transition-colors"
          aria-label={`Remove ${label.name} label`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.span>
  );
};

export default LabelBadge;