'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiInfo, FiCalendar, FiBook, FiMail, FiLoader } from "react-icons/fi";
import { addMembertoProjectAction, getProjectByIDAction } from '../src/app/project-actions';

const NotificationContext = createContext();

// Enhanced NotificationContext
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]); // Toast notifications
  const [dashboardNotifs, setDashboardNotifs] = useState([]); // Dashboard notifications
  const [modalNotification, setModalNotification] = useState(null); // Active modal notification

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = { 
      ...notification, 
      id,
      timestamp: new Date().toISOString(),
      read: false
    };
  
    // Add to toast notifications
    setNotifications(prev => [...prev, newNotification]);
    
    // Add to dashboard notifications
    setDashboardNotifs(prev => [...prev, newNotification]);
    
    // Auto-remove only from toast after duration
    if (notification.duration) {
      setTimeout(() => {
        removeToastNotification(id);
      }, notification.duration);
    }
  }, []);

  const showNotificationModal = useCallback((notification) => {
    console.log(notification);
    setModalNotification(notification);
    markAsRead(notification.id);
  }, []);

  const hideNotificationModal = useCallback(() => {
    setModalNotification(null);
  }, []);

  const removeToastNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const removeDashboardNotification = useCallback((id) => {
    setDashboardNotifs(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setDashboardNotifs(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        dashboardNotifs, 
        modalNotification,
        addNotification, 
        removeToastNotification,
        removeDashboardNotification,
        markAsRead,
        showNotificationModal,
        hideNotificationModal
      }}
    >
      {children}
      <NotificationModalContainer />
    </NotificationContext.Provider>
  );
}

// New Modal Components
const NotificationModal = ({ notification, onClose, onAccept, onDecline }) => {

  console.log("MODAL: ", notification);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type?.toLowerCase()) {
      case 'invitation': return <FiCalendar className={`${iconClass} text-blue-400`} />;
      case 'assignment': return <FiBook className={`${iconClass} text-yellow-400`} />;
      case 'message': return <FiMail className={`${iconClass} text-green-400`} />;
      default: return <FiInfo className={`${iconClass} text-gray-400`} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1f1f1f] border-2 border-gray-400 rounded-xl p-6 w-96"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            {getIcon(notification.type)}
            <h3 className="text-xl font-semibold text-gray-200">
              {notification.type === 'invitation' ? 'Project Invitation' : 
               notification.type === 'assignment' ? 'Task Assignment' : 
               'Notification'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-800/30 p-4 rounded-lg">
            <p className="text-gray-200 text-sm mb-2">{notification.message}</p>
            {notification.sender_name && (
              <div className="flex items-center text-sm text-gray-400">
                <FiInfo className="mr-2" />
                <span>From {notification.sender_name}</span>
              </div>
            )}
          </div>

          {/* Project Details Section */}
          {notification.project_id && (
            <div className="bg-gray-800/30 p-4 rounded-lg">
              <h4 className="text-gray-200 font-medium mb-2">Project Details</h4>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <FiLoader className="w-6 h-6 text-blue-400 animate-spin" />
                </div>
              ) : error ? (
                <p className="text-red-400 text-sm">{error}</p>
              ) : notification ? (
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-400">Project Name: </span>
                    <span className="text-gray-200">{notification.project_name}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Organization: </span>
                    <span className="text-gray-200">{notification.organisation_name}</span>
                  </div>
                  {notification.project_description && (
                    <div className="text-sm">
                      <span className="text-gray-400">Description: </span>
                      <span className="text-gray-200">{notification.project_description}</span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="text-gray-400">Project Manager: </span>
                    <span className="text-gray-200">{notification.sender_name}</span>
                  </div>
                  {notification.custom_message && (
                    <div className="text-sm">
                    <span className="text-gray-400">Custom Message from {notification.sender_name}: </span>
                    <span className="text-gray-200">{notification.custom_message}</span>
                  </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No project details available</p>
              )}
            </div>
          )}

          {notification.type === 'invitation' && (
            <div className="flex space-x-3 justify-end">
              <button
                onClick={onDecline}
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                className="px-4 py-2 rounded-lg text-gray-800 bg-[#6f99d8] hover:bg-[#91C8FF] transition-colors flex items-center"
              >
                <FiCheck className="mr-2" />
                Accept
              </button>
            </div>
          )}

          {notification.action && !notification.type === 'invitation' && (
            <div className="flex justify-end">
              <button
                onClick={notification.action.onClick}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const NotificationModalContainer = () => {
  const { 
    addNotification,
    modalNotification, 
    hideNotificationModal,
    removeDashboardNotification 
  } = useNotifications();

  console.log(modalNotification);

  const handleAccept = async () => {
    try {
      if (modalNotification.type === 'invitation') {
        // Add your invitation acceptance logic here
        // For example:
        const res = addMembertoProjectAction(modalNotification.invitation_id, modalNotification.recipient_id, modalNotification.sender_id, modalNotification.project_id)
        if (!res){
          console.error(res);
          return "ERROR";
        }
        // You can also show a success notification
        addNotification({
          message: `Joined ${modalNotification.organisation_name} working on ${modalNotification.project_name}`,
          type: 'success',
          duration: 5000
        });
      }
      
      // Call the original onAccept if it exists
      if (modalNotification.onAccept) {
        await modalNotification.onAccept();
      }
      
      removeDashboardNotification(modalNotification.id);
      hideNotificationModal();
    } catch (error) {
      // Handle any errors
      addNotification({
        message: `Failed to accept invitation: ${error.message}`,
        type: 'error',
        duration: 5000
      });
    }
  };

  const handleDecline = async () => {
    if (modalNotification.onDecline) {
      await modalNotification.onDecline();
    }
    removeDashboardNotification(modalNotification.id);
    hideNotificationModal();
  };

  return (
    <AnimatePresence>
      {modalNotification && (
        <NotificationModal
          notification={modalNotification}
          onClose={hideNotificationModal}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </AnimatePresence>
  );
};

// Update NotificationHandler for invitation handling
const handleInvitationNotification = (invitation) => {
  addNotification({
    message: `Team invitation to join ${invitation.team_name}`,
    type: 'invitation',
    duration: 7000,
    sender_name: invitation.sender_name,
    teamId: invitation.team_id,
    onAccept: async () => {
      // Add your accept logic here
      await acceptTeamInvitation(invitation.team_id);
    },
    onDecline: async () => {
      // Add your decline logic here
      await declineTeamInvitation(invitation.team_id);
    }
  });
};