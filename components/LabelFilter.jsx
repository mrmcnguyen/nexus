'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LabelBadge from './LabelBadge';
import { deleteLabelAction } from '../src/app/label-actions';

const LabelFilter = ({ 
  availableLabels = [], 
  selectedLabels = [], 
  onSelectionChange,
  onLabelsRefresh,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const circleColors = {
    red: "bg-red-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    indigo: "bg-indigo-500",
    gray: "bg-gray-500",
    teal: "bg-teal-500",
    cyan: "bg-cyan-500",
    emerald: "bg-emerald-500",
    violet: "bg-violet-500",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
    lime: "bg-lime-500",
    sky: "bg-sky-500",
    fuchsia: "bg-fuchsia-500"
  };  

  // Filter labels based on search term
  const filteredLabels = availableLabels.filter(label =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLabelToggle = (label) => {
    const isSelected = selectedLabels.some(selected => selected.label_id === label.label_id);
    
    if (isSelected) {
      // Remove from selection
      onSelectionChange(selectedLabels.filter(selected => selected.label_id !== label.label_id));
    } else {
      // Add to selection
      onSelectionChange([...selectedLabels, label]);
    }
  };

  const clearAllFilters = () => {
    onSelectionChange([]);
  };

  const handleDeleteLabel = async (label) => {
    try {
      const result = await deleteLabelAction(label.label_id);
      if (result.success) {
        // Remove from selected labels if it was selected
        const updatedSelectedLabels = selectedLabels.filter(selected => selected.label_id !== label.label_id);
        onSelectionChange(updatedSelectedLabels);
        
        // Optionally refresh available labels by calling a callback
        if (onLabelsRefresh) {
          onLabelsRefresh();
        }
      } else {
        console.error('Failed to delete label:', result.error);
      }
    } catch (error) {
      console.error('Error deleting label:', error);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Labels Display */}
      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedLabels.map((label) => (
            <LabelBadge
              key={label.label_id}
              label={label}
              size="xs"
              showRemove={true}
              onRemove={handleLabelToggle}
            />
          ))}
          <button
            onClick={clearAllFilters}
            className="px-2 py-1 text-xs text-gray-200 hover:text-gray-200 hover:bg-neutral-800 rounded-md tracking-tight transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
          selectedLabels.length > 0
            ? 'bg-blue-900/20 text-blue-300 border-blue-800/30 hover:bg-blue-900/30'
            : 'text-gray-100 hover:text-gray-100 border-neutral-800 hover:bg-neutral-900 tracking-tight'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span>
          {selectedLabels.length > 0 
            ? `Filter by ${selectedLabels.length} label${selectedLabels.length > 1 ? 's' : ''}`
            : 'Filter Labels'
          }
        </span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden"
          >
            {/* Search Input */}
            <div className="border-b border-neutral-800">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search labels..."
                className="w-full px-3 py-2 text-sm bg-black border border-neutral-800 text-gray-100 placeholder:text-gray-400 rounded-md focus:outline-none"
                autoFocus
              />
            </div>

            {/* Available Labels */}
            <div className="max-h-32 overflow-y-auto p-1">
              {filteredLabels.length > 0 ? (
                filteredLabels.map((label) => {
                  const isSelected = selectedLabels.some(selected => selected.label_id === label.label_id);
                  return (
                    <div
                      key={label.label_id}
                      className={`w-full px-2 py-2 text-left text-sm rounded-md hover:bg-neutral-800 flex items-center justify-between ${
                        isSelected ? 'bg-blue-900/20' : ''
                      }`}
                    >
                      <button
                        onClick={() => handleLabelToggle(label)}
                        className="flex items-center gap-2 flex-1"
                      >
                        <div className={`w-3 h-3 rounded-full ${circleColors[label.color] || "bg-gray-500"}`} />
                        <span className="truncate text-gray-100">{label.name}</span>
                        {isSelected && (
                          <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLabel(label);
                        }}
                        className="ml-2 p-1 hover:bg-neutral-900/20 rounded transition-colors"
                        title="Delete label"
                      >
                        <svg className="w-3 h-3 text-neutral-400 hover:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-sm text-gray-400 text-center">
                  {searchTerm ? 'No labels found' : 'No labels available'}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LabelFilter;

