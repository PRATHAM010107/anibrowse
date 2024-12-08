import React from 'react';
import { Flame, TrendingUp, Star, Search } from 'lucide-react';
import { AnimeCategory } from '../types/anime';
import { cn } from '../utils/cn';

interface TabNavigationProps {
  activeTab: AnimeCategory;
  onTabChange: (tab: AnimeCategory) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'trending' as const, label: 'Trending', icon: Flame },
    { id: 'upcoming' as const, label: 'Upcoming', icon: TrendingUp },
    { id: 'popular' as const, label: 'Popular', icon: Star },
    { id: 'search' as const, label: 'Search', icon: Search },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-white rounded-lg p-1 shadow-md">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200',
              activeTab === id
                ? 'bg-[#E94560] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};