import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar/Sidebar';
import HomePage from './pages/HomePage'; 
import RankingPage from './pages/RankingPage';
import RankingPageScore from './pages/RankingPageScore';
import StatsPage from './pages/StatsPage';
import PlayerStatsPage from './pages/PlayerStatsPage';
import MatchPage from './pages/MatchPage';
import MatchRegisterPage from './pages/MatchRegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook per la navigazione programmata
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      await fetchData();
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    const { data: pData } = await supabase.from('players').select('*').order('nome');
    if (pData) setPlayers(pData);

    const { data: mData } = await supabase.from('matches').select('*').order('data', { ascending: false });
    if (mData) setMatches(mData);
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Logica Sync Database
  const addPlayer = async (name) => {
    if (!name.trim()) return;
    const { data, error } = await supabase.from('players').insert([{ nome: name.trim() }]).select();
    if (!error && data) setPlayers(prev => [...prev, data[0]]);
  };

  const deletePlayer = async (id) => {
    const { error } = await supabase.from('players').delete().eq('id', id);
    if (!error) setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const updatePlayer = async (id, newName) => {
    const { error } = await supabase.from('players').update({ nome: newName }).eq('id', id);
    if (!error) setPlayers(prev => prev.map(p => p.id === id ? { ...p, nome: newName } : p));
  };

  const addMatch = async (newMatch) => {
    const { data, error } = await supabase.from('matches').insert([newMatch]).select();
    if (!error && data) setMatches(prev => [data[0], ...prev]);
  };

  const updateMatch = async (updatedMatch) => {
    const { id, ...otherData } = updatedMatch;
    const { data, error } = await supabase.from('matches').update(otherData).eq('id', id).select();
    if (!error && data) setMatches(prev => prev.map(m => m.id === id ? data[0] : m));
  };

  const deleteMatch = async (id) => {
    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (!error) setMatches(prev => prev.filter(m => m.id !== id));
  };

  if (loading) {
    return (
      <div className="app-loader">
        <div className="loader-content">
          <span className="loader-icon">⚽</span>
          <p>Preparazione spogliatoi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-is-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} session={session} />
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="main-layout">
        <header className="mobile-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <div className="hamburger-icon"><span></span><span></span><span></span></div>
          </button>
          
          {/* MODIFICATO: Aggiunto onClick e stile cursore per tornare alla Home */}
          <div 
            className="mobile-brand" 
            onClick={() => navigate('/')} 
            style={{ cursor: 'pointer' }}
          >
            <span className="brand-icons-mini">⚽🍺</span>
            <h2 className="brand-text-mini">TERZO<span className="highlight">TEMPO</span></h2>
          </div>
        </header>

        <main className="content-area">
          <Routes>
            <Route path="/" element={<HomePage players={players} matches={matches} />} />
            <Route path="/classifica" element={<RankingPage players={players} matches={matches} />} />
            <Route path="/classifica-marcatori" element={<RankingPageScore players={players} matches={matches} />} />
            <Route path="/partite" element={<MatchPage matches={matches} />} />
            <Route path="/statistiche" element={<StatsPage players={players} matches={matches} />} />
            <Route path="/statistiche-giocatori" element={<PlayerStatsPage players={players} matches={matches} />} />
            <Route path="/login" element={<LoginPage session={session} />} />
            <Route path="/registro" element={
              session ? (
                <MatchRegisterPage
                  players={players} matches={matches}
                  onAddMatch={addMatch} onUpdateMatch={updateMatch} onDeleteMatch={deleteMatch}
                  onAddPlayer={addPlayer} onDeletePlayer={deletePlayer} onUpdatePlayer={updatePlayer}
                />
              ) : ( <Navigate to="/login" /> )
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() { return (<Router><AppContent /></Router>); }
export default App;