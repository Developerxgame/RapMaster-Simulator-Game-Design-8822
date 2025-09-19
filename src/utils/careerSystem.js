// Career System - Complete Musician Progression
export const CAREER_LEVELS = [
  {
    id: 1,
    title: 'Rookie Musician',
    fameRange: [0, 10],
    reputationRange: [0, 10],
    fanGrowthRange: [50, 200],
    followerGrowthRange: [0, 100],
    streamsRange: [100, 500],
    unlocks: ['Small gigs', 'Street shows', 'Basic recording'],
    icon: '🎤',
    color: 'bg-gray-500',
    description: 'Starting your musical journey'
  },
  {
    id: 2,
    title: 'Local Performer',
    fameRange: [10, 20],
    reputationRange: [10, 20],
    fanGrowthRange: [200, 1000],
    followerGrowthRange: [100, 500],
    streamsRange: [500, 2000],
    unlocks: ['Local concerts', 'Radio play', 'Music videos'],
    icon: '🎸',
    color: 'bg-blue-500',
    description: 'Building local recognition'
  },
  {
    id: 3,
    title: 'Underground Artist',
    fameRange: [20, 30],
    reputationRange: [20, 30],
    fanGrowthRange: [1000, 5000],
    followerGrowthRange: [500, 2000],
    streamsRange: [2000, 10000],
    unlocks: ['Mixtape releases', 'Collaborations', 'Music blogs'],
    icon: '🎭',
    color: 'bg-purple-500',
    description: 'Underground scene recognition'
  },
  {
    id: 4,
    title: 'Rising Star',
    fameRange: [30, 50],
    reputationRange: [30, 50],
    fanGrowthRange: [5000, 50000],
    followerGrowthRange: [2000, 20000],
    streamsRange: [10000, 200000],
    unlocks: ['Viral singles', 'Media buzz', 'Festival slots'],
    icon: '⭐',
    color: 'bg-orange-500',
    description: 'Breaking into mainstream'
  },
  {
    id: 5,
    title: 'Mainstream Artist',
    fameRange: [50, 70],
    reputationRange: [40, 70],
    fanGrowthRange: [50000, 200000],
    followerGrowthRange: [20000, 100000],
    streamsRange: [200000, 1000000],
    unlocks: ['Albums', 'TV interviews', 'Brand deals'],
    icon: '🌟',
    color: 'bg-green-500',
    description: 'Mainstream success'
  },
  {
    id: 6,
    title: 'Hitmaker',
    fameRange: [70, 85],
    reputationRange: [50, 80],
    fanGrowthRange: [200000, 1000000],
    followerGrowthRange: [100000, 500000],
    streamsRange: [1000000, 10000000],
    unlocks: ['World tours', 'Endorsements', 'Record labels'],
    icon: '🔥',
    color: 'bg-red-500',
    description: 'Chart-topping success'
  },
  {
    id: 7,
    title: 'Global Icon',
    fameRange: [85, 95],
    reputationRange: [70, 90],
    fanGrowthRange: [1000000, 5000000],
    followerGrowthRange: [500000, 5000000],
    streamsRange: [10000000, 50000000],
    unlocks: ['International collabs', 'Awards shows', 'Legacy projects'],
    icon: '👑',
    color: 'bg-yellow-500',
    description: 'Global recognition'
  },
  {
    id: 8,
    title: 'Legend',
    fameRange: [95, 100],
    reputationRange: [90, 100],
    fanGrowthRange: [5000000, Infinity],
    followerGrowthRange: [5000000, Infinity],
    streamsRange: [50000000, Infinity],
    unlocks: ['Hall of Fame', 'Legacy features', 'Mentor role'],
    icon: '🏆',
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    description: 'Musical legend status'
  }
];

// Career progression formulas
export const calculateFameGain = (action, quality = 1, level = 1) => {
  const baseGains = {
    track: 5,
    album: 10,
    collaboration: 15,
    concert: 20,
    viral: 25
  };
  
  const qualityMultiplier = Math.max(0.5, quality / 10);
  const levelMultiplier = 1 + (level * 0.1);
  
  return Math.floor(baseGains[action] * qualityMultiplier * levelMultiplier);
};

export const calculateReputationGain = (action, quality = 1, consistency = 1) => {
  const baseGains = {
    consistent: 5,
    highQuality: 10,
    charity: 5,
    lowQuality: -10,
    inactive: -5
  };
  
  const qualityMultiplier = quality >= 7 ? 1.5 : quality <= 4 ? -1 : 1;
  const consistencyMultiplier = consistency >= 0.8 ? 1.2 : 1;
  
  return Math.floor(baseGains[action] * qualityMultiplier * consistencyMultiplier);
};

export const calculateFanGrowth = (fame, reputation, action = 'base') => {
  const baseFans = (fame * 100) + (reputation * 50);
  
  const actionMultipliers = {
    base: 1,
    concert: 5,
    album: 10,
    viral: 15,
    collaboration: 3
  };
  
  return Math.floor(baseFans * actionMultipliers[action]);
};

export const calculateFollowerGrowth = (fame, reputation, action = 'base') => {
  const baseFollowers = (fame * 200) + (reputation * 100);
  
  const actionMultipliers = {
    base: 1,
    single: 2,
    album: 5,
    concert: 3,
    viral: 10
  };
  
  return Math.floor(baseFollowers * actionMultipliers[action]);
};

export const calculateStreams = (fame, reputation, fans, quality = 1) => {
  const baseStreams = (fame * 10000) + (reputation * 5000) + (fans / 2);
  const qualityMultiplier = Math.max(0.3, quality / 10);
  
  return Math.floor(baseStreams * qualityMultiplier);
};

export const calculateAlbumSales = (streams) => {
  return Math.floor(streams / 10);
};

export const getCurrentCareerLevel = (fame, reputation) => {
  return CAREER_LEVELS.find(level => 
    fame >= level.fameRange[0] && fame <= level.fameRange[1] &&
    reputation >= level.reputationRange[0] && reputation <= level.reputationRange[1]
  ) || CAREER_LEVELS[0];
};

export const getNextCareerLevel = (currentLevel) => {
  const currentIndex = CAREER_LEVELS.findIndex(level => level.id === currentLevel.id);
  return CAREER_LEVELS[currentIndex + 1] || null;
};

export const canLevelUp = (fame, reputation, currentLevel) => {
  const nextLevel = getNextCareerLevel(currentLevel);
  if (!nextLevel) return false;
  
  return fame >= nextLevel.fameRange[0] && reputation >= nextLevel.reputationRange[0];
};

// Inactivity penalties
export const calculateInactivityPenalty = (weeksSinceLastRelease) => {
  if (weeksSinceLastRelease >= 24) { // 6 months
    return {
      fame: -5,
      reputation: -5,
      fans: -0.1, // 10% loss
      followers: -0.05 // 5% loss
    };
  }
  return null;
};

// Quality rating system
export const calculateContentQuality = (skills, collaborators = [], equipment = []) => {
  const skillAverage = Object.values(skills).reduce((sum, skill) => sum + skill, 0) / Object.values(skills).length;
  
  const collaboratorBonus = collaborators.reduce((bonus, collab) => bonus + collab.skillLevel, 0) / 10;
  const equipmentBonus = equipment.reduce((bonus, item) => bonus + item.qualityBonus, 0);
  
  const totalQuality = skillAverage + collaboratorBonus + equipmentBonus;
  return Math.min(10, Math.max(1, totalQuality));
};

// Viral potential calculation
export const calculateViralPotential = (quality, timing, trends, luck = Math.random()) => {
  const qualityScore = quality / 10;
  const timingScore = timing / 10; // Perfect timing = 10
  const trendScore = trends / 10; // Following trends = 10
  
  const viralChance = (qualityScore * 0.4 + timingScore * 0.3 + trendScore * 0.2 + luck * 0.1);
  
  return {
    chance: viralChance,
    isViral: viralChance > 0.7,
    multiplier: viralChance > 0.7 ? 2 + (viralChance * 3) : 1
  };
};