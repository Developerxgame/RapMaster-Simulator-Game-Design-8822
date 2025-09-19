import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useSupabaseSync } from '../../hooks/useSupabaseSync'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCloud, FiCloudOff, FiCheck, FiWifi, FiWifiOff } = FiIcons

export default function CloudSaveIndicator() {
  const { user } = useAuth()
  const { lastSync } = useSupabaseSync()
  const [syncStatus, setSyncStatus] = useState('idle')
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    if (lastSync) {
      setSyncStatus('synced')
      setShowIndicator(true)
      
      // Hide indicator after 3 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [lastSync])

  const getIndicatorContent = () => {
    if (!user) {
      return {
        icon: FiCloudOff,
        text: 'Offline Mode',
        color: 'bg-ios-gray text-white',
        description: 'Sign in to sync across devices'
      }
    }

    switch (syncStatus) {
      case 'syncing':
        return {
          icon: FiCloud,
          text: 'Syncing...',
          color: 'bg-ios-blue text-white',
          description: 'Saving to cloud'
        }
      case 'synced':
        return {
          icon: FiCheck,
          text: 'Synced',
          color: 'bg-ios-green text-white',
          description: 'All changes saved'
        }
      case 'error':
        return {
          icon: FiWifiOff,
          text: 'Sync Error',
          color: 'bg-ios-red text-white',
          description: 'Failed to sync'
        }
      default:
        return {
          icon: FiCloud,
          text: 'Cloud Ready',
          color: 'bg-ios-blue text-white',
          description: 'Auto-sync enabled'
        }
    }
  }

  const indicator = getIndicatorContent()

  return (
    <AnimatePresence>
      {(showIndicator || !user) && (
        <motion.div
          className="fixed top-20 right-4 z-50"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          <div className={`${indicator.color} px-3 py-2 rounded-full shadow-lg backdrop-blur-md flex items-center space-x-2`}>
            <SafeIcon icon={indicator.icon} className="text-sm" />
            <span className="text-sm font-medium">{indicator.text}</span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute top-full right-0 mt-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {indicator.description}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}