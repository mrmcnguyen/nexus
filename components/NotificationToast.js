'use client';
// components/NotificationToast.js
import { motion } from 'framer-motion';
import { Mail, Calendar, BookOpen, AlertCircle } from 'lucide-react';

export function NotificationToast({ notification, onClose }) {

  console.log("NOtification:", notification);

  const getStatusColor = (type) => {
    switch (type) {
      case 'success':
        return 'border border-green-500';
      case 'error':
        return 'border border-red-500';
      case 'warning':
        return 'border border-yellow-500';
      default:
        return 'border border-blue-500'; 
    }
  };

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'invitation':
        return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'message':
        return <Mail className="w-5 h-5 text-green-400" />;
      case 'assignment':
        return <BookOpen className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center p-4 rounded-lg shadow-lg bg-[#1f1f1f] ${getStatusColor(notification.type)} text-white mb-2`}
    >
      <div className="mr-4">
        {getIcon(notification.type)}
      </div>
      <div className="flex-grow text-gray-400">{notification.message} from {notification.sender_name}</div>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200"
      >
        ✕
      </button>
    </motion.div>
  );
}