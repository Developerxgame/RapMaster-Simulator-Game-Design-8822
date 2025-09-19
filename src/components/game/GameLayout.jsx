import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import Header from './Header';
import BottomNav from './BottomNav';
import HomePage from './HomePage';
import JobPage from './JobPage';
import MusicStudioPage from './MusicStudioPage';
import SocialMediaPage from './SocialMediaPage';
import ShopPage from './ShopPage';
import SkillsPage from './SkillsPage';

export default function GameLayout() {
  const { state } = useGame();

  return (
    <div className="min-h-screen bg-ios-bg flex flex-col">
      <Header />
      <main className="flex-1 pb-20 pt-16">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/job" element={<JobPage />} />
          <Route path="/studio" element={<MusicStudioPage />} />
          <Route path="/social" element={<SocialMediaPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/skills" element={<SkillsPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}