import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import SafeIcon from '../../common/SafeIcon';
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
    // Always show whole numbers for money display
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

  const getMonthName = (week) => {
    const month = Math.ceil(week / 4.33);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[(month - 1) % 12];
  };

  // Calculate years left - career ends at age 60
  const yearsLeft = 60 - player.age;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-ios-gray5 px-4 py-3 z-50">
      {/* Status bar spacer */}
      <div className="h-8"></div>
      
      <div className="flex items-center justify-between">
        {/* Date and Progress */}
        <div className="flex items-center space-x-3">
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-900">
              {getMonthName(player.week)} {player.year}
            </div>
            <div className="text-xs text-ios-gray">
              Age {player.age} • {yearsLeft} years left
            </div>
          </div>
          <div className="w-16 h-2 bg-ios-gray5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-ios-blue rounded-full transition-all duration-300" 
              style={{ width: `${getWeekProgress()}%` }} 
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-ios-green/10 px-3 py-1.5 rounded-full">
            <SafeIcon icon={FiDollarSign} className="text-ios-green text-sm" />
            <span className="text-sm font-semibold text-ios-green">
              {formatMoney(player.netWorth)}
            </span>
            <button className="ml-1 p-0.5">
              <SafeIcon icon={FiPlus} className="text-xs text-ios-green/70" />
            </button>
          </div>
          
          <div className="flex items-center space-x-1 bg-ios-orange/10 px-3 py-1.5 rounded-full">
            <SafeIcon icon={FiZap} className="text-ios-orange text-sm" />
            <span className="text-sm font-semibold text-ios-orange">{player.energy}</span>
            <button className="ml-1 p-0.5">
              <SafeIcon icon={FiPlus} className="text-xs text-ios-orange/70" />
            </button>
          </div>
          
          <button 
            onClick={() => navigate('/settings')} 
            className="p-2 hover:bg-ios-gray6 rounded-full transition-colors"
          >
            <SafeIcon icon={FiSettings} className="text-ios-gray text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}