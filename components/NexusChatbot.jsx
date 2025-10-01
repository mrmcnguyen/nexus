'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMessageCircle, FiZap, FiTarget, FiCalendar, FiTrendingUp, FiCheckSquare, FiClock, FiUser, FiSettings, FiMinimize2, FiMaximize2 } from 'react-icons/fi';

const NexusChatbot = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello!, I'm Nexus, your personal productivity manager. I'm here to be a assistant or manager of your personal productivity. How can I assist you today?",
      timestamp: new Date(),
      suggestions: [
        "Show me today's priorities",
        "Help me plan my week",
        "Track my productivity",
        "Set up a new goal"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = async (message = inputValue) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('priority') || message.includes('today')) {
      return {
        id: Date.now() + 1,
        type: 'bot',
        content: "Based on your current tasks, here are your top priorities for today:\n\n• Complete the project proposal (Due: 3 PM)\n• Review team feedback on design mockups\n• Prepare for the client meeting tomorrow\n\nWould you like me to help you break down any of these tasks?",
        timestamp: new Date(),
        suggestions: [
          "Break down the project proposal",
          "Schedule time for design review",
          "Prepare meeting agenda"
        ]
      };
    } else if (message.includes('plan') || message.includes('week')) {
      return {
        id: Date.now() + 1,
        type: 'bot',
        content: "Let me help you plan your week! I can see you have several important deadlines coming up. Here's a suggested weekly structure:\n\n**Monday**: Focus on high-priority tasks\n**Tuesday**: Team collaboration and meetings\n**Wednesday**: Deep work on complex projects\n**Thursday**: Review and refinement\n**Friday**: Wrap-up and planning for next week\n\nWould you like me to create a detailed schedule?",
        timestamp: new Date(),
        suggestions: [
          "Create detailed schedule",
          "Set up time blocks",
          "Add buffer time"
        ]
      };
    } else if (message.includes('productivity') || message.includes('track')) {
      return {
        id: Date.now() + 1,
        type: 'bot',
        content: "Here's your productivity overview:\n\n📊 **This Week's Stats:**\n• Tasks Completed: 12/15 (80%)\n• Focus Time: 6.5 hours\n• Break Efficiency: Good\n• Energy Level: High\n\n🎯 **Recommendations:**\n• You're most productive in the morning\n• Consider taking more breaks between 2-4 PM\n• Your focus sessions are getting longer - great job!\n\nWould you like me to suggest some optimizations?",
        timestamp: new Date(),
        suggestions: [
          "Optimize my schedule",
          "Set productivity goals",
          "Track energy levels"
        ]
      };
    } else if (message.includes('goal') || message.includes('set')) {
      return {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'd love to help you set up a new goal! Let's make it SMART (Specific, Measurable, Achievable, Relevant, Time-bound).\n\nWhat area would you like to focus on?\n\n• Career Development\n• Health & Wellness\n• Learning & Skills\n• Personal Projects\n• Financial Goals\n\nTell me more about what you want to achieve!",
        timestamp: new Date(),
        suggestions: [
          "Career development goal",
          "Health & wellness goal",
          "Learning new skills"
        ]
      };
    } else {
      return {
        id: Date.now() + 1,
        type: 'bot',
        content: "I understand you're looking for help. As your personal manager, I can assist with:\n\n• Task prioritization and planning\n• Productivity insights and analytics\n• Goal setting and tracking\n• Time management strategies\n• Weekly and daily planning\n\nWhat specific area would you like to focus on?",
        timestamp: new Date(),
        suggestions: [
          "Help me prioritize tasks",
          "Show productivity insights",
          "Plan my day better"
        ]
      };
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const quickActions = [
    { icon: FiTarget, label: "Today's Focus", action: "Show me today's priorities" },
    { icon: FiCalendar, label: "Plan Week", action: "Help me plan my week" },
    { icon: FiTrendingUp, label: "Analytics", action: "Track my productivity" },
    { icon: FiCheckSquare, label: "Set Goal", action: "Set up a new goal" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="overflow-hidden"
    >

          {/* Header */}
          <div className="p-4">
            <h3 className="text-2xl font-bold text-white">Your Personal Productivity Manager</h3>
            <p className="text-gray-400">Your AI-powered productivity assistant</p>
          </div>

          {/* Input */}
          <div className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your productivity, tasks, or goals..."
              className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              <FiSend className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Send</span>
            </button>
          </div>

                  {/* Quick Actions */}
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(action.action)}
                className="flex items-center space-x-2 p-3 bg-neutral-900 hover:bg-gray-700/50 rounded-md transition-colors"
              >
                <action.icon className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
    </motion.div>
  );
};

export default NexusChatbot;
