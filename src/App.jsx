import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import RankingPage from './pages/RankingPage';
import RankingPageScore from './pages/RankingPageScore';
import StatsPage from './pages/StatsPage';
import PlayerStatsPage from './pages/PlayerStatsPage';
import MatchPage from './pages/MatchPage';
import MatchRegisterPage from './pages/MatchRegisterPage';
import './App.css';

const AppContent = () => {
  const location = useLocation();

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('soccer_players');
    return saved ? JSON.parse(saved) : [];
  });

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('soccer_matches');
    return saved ? JSON.parse(saved) : [];
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('soccer_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('soccer_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const addPlayer = (name) => {
    if (!name.trim()) return;
    const newPlayer = { id: Date.now(), nome: name.trim() };
    setPlayers([...players, newPlayer]);
  };

  const deletePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayer = (id, newName) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, nome: newName } : p));
  };

  const addMatch = (newMatch) => {
    setMatches([...matches, newMatch]);
  };

  const updateMatch = (updatedMatch) => {
    setMatches(prevMatches =>
      prevMatches.map(m => m.id === updatedMatch.id ? updatedMatch : m)
    );
  };

  const deleteMatch = (id) => {
    setMatches(matches.filter(m => m.id !== id));
  };

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-is-open' : ''}`}>

      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className="main-layout">
        {/* HEADER MOBILE AGGIORNATO */}
        <header className="mobile-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <div className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          <div className="mobile-brand">
            <span className="brand-icons-mini">⚽🍺</span>
            <h2 className="brand-text-mini">
              TERZO<span className="highlight">TEMPO</span>
            </h2>
          </div>
        </header>

        <main className="content-area">
          <Routes>
            <Route path="/" element={<RankingPage players={players} matches={matches} />} />
            <Route path="/classifica-marcatori" element={<RankingPageScore players={players} matches={matches} />} />
            <Route path="/partite" element={<MatchPage matches={matches} />} />
            <Route path="/statistiche" element={<StatsPage players={players} matches={matches} />} />
            <Route path="/statistiche-giocatori" element={<PlayerStatsPage players={players} matches={matches} />} />
            <Route path="/registro" element={
              <MatchRegisterPage
                players={players}
                matches={matches}
                onAddMatch={addMatch}
                onUpdateMatch={updateMatch}
                onDeleteMatch={deleteMatch}
                onAddPlayer={addPlayer}
                onDeletePlayer={deletePlayer}
                onUpdatePlayer={updatePlayer}
              />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;