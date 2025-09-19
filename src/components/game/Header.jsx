import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import SafeIcon from '../../common/SafeIcon';
import NotificationCenter from './NotificationCenter';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiDollarSign, FiZap, FiPlus } = FiIcons;

export default function Header() {
  const navigate = useNavigate();
  const { state } = useGame();
  const { player } = state;

  const getWeekProgress = () => {
    const progress = (player.week / 52) * 100;
    return Math.min(progress, 100);
  };

  const formatMoney = (amount) => {
    const wholeAmount = Math.floor(amount);
    if (wholeAmount >= 1000000000000) {
      return `$${(wholeAmount / 1000000000000).toFixed(1)}T`;
    } else if (wholeAmount >= 1000000000) {
      return `$${(wholeAmount / 1000000000).toFixed(1)}B`;
    } else if (wholeAmount >= 1000000) {
      return `$${(wholeAmount / 1000000).toFixed(1)}M`;
    } else if (wholeAmount >= 1000) {
      return `$${(wholeAmount / 1000).toFixed(1)}K`;
    }
    return `$${wholeAmount}`;
  };

  // Enhanced date formatting - e.g., "1 JAN 2020"
  const getDateString = () => {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = Math.ceil(player.week / 4.33);
    const monthName = monthNames[(month - 1) % 12];
    return `${player.week} ${monthName} ${player.year}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-ios-gray5 px-3 sm:px-4 py-3 z-40 safe-area-top">
      {/* Status bar spacer for mobile */}
      <div className="h-6 sm:h-8"></div>

      <div className="flex items-center justify-between">
        {/* Date and Progress */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className="text-left min-w-0">
            <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
              {getDateString()}
            </div>
            <div className="text-xs text-ios-gray truncate">
              Age {player.age}
            </div>
          </div>
          <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-ios-gray5 rounded-full overflow-hidden flex-shrink-0">
            <div
              className="h-full bg-ios-blue rounded-full transition-all duration-300"
              style={{ width: `${getWeekProgress()}%` }}
            />
          </div>
        </div>

        {/* Stats - Responsive */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <div className="flex items-center space-x-1 bg-ios-green/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <SafeIcon icon={FiDollarSign} className="text-ios-green text-xs sm:text-sm" />
            <span className="text-xs sm:text-sm font-semibold text-ios-green">
              {formatMoney(player.netWorth)}
            </span>
            <button className="ml-1 p-0.5 min-h-6 min-w-6">
              <SafeIcon icon={FiPlus} className="text-xs text-ios-green/70" />
            </button>
          </div>
          <div className="flex items-center space-x-1 bg-ios-orange/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <SafeIcon icon={FiZap} className="text-ios-orange text-xs sm:text-sm" />
            <span className="text-xs sm:text-sm font-semibold text-ios-orange">{player.energy}</span>
            <button className="ml-1 p-0.5 min-h-6 min-w-6">
              <SafeIcon icon={FiPlus} className="text-xs text-ios-orange/70" />
            </button>
          </div>
          <NotificationCenter />
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-ios-gray6 rounded-full transition-colors min-h-10 min-w-10"
          >
            <SafeIcon icon={FiSettings} className="text-ios-gray text-base sm:text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}