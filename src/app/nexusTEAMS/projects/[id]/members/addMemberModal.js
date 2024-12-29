import React, { useState, useEffect, useRef } from 'react';
import { FiMail, FiLoader, FiAlertCircle, FiInfo, FiX, FiUserPlus } from 'react-icons/fi';
import debounce from 'lodash/debounce';
import { getNameFromEmail, getNameFromID, getProjectByID } from '../../../../../lib/db/projectQueries';
import { sendInvite } from '../../../../../lib/db//commQueries';

const LoadingSpinner = () => (
  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
    <FiLoader className="animate-spin h-4 w-4 text-gray-400" />
  </div>
);

const UserAvatar = ({ firstName, lastName }) => {
    const getInitials = () => {
      const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
      const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
      return `${firstInitial}${lastInitial}` || '?';
    };
  
    return (
      <div className="w-8 h-8 rounded-full bg-[#6f99d8] flex items-center justify-center text-white text-sm font-medium">
        {getInitials()}
      </div>
    );
  };

const AddMemberDropdown = ({ isOpen, onClose, projectId, buttonRef, userID }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRootUser, setIsRootUser] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [invitedUser, setInvitedUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [emailExists, setEmailExists] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('member');
  const [customMessage, setCustomMessage] = useState('');
  const dropdownRef = useRef(null);

  const handleClose = () => {
    setEmailExists(false);
    setInvitedUser(null);
    setEmail('');
    setError('');
    setIsRootUser(false);
    setRole('member');
    setCustomMessage('');
    onClose();
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target) &&
      buttonRef.current && 
      !buttonRef.current.contains(event.target)
    ) {
      handleClose();
    }
  };

  useEffect(() => {
    const getUserName = async() => {
      const res = await getNameFromID(userID);
      console.log(res);
      if (res) setUserName(`${res.first_name} ${res.last_name}`)
    }

      getUserName();
  }, [userID]);
  
    useEffect(() => {
      const fetchProjectData = async () => {
        if (projectId) {
          setLoading(true);
          try {
            const project = await getProjectByID(projectId);
            console.log(project);
            setProjectData(project[0]);
          } catch (err) {
            console.error('Error fetching project');
            setError('Failed to load project details');
          } finally {
            setLoading(false);
          }
        }
      };
  
      fetchProjectData();
    }, [projectId]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const checkEmailExists = debounce(async (email) => {
    setIsRootUser(false);
    setError('');
    
    if (!isValidEmail(email)) {
      setEmailExists(false);
      setCheckingEmail(false);
      return;
    }

    setCheckingEmail(true);
    try {
      const res = await getNameFromEmail(email);

      if (res && res[0]) {
        setEmailExists(true);
        setInvitedUser(res[0]);

        if (res[0].user_id === userID) {
          setIsRootUser(true);
          setError("You can't invite yourself to the project");
        }
      } else {
        setEmailExists(false);
        setInvitedUser(null);
      }
    } catch (err) {
      setError('Error checking email. Please try again.');
    } finally {
      setCheckingEmail(false);
    }
  }, 300);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRootUser) {
      setError("You can't invite yourself to the project");
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log("Sending with organisation name: ", projectData.organisation_name);
        const res = await sendInvite(userID, customMessage, email, projectId, projectData.project_name, projectData.organisation_name, invitedUser.user_id, userName);
        if (res){
            console.log("Invite sent");
        }

        handleClose();
    } catch (err) {
      setError('Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-12 bg-[#1F1F1F] rounded-lg w-96 p-4 shadow-xl border border-gray-700 z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-semibold flex items-center gap-2">
          <FiUserPlus className="h-5 w-5" />
          Invite Team Member
        </h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
          <div className="relative flex-1">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                setError('');
        
                if (isValidEmail(value)) {
                  checkEmailExists(value);
                } else {
                  setEmailExists(false);
                }
              }}
              className={`w-full bg-[#2E2E2E] text-sm text-white rounded-md pl-9 pr-4 py-2 focus:outline-none focus:ring-1 
                ${isRootUser ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:border-[#91C8FF] focus:ring-[#91C8FF]'}`}
              required
            />
            {checkingEmail && <LoadingSpinner />}
          </div>
        </div>

        {/* User Found Display */}
        {emailExists && invitedUser && (
          <div className={`p-2 ${isRootUser ? 'bg-red-500/10' : 'bg-[#2E2E2E]'} rounded-lg transition-colors duration-200`}>
            <div className="text-sm text-white">
              <div className="flex items-center gap-3">
                <UserAvatar 
                  firstName={invitedUser.first_name || ""}
                  lastName={invitedUser.last_name || ""}
                />
                <div>
                  <div className="flex items-center gap-2">
                    {isRootUser && <FiAlertCircle className="text-red-500" />}
                    <span className="font-medium">
                      {invitedUser.first_name || "User"} {invitedUser.last_name || ""}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">{email}</p>
                </div>
                {isRootUser && (
                  <span className="ml-auto text-gray-400 text-sm">You</span>
                )}
              </div>
            </div>
          </div>
        )}

        {!isRootUser && emailExists && invitedUser && (
          <p className="text-[#91C8FF] text-xs flex items-center gap-1">
            <FiAlertCircle className="inline" />
            {invitedUser.first_name} is registered on Nexus
          </p>
        )}

        {error && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <FiAlertCircle className="inline" />
            {error}
          </p>
        )}

        {/* Role Selection */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Role</label>
          <div className="grid grid-cols-3 gap-2">
            {['member', 'admin', 'viewer'].map((roleOption) => (
              <button
                key={roleOption}
                type="button"
                onClick={() => setRole(roleOption)}
                className={`px-3 py-2 text-sm rounded-md transition-colors
                  ${role === roleOption 
                    ? 'bg-[#6f99d8] text-white' 
                    : 'bg-[#2E2E2E] text-gray-400 hover:bg-[#3E3E3E]'}`}
              >
                {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
              </button>
            ))}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <FiInfo className="h-3 w-3" />
            <span>Click to select the member's role</span>
          </div>
        </div>

        {/* Custom Message */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Custom Message (Optional)</label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add a personal message to your invitation..."
            className="w-full bg-[#2E2E2E] text-sm text-white rounded-md p-2 h-20 focus:outline-none focus:ring-1 focus:border-[#91C8FF] focus:ring-[#91C8FF]"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm rounded-md bg-[#2E2E2E] text-white hover:bg-[#3E3E3E]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!email || loading || isRootUser || checkingEmail}
            className="px-4 py-2 text-sm rounded-md bg-[#6f99d8] hover:bg-[#91C8FF] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Invite'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberDropdown;