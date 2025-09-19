import React from 'react';
import {HashRouter as Router,Routes,Route} from 'react-router-dom';
import {GameProvider} from './context/GameContext';
import {AuthProvider} from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import SplashScreen from './components/SplashScreen';
import MainMenu from './components/MainMenu';
import CharacterCreation from './components/CharacterCreation';
import SettingsPage from './components/SettingsPage';
import AuthPage from './components/auth/AuthPage';
import GameLayout from './components/GameLayout';
import CloudSaveIndicator from './components/game/CloudSaveIndicator';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GameProvider>
          <Router>
            <div className="min-h-screen bg-ios-bg text-gray-900 font-ios">
              <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/menu" element={<MainMenu />} />
                <Route path="/character-creation" element={<CharacterCreation />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/game/*" element={<GameLayout />} />
              </Routes>
              <CloudSaveIndicator />
            </div>
          </Router>
        </GameProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;