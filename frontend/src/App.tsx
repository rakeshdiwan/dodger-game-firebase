import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ShellLayout } from './components/layout/ShellLayout';
import { GamePage } from './pages/GamePage';
import { HistoryPage } from './pages/HistoryPage';
import { InstructionsPage } from './pages/InstructionsPage';
import { LandingPage } from './pages/LandingPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { LoginPage } from './pages/LoginPage';
import { useGameStore } from './store/useGameStore';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const user = useGameStore((s) => s.user);
  return user ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <ShellLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
};

export default App;
