import React, { useState, useMemo } from 'react';
import './PlayerStatsPage.css';

// IMPORTAZIONE DELLE ICONE DI LUCIDE-REACT
import { 
  Search, 
  X, 
  Flame, 
  TrendingUp, 
  Snowflake, 
  Scale, 
  Sparkles,
  Trophy,
  History,
  Handshake,
  UserCheck
} from 'lucide-react';

const PlayerStatsPage = ({ players = [], matches = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  // 1. LOGICA DI RANKING COMPATTA
  const sortedRanking = useMemo(() => {
    return players.map(player => {
      let punti = 0, dr = 0, gf = 0, partite = 0;
      matches.forEach(m => {
        const p = (m.match_details?.partecipanti || []).find(part => part.playerId === player.id);
        if (p) {
          punti += (p.punti || 0);
          dr += (p.dr || 0);
          gf += (p.goal || 0);
          partite += 1;
        }
      });
      return { id: player.id, punti, dr, gf, partite };
    })
    .filter(s => s.partite > 0)
    .sort((a, b) => b.punti - a.punti || b.dr - a.dr || b.gf - a.gf);
  }, [players, matches]);

  // 2. STILE E CALCOLO BADGE DI STATO ESTERNALIZZATO CON STRUTTURA LUCIDE
  const calculateStatus = (playerId) => {
    const playerMatches = matches
      .filter(m => (m.match_details?.partecipanti || []).some(p => p.playerId === playerId))
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 3);

    if (playerMatches.length < 1) {
      return { label: 'DEBUTTANTE', class: 'stable', icon: <Sparkles className="badge-lucide-icon" /> };
    }
    
    const results = playerMatches.map(m => {
      const p = m.match_details.partecipanti.find(part => part.playerId === playerId);
      return p.punti === 3 ? 'V' : (p.punti === 1 ? 'P' : 'S');
    });

    if (results.every(r => r === 'V') && results.length >= 3) {
      return { label: 'ON FIRE', class: 'fire', icon: <Flame className="badge-lucide-icon" /> };
    }
    if (results.filter(r => r === 'V').length >= 2) {
      return { label: 'IN FORMA', class: 'forma', icon: <TrendingUp className="badge-lucide-icon" /> };
    }
    if (results.every(r => r === 'S') && results.length >= 3) {
      return { label: 'PERIODO NO', class: 'cold', icon: <Snowflake className="badge-lucide-icon" /> };
    }
    return { label: 'STABILE', class: 'stable', icon: <Scale className="badge-lucide-icon" /> };
  };

  // 3. AUTOCOMPLETE & GESTIONE INPUT TASTIERA
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm || selectedPlayerId) return [];
    return players
      .filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
  }, [searchTerm, players, selectedPlayerId]);

  const selectPlayer = (player) => {
    setSelectedPlayerId(player.id);
    setSearchTerm(player.nome);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (filteredSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && activeIndex !== -1) {
      selectPlayer(filteredSuggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setSearchTerm('');
      setActiveIndex(-1);
    }
  };

  // 4. ELABORAZIONE STATISTICHE DEL PROFILO SELEZIONATO
  const personalStats = useMemo(() => {
    if (!selectedPlayerId) return null;

    const rankIndex = sortedRanking.findIndex(r => r.id === selectedPlayerId) + 1;
    const stats = {
      partite: 0, vittorie: 0, goal: 0, punti: 0, drTotale: 0,
      matchHistory: [],
      records: { maxGoal: 0, streak: 0, currentStreak: 0 },
      partners: {},
      rank: rankIndex || '-',
      status: calculateStatus(selectedPlayerId)
    };

    const sortedMatches = [...matches].sort((a, b) => new Date(a.data) - new Date(b.data));

    sortedMatches.forEach(match => {
      const partecipanti = match.match_details?.partecipanti || [];
      const pData = partecipanti.find(p => p.playerId === selectedPlayerId);

      if (pData) {
        stats.partite += 1;
        stats.punti += (pData.punti || 0);
        stats.goal += (pData.goal || 0);
        stats.drTotale += (pData.dr || 0);

        if (pData.goal > stats.records.maxGoal) stats.records.maxGoal = pData.goal;

        if (pData.punti === 3) {
          stats.vittorie += 1;
          stats.records.currentStreak += 1;
          if (stats.records.currentStreak > stats.records.streak) stats.records.streak = stats.records.currentStreak;
        } else {
          stats.records.currentStreak = 0;
        }

        const res = pData.punti === 3 ? 'V' : (pData.punti === 1 ? 'P' : 'S');
        stats.matchHistory.unshift({ data: match.data, risultato: res, goal: pData.goal, dr: pData.dr });

        partecipanti.forEach(comp => {
          if (comp.playerId !== selectedPlayerId && comp.punti === pData.punti) {
            if (!stats.partners[comp.playerId]) {
              const pInfo = players.find(pl => pl.id === comp.playerId);
              stats.partners[comp.playerId] = { nome: pInfo?.nome, win: 0, total: 0 };
            }
            stats.partners[comp.playerId].total += 1;
            if (pData.punti === 3) stats.partners[comp.playerId].win += 1;
          }
        });
      }
    });

    const partnerArray = Object.values(stats.partners).filter(p => p.total >= 2);
    stats.bestPartner = partnerArray.sort((a, b) => (b.win / b.total) - (a.win / a.total) || b.total - a.total)[0];

    return stats;
  }, [selectedPlayerId, matches, players, sortedRanking]);

  return (
    <div className="player-stats-container">
      <div className="player-search-section">
        <div className="search-wrapper">
          <div className={`search-box ${searchTerm ? 'has-content' : ''}`}>
            <Search className="search-icon-lucide" />
            <input 
              type="text" 
              placeholder="Cerca un giocatore..." 
              value={searchTerm}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveIndex(-1);
                if (selectedPlayerId) setSelectedPlayerId(null);
              }}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={() => { setSearchTerm(''); setSelectedPlayerId(null); }} className="clear-btn">
                <X size={12} />
              </button>
            )}
          </div>
          
          {filteredSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {filteredSuggestions.map((p, index) => {
                const s = calculateStatus(p.id);
                const rank = sortedRanking.findIndex(r => r.id === p.id) + 1;
                return (
                  <li 
                    key={p.id} 
                    onClick={() => selectPlayer(p)}
                    className={index === activeIndex ? 'active-suggestion' : ''}
                  >
                    <div className="sugg-info">
                      <span className="sugg-name">{p.nome}</span>
                      <span className="sugg-rank">{rank > 0 ? `#${rank}` : 'N/D'}</span>
                    </div>
                    <span className={`sugg-badge-wrapper ${s.class}`}>
                      {s.icon}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {personalStats ? (
        <div className="player-dashboard animate-in">
          <div className="player-hero-card">
            <div className="hero-left">
              <h1 className="display-name">{searchTerm}</h1>
              <div className="badge-container">
                <span className={`status-badge-lucide ${personalStats.status.class}`}>
                  {personalStats.status.icon} {personalStats.status.label}
                </span>
                <span className="rank-indicator">
                  <Trophy size={12} className="inline-icon" /> #{personalStats.rank} Ranking
                </span>
              </div>
            </div>
            
            <div className="hero-right-stats">
              <div className="hero-stat">
                <span className="hero-label">Posizione</span>
                <span className="hero-value text-blue">#{personalStats.rank}</span>
              </div>
              <div className="hero-stat">
                <span className="hero-label">Partite</span>
                <span className="hero-value">{personalStats.partite}</span>
              </div>
              <div className="hero-stat">
                <span className="hero-label">Vittorie</span>
                <span className="hero-value text-green">{personalStats.vittorie}</span>
              </div>
              <div className="hero-stat">
                <span className="hero-label">Goal</span>
                <span className="hero-value text-orange">{personalStats.goal}</span>
              </div>
            </div>
          </div>

          <div className="section-card horizontal-analysis">
            <div className="adv-stat"><span>Win Rate</span><strong>{Math.round((personalStats.vittorie / personalStats.partite) * 100)}%</strong></div>
            <div className="adv-stat"><span>Miglior Streak</span><strong>{personalStats.records.streak}V</strong></div>
            <div className="adv-stat"><span>Max Goal Match</span><strong>{personalStats.records.maxGoal}</strong></div>
            <div className="adv-stat"><span>Media Punti</span><strong>{(personalStats.punti / personalStats.partite).toFixed(2)}</strong></div>
            <div className="adv-stat"><span>Media Goal</span><strong>{(personalStats.goal / personalStats.partite).toFixed(2)}</strong></div>
            <div className="adv-stat"><span>DR Totale</span><strong className={personalStats.drTotale >= 0 ? 'text-green' : 'text-red'}>{personalStats.drTotale}</strong></div>
          </div>

          <div className="details-layout">
            <div className="left-col section-card">
              <h3><History size={16} className="title-icon" /> Ultime 5 Prestazioni</h3>
              <div className="history-list">
                {personalStats.matchHistory.slice(0, 5).map((m, i) => (
                  <div key={i} className="history-item">
                    <span className="m-date">{new Date(m.data).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}</span>
                    <span className={`m-res res-${m.risultato}`}>{m.risultato}</span>
                    <span className={`m-dr ${m.dr >= 0 ? 'plus' : 'minus'}`}>{m.dr > 0 ? `+${m.dr}` : m.dr} DR</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="right-col section-card">
              <h3><Handshake size={16} className="title-icon" /> Partner in Crime</h3>
              {personalStats.bestPartner ? (
                <div className="partner-content">
                  <div className="partner-avatar-lucide">
                    <UserCheck size={24} />
                  </div>
                  <div className="partner-info">
                    <span className="partner-name">{personalStats.bestPartner.nome}</span>
                    <span className="partner-sub">Vincete il <strong>{Math.round((personalStats.bestPartner.win / personalStats.bestPartner.total) * 100)}%</strong> dei match</span>
                  </div>
                </div>
              ) : <p className="empty-info">Affinità non sufficiente o dati insufficienti.</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <UserCheck size={48} className="empty-icon-lucide" />
          </div>
          <h2>Cerca un Giocatore</h2>
          <p>Naviga tra i profili per scoprire chi è in forma e chi domina la classifica</p>
        </div>
      )}
    </div>
  );
};

export default PlayerStatsPage;