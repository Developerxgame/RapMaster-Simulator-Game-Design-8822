import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBell, FiX, FiCheck, FiDollarSign, FiTrendingUp, FiAward, FiAlertCircle } = FiIcons;

export default function NotificationCenter() {
  const { state, dispatch } = useGame();
  const { notifications } = state;
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Listen for new notifications and show popup
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      if (latestNotification && !latestNotification.shown) {
        setCurrentNotification(latestNotification);
        setShowPopup(true);
        
        // Mark as shown
        dispatch({
          type: 'MARK_NOTIFICATION_SHOWN',
          payload: { id: latestNotification.id }
        });

        // Auto-hide after 4 seconds
        const timer = setTimeout(() => {
          setShowPopup(false);
          setCurrentNotification(null);
        }, 4000);

        return () => clearTimeout(timer);
      }
    }
  }, [notifications, dispatch]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return FiCheck;
      case 'earnings':
        return FiDollarSign;
      case 'achievement':
        return FiAward;
      case 'trending':
        return FiTrendingUp;
      case 'error':
        return FiAlertCircle;
      default:
        return FiBell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-ios-green bg-ios-green/10';
      case 'earnings':
        return 'text-ios-green bg-ios-green/10';
      case 'achievement':
        return 'text-rap-gold bg-rap-gold/10';
      case 'trending':
        return 'text-ios-blue bg-ios-blue/10';
      case 'error':
        return 'text-ios-red bg-ios-red/10';
      default:
        return 'text-ios-gray bg-ios-gray/10';
    }
  };

  const getNotificationBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-ios-green to-ios-teal';
      case 'earnings':
        return 'bg-gradient-to-r from-ios-green to-ios-mint';
      case 'achievement':
        return 'bg-gradient-to-r from-rap-gold to-ios-orange';
      case 'trending':
        return 'bg-gradient-to-r from-ios-blue to-ios-purple';
      case 'error':
        return 'bg-gradient-to-r from-ios-red to-ios-pink';
      default:
        return 'bg-gradient-to-r from-ios-gray to-ios-gray3';
    }
  };

  const clearNotification = (notificationId) => {
    dispatch({
      type: 'CLEAR_NOTIFICATION',
      payload: { id: notificationId }
    });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now - notificationTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const closePopup = () => {
    setShowPopup(false);
    setCurrentNotification(null);
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-ios-gray6 rounded-full transition-colors"
      >
        <SafeIcon icon={FiBell} className="text-xl text-ios-gray" />
        {unreadCount > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-ios-red rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </motion.div>
        )}
      </button>

      {/* Notification Popup */}
      <AnimatePresence>
        {showPopup && currentNotification && (
          <motion.div
            className="fixed top-20 left-4 right-4 z-50 pointer-events-auto"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              className={`${getNotificationBgColor(currentNotification.type)} p-4 rounded-2xl shadow-2xl text-white mx-auto max-w-sm`}
              layoutId={`notification-${currentNotification.id}`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white/20 rounded-full flex-shrink-0">
                  <SafeIcon icon={getNotificationIcon(currentNotification.type)} className="text-white text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm mb-1">
                    {currentNotification.title}
                  </h4>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {currentNotification.message}
                  </p>
                </div>
                <button
                  onClick={closePopup}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
                >
                  <SafeIcon icon={FiX} className="text-white text-sm" />
                </button>
              </div>
              
              {/* Progress bar for auto-dismiss */}
              <motion.div
                className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 overflow-hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-ios-blue to-ios-purple p-4 text-white">
                <div className="flex items-center justify-between pt-8">
                  <h2 className="text-lg font-bold">Notifications</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <SafeIcon icon={FiX} className="text-xl" />
                  </button>
                </div>
                {notifications.length > 0 && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white/80 text-sm">
                      {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={clearAllNotifications}
                      className="text-white/80 hover:text-white text-sm underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                    <SafeIcon icon={FiBell} className="text-4xl text-ios-gray mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                    <p className="text-ios-gray text-sm">
                      You're all caught up! New notifications will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-ios-gray5">
                    {notifications.map((notification, index) => {
                      const Icon = getNotificationIcon(notification.type);
                      const colorClass = getNotificationColor(notification.type);
                      
                      return (
                        <motion.div
                          key={notification.id}
                          className={`p-4 hover:bg-ios-gray6 transition-colors ${
                            !notification.read ? 'bg-ios-blue/5' : ''
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
                              <SafeIcon icon={Icon} className="text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm truncate">
                                  {notification.title}
                                </h4>
                                <button
                                  onClick={() => clearNotification(notification.id)}
                                  className="p-1 hover:bg-ios-gray5 rounded-full transition-colors flex-shrink-0"
                                >
                                  <SafeIcon icon={FiX} className="text-xs text-ios-gray" />
                                </button>
                              </div>
                              <p className="text-ios-gray text-sm mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-ios-gray2 text-xs">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-ios-blue rounded-full"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}