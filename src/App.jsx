import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import SplashScreen from './components/SplashScreen';
import MainMenu from './components/MainMenu';
import CharacterCreation from './components/CharacterCreation';
import GameLayout from './components/GameLayout';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-ios-bg text-gray-900 font-ios">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/menu" element={<MainMenu />} />
            <Route path="/character-creation" element={<CharacterCreation />} />
            <Route path="/game/*" element={<GameLayout />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;