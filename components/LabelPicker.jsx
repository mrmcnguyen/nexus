'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LabelBadge from './LabelBadge';
import { createLabelAction, assignLabelToTaskAction, removeLabelFromTaskAction } from '../src/app/label-actions';

const LabelPicker = ({ 
  taskId, 
  selectedLabels = [], 
  availableLabels = [], 
  onLabelsChange,
  userId,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('blue');
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const predefinedColors = [
    'red', 'orange', 'yellow', 'green', 'blue', 'purple', 
    'pink', 'indigo', 'gray', 'teal', 'cyan', 'emerald', 
    'violet', 'rose', 'amber', 'lime', 'sky', 'fuchsia'
  ];

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
    fuchsia: "bg-fuchsia-500",
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
        setIsCreating(false);
        setNewLabelName('');
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

  const handleLabelToggle = async (label) => {
    const isSelected = selectedLabels.some(selected => selected.label_id === label.label_id);
    
    try {
      if (isSelected) {
        // Remove label
        const result = await removeLabelFromTaskAction(taskId, label.label_id);
        if (result.success && onLabelsChange) {
          onLabelsChange(selectedLabels.filter(selected => selected.label_id !== label.label_id));
        }
      } else {
        // Add label
        const result = await assignLabelToTaskAction(taskId, label.label_id);
        console.log('Result:', result);
        if (result.success && onLabelsChange) {
          // Only add to selectedLabels if it's a new assignment (not already exists)
          if (!result.alreadyExists) {
            onLabelsChange([...selectedLabels, label]);
          } else {
            // If already exists, just add it to the UI state
            onLabelsChange([...selectedLabels, label]);
          }
        } else {
          console.error('Failed to assign label:', result.error);
        }
      }
    } catch (error) {
      console.error('Error toggling label:', error);
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;

    try {
      const result = await createLabelAction(userId, newLabelName.trim(), newLabelColor);
      if (result.success) {
        const newLabel = result.data;
        // Add the new label to the task
        const assignResult = await assignLabelToTaskAction(taskId, newLabel.label_id);
        if (assignResult.success && onLabelsChange) {
          onLabelsChange([...selectedLabels, newLabel]);
        } else {
          console.error('Failed to assign new label to task:', assignResult.error);
        }
        setIsCreating(false);
        setNewLabelName('');
        setSearchTerm('');
      } else {
        console.error('Failed to create label:', result.error);
      }
    } catch (error) {
      console.error('Error creating label:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (isCreating) {
        handleCreateLabel();
      } else {
        setIsCreating(true);
      }
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewLabelName('');
      setSearchTerm('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Labels Display */}
      <div className="flex flex-wrap gap-1">
        {selectedLabels.map((label) => (
          <LabelBadge
            key={label.label_id}
            label={label}
            size="xs"
            showRemove={true}
            onRemove={handleLabelToggle}
          />
        ))}
      </div>

      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-2 flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-gray-100 border border-neutral-800 rounded-lg hover:bg-neutral-900 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <span>Add labels</span>
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
            <div className="p-3 border-b border-neutral-800">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Search labels..."
                className="w-full px-3 py-2 text-sm bg-black border border-neutral-800 text-gray-100 placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
                autoFocus
              />
            </div>

            {/* Create New Label */}
            {isCreating ? (
              <div className="p-3 border-b border-neutral-800 bg-neutral-800/50">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Label name..."
                    className="w-full px-3 py-2 text-sm bg-black border border-neutral-800 text-gray-100 placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
                    autoFocus
                  />
                  
                  {/* Color Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-300">Color</label>
                    <div className="grid grid-cols-6 gap-2">
                      {predefinedColors.map((color) => (
                        <button
                        key={color}
                        onClick={() => { setNewLabelColor(color); handleCreateLabel(); }}
                        className={`w-6 h-6 rounded-full border-2 ${
                          newLabelColor === color ? "border-gray-400" : "border-neutral-600"
                        } ${circleColors[color] || "bg-gray-500"} hover:scale-110 transition-transform`}
                      />                      
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateLabel}
                      disabled={!newLabelName.trim()}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setNewLabelName('');
                      }}
                      className="px-3 py-1.5 bg-neutral-700 text-gray-200 text-sm rounded-md hover:bg-neutral-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-neutral-800 border-b border-neutral-800 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create new label
              </button>
            )}

            {/* Available Labels */}
            <div className="max-h-32 overflow-y-auto">
              {filteredLabels.length > 0 ? (
                filteredLabels.map((label) => {
                  const isSelected = selectedLabels.some(selected => selected.label_id === label.label_id);
                  return (
                    <button
                      key={label.label_id}
                      onClick={() => handleLabelToggle(label)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-neutral-800 flex items-center justify-between ${
                        isSelected ? 'bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${circleColors[label.color] || "bg-gray-500"}`} />
                        <span className="truncate text-gray-100">{label.name}</span>
                      </div>
                      {isSelected && (
                        <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
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

export default LabelPicker;

