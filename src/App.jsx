import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Importiamo il client configurato
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
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // CARICAMENTO DATI INIZIALE DA SUPABASE
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Carica Giocatori (ordinati per nome)
    const { data: pData, error: pError } = await supabase
      .from('players')
      .select('*')
      .order('nome');

    if (pData) setPlayers(pData);
    if (pError) console.error("Errore caricamento giocatori:", pError);

    // Carica Partite (ordinate per data più recente)
    const { data: mData, error: mError } = await supabase
      .from('matches')
      .select('*')
      .order('data', { ascending: false });

    if (mData) setMatches(mData);
    if (mError) console.error("Errore caricamento partite:", mError);
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // --- LOGICA GIOCATORI (Sync con DB) ---
  const addPlayer = async (name) => {
    if (!name.trim()) return;
    const { data, error } = await supabase
      .from('players')
      .insert([{ nome: name.trim() }])
      .select();

    if (!error && data) setPlayers(prev => [...prev, data[0]]);
  };

  const deletePlayer = async (id) => {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (!error) setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const updatePlayer = async (id, newName) => {
    const { error } = await supabase
      .from('players')
      .update({ nome: newName })
      .eq('id', id);

    if (!error) setPlayers(prev => prev.map(p => p.id === id ? { ...p, nome: newName } : p));
  };

  // --- LOGICA PARTITE (Sync con DB) ---
  const addMatch = async (newMatch) => {
    const { data, error } = await supabase
      .from('matches')
      .insert([newMatch])
      .select();

    if (!error && data) setMatches(prev => [data[0], ...prev]);
    else if (error) console.error("Errore inserimento partita:", error);
  };

  const updateMatch = async (updatedMatch) => {
    const { id, ...otherData } = updatedMatch;
    const { data, error } = await supabase
      .from('matches')
      .update(otherData)
      .eq('id', id)
      .select();

    if (!error && data) {
      setMatches(prev => prev.map(m => m.id === id ? data[0] : m));
    }
  };

  const deleteMatch = async (id) => {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (!error) setMatches(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-is-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <div className="main-layout">
        <header className="mobile-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <div className="hamburger-icon"><span></span><span></span><span></span></div>
          </button>
          <div className="mobile-brand">
            <span className="brand-icons-mini">⚽🍺</span>
            <h2 className="brand-text-mini">TERZO<span className="highlight">TEMPO</span></h2>
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

function App() { return (<Router><AppContent /></Router>); }
export default App;