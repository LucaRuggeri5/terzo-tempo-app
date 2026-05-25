import React, { useState } from 'react';
import './MatchPage.css';

const MatchPage = ({ matches, onStartEdit, onDeleteMatch }) => {
  // Stato per gestire quali schede sono espanse
  const [expandedMatches, setExpandedMatches] = useState({});

  const toggleSquads = (matchId) => {
    setExpandedMatches(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  // Verifichiamo se c'è almeno una partita espansa nel grid
  const isAnyExpanded = Object.values(expandedMatches).some(val => val === true);

  return (
    <div className="history-section-pro">
      <h3 className="section-title-pro">Storico Partite</h3>
      
      <div className={`history-grid-pro ${isAnyExpanded ? 'any-expanded' : ''}`}>
        {matches.length > 0 ? (
          matches.map((m) => {
            const dettagli = m.match_details || {};
            const partecipanti = dettagli.partecipanti || [];
            const vincitore = dettagli.vincitore || 'Pareggio';
            const isExpanded = !!expandedMatches[m.id];

            const squadraNera = partecipanti.filter(p => p.squadra === 'Nera');
            const squadraBianca = partecipanti.filter(p => p.squadra === 'Bianca');

            return (
              <div key={m.id} className={`history-card-pro card-pro ${isExpanded ? 'is-expanded' : ''}`}>
                <div className="h-top-bar">
                  <span className="h-date">
                    {new Date(m.data).toLocaleDateString('it-IT')} • {m.format}
                  </span>
                  <button 
                    className={`btn-view-squads ${isExpanded ? 'active' : ''}`}
                    onClick={() => toggleSquads(m.id)}
                  >
                    👥 Formazioni {isExpanded ? '▲' : '▼'}
                  </button>
                </div>

                <div className="h-score-row">
                  <div className={`h-team ${vincitore === 'Nera' ? 'winner' : ''}`}>
                    <span className="h-name">Nera</span>
                    <span className="h-val">{m.score_nera}</span>
                  </div>
                  <div className="h-sep">:</div>
                  <div className={`h-team ${vincitore === 'Bianca' ? 'winner' : ''}`}>
                    <span className="h-name">Bianca</span>
                    <span className="h-val">{m.score_bianca}</span>
                  </div>
                </div>

                <div className="h-footer-scorers">
                  <div className="h-col">
                    <div className="scorer-group">
                      <strong>Goal Neri:</strong>
                      <span className="scorers-list">
                        {partecipanti
                          .filter(p => p.squadra === 'Nera' && p.goal > 0)
                          .map(p => `${p.nome}${p.goal > 1 ? ` (${p.goal})` : ''}`)
                          .join(', ') || '-'}
                      </span>
                    </div>
                    {partecipanti.some(p => p.squadra === 'Nera' && (p.ag > 0 || p.autogoal > 0)) && (
                      <div className="ag-group">
                        <strong className="ag-label">Autogol Neri:</strong>
                        <span className="ag-list">
                          {partecipanti
                            .filter(p => p.squadra === 'Nera' && (p.ag > 0 || p.autogoal > 0))
                            .map(p => `${p.nome}${(p.ag || p.autogoal) > 1 ? ` (${p.ag || p.autogoal})` : ''}`)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="h-col">
                    <div className="scorer-group">
                      <strong>Goal Bianchi:</strong>
                      <span className="scorers-list">
                        {partecipanti
                          .filter(p => p.squadra === 'Bianca' && p.goal > 0)
                          .map(p => `${p.nome}${p.goal > 1 ? ` (${p.goal})` : ''}`)
                          .join(', ') || '-'}
                      </span>
                    </div>
                    {partecipanti.some(p => p.squadra === 'Bianca' && (p.ag > 0 || p.autogoal > 0)) && (
                      <div className="ag-group">
                        <strong className="ag-label">Autogol Bianchi:</strong>
                        <span className="ag-list">
                          {partecipanti
                            .filter(p => p.squadra === 'Bianca' && (p.ag > 0 || p.autogoal > 0))
                            .map(p => `${p.nome}${(p.ag || p.autogoal) > 1 ? ` (${p.ag || p.autogoal})` : ''}`)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 📂 TENDINA CON ANIMAZIONE AD ALTEZZA REALE */}
                <div className={`squads-dropdown ${isExpanded ? 'open' : ''}`}>
                  <div className="squads-dropdown-container">
                    <div className="dropdown-divider"></div>
                    
                    {/* LISTA NERA */}
                    <div className="squads-list-block">
                      <div className="squad-list-header text-black">
                        <span className="team-indicator-dot dot-black"></span>
                        Formazione Nera
                      </div>
                      <ul className="inline-players-list">
                        {squadraNera.length > 0 ? (
                          squadraNera.map(p => (
                            <li key={p.playerId || p.id || p.nome} className="inline-player-item">
                              <span className="player-shirt-icon">👕</span>
                              <span className="player-name-text">{p.nome}</span>
                            </li>
                          ))
                        ) : (
                          <li className="no-players-text">Nessun giocatore</li>
                        )}
                      </ul>
                    </div>

                    {/* LISTA BIANCA */}
                    <div className="squads-list-block">
                      <div className="squad-list-header text-white">
                        <span className="team-indicator-dot dot-white"></span>
                        Formazione Bianca
                      </div>
                      <ul className="inline-players-list">
                        {squadraBianca.length > 0 ? (
                          squadraBianca.map(p => (
                            <li key={p.playerId || p.id || p.nome} className="inline-player-item">
                              <span className="player-shirt-icon">👕</span>
                              <span className="player-name-text">{p.nome}</span>
                            </li>
                          ))
                        ) : (
                          <li className="no-players-text">Nessun giocatore</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-history">Nessuna partita registrata finora.</div>
        )}
      </div>
    </div>
  );
};

export default MatchPage;