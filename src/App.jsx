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
import './index.css';

// IMPORTAZIONE DELLE ICONE DI LUCIDE-REACT PER HEADER MOBILE
import { Beer, Icon } from 'lucide-react';
import { soccerBall as SoccerBall } from '@lucide/lab';

import logoChampions from './assets/LogoTemi/logo_champions_league.svg';
import logoEuropa from './assets/LogoTemi/logo_europa_league.svg';
import logoConference from './assets/LogoTemi/logo_conference_league.svg';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState(() => localStorage.getItem('terzo-tempo-theme') || 'champions');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('terzo-tempo-theme', theme);
  }, [theme]);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      await fetchData();
      setLoading(false);
    };
    initAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    const { data: pData } = await supabase.from('players').select('*').order('nome');
    if (pData) setPlayers(pData);
    const { data: mData } = await supabase.from('matches').select('*').order('data', { ascending: false });
    if (mData) setMatches(mData);
  };

  useEffect(() => { setSidebarOpen(false); }, [location]);

  const handleThemeCycle = () => {
    setTheme(prev => prev === 'champions' ? 'europa' : prev === 'europa' ? 'conference' : 'champions');
  };

  const currentThemeLogo = () => {
    if (theme === 'champions') return logoChampions;
    if (theme === 'europa') return logoEuropa;
    return logoConference;
  };

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-is-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} session={session} />
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="main-layout">
        <header className="mobile-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
              <div className="hamburger-icon"><span></span><span></span><span></span></div>
            </button>
          </div>

          <div className="header-center-right">
            <button 
              className={`theme-cycle-btn theme-${theme}`}
              onClick={handleThemeCycle}
              title="Cambia Torneo"
            >
              <img src={currentThemeLogo()} alt="Logo Torneo" className="theme-cycle-logo" />
            </button>

            <div className="mobile-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <div className="brand-icons-mini">
                <Icon iconNode={SoccerBall} className="mini-icon-item" />
                <Beer className="mini-icon-item mini-beer" />
              </div>
              <h2 className="brand-text-mini">
                TERZO<span className="brand-text-mini-highlight">TEMPO</span>
              </h2>
            </div>
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
            <Route path="/registro" element={session ? <MatchRegisterPage players={players} matches={matches} /> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() { return (<Router><AppContent /></Router>); }
export default App;