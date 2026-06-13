import React, { useState } from 'react';
import './MatchPage.css';

// IMPORTAZIONE DELLE ICONE DI LUCIDE-REACT
import { 
  CalendarDays, 
  Users, 
  Info,
  Shirt, 
  Circle, 
  X,
  Icon
} from 'lucide-react';

import {
    soccerBall as SoccerBall,
    soccerPitch as SoccerPitch
} from '@lucide/lab';

const MatchPage = ({ matches = [], onStartEdit, onDeleteMatch }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  return (
    <div className="mp-history-section">
      <h3 className="mp-section-title">Storico Partite</h3>
      
      <div className="mp-history-grid">
        {matches.length > 0 ? (
          matches.map((m) => {
            const dettagli = m.match_details || {};
            const partecipanti = dettagli.partecipanti || [];
            const vincitore = dettagli.vincitore || 'Pareggio';

            return (
              <div key={m.id} className="mp-history-card">
                <div className="mp-card-top-bar">
                  <span className="mp-card-date">
                    <CalendarDays size={14} className="mp-inline-icon" /> {new Date(m.data).toLocaleDateString('it-IT')} • {m.format}
                  </span>
                  <button 
                    className="mp-btn-trigger-modal"
                    onClick={() => setSelectedMatch(m)}
                    title="Visualizza Formazioni"
                  >
                    <Info size={13} /> Formazioni
                  </button>
                </div>

                <div className="mp-score-row">
                  <div className={`mp-team-block ${vincitore === 'Nera' ? 'mp-is-winner' : ''}`}>
                    <span className="mp-team-name">Nera</span>
                    <span className="mp-team-score-val">{m.score_nera}</span>
                  </div>
                  <div className="mp-score-separator">:</div>
                  <div className={`mp-team-block ${vincitore === 'Bianca' ? 'mp-is-winner' : ''}`}>
                    <span className="mp-team-name">Bianca</span>
                    <span className="mp-team-score-val">{m.score_bianca}</span>
                  </div>
                </div>

                <div className="mp-card-footer-scorers">
                  {['Nera', 'Bianca'].map(team => {
                    const scorers = partecipanti.filter(p => p.squadra === team && p.goal > 0);
                    const autogoals = partecipanti.filter(p => p.squadra === team && (p.ag > 0 || p.autogoal > 0));

                    return (
                      <div key={team} className="mp-scorer-column">
                        <div className="mp-scorer-subgroup">
                          <strong className="mp-scorer-title">Goal {team === 'Nera' ? 'Neri' : 'Bianchi'}:</strong>
                          <span className="mp-scorers-names-list">
                            {scorers.map(p => `${p.nome}${p.goal > 1 ? ` (${p.goal})` : ''}`).join(', ') || '-'}
                          </span>
                        </div>
                        {autogoals.length > 0 && (
                          <div className="mp-ag-subgroup">
                            <strong className="mp-scorer-title mp-label-autogoal">Autogol {team === 'Nera' ? 'Neri' : 'Bianchi'}:</strong>
                            <span className="mp-ag-names-list">
                              {autogoals.map(p => `${p.nome}${(p.ag || p.autogoal) > 1 ? ` (${p.ag || p.autogoal})` : ''}`).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="mp-empty-history-notice">Nessuna partita registrata finora.</div>
        )}
      </div>

      {/* MODAL POP-UP DETTAGLIO FORMAZIONI */}
      {selectedMatch && (() => {
        const partecipanti = selectedMatch.match_details?.partecipanti || [];
        const squadre = {
          Nera: partecipanti.filter(p => p.squadra === 'Nera'),
          Bianca: partecipanti.filter(p => p.squadra === 'Bianca')
        };

        return (
          <div className="mp-modal-overlay" onClick={() => setSelectedMatch(null)}>
            <div className="mp-modal-window" onClick={(e) => e.stopPropagation()}>
              
              <div className="mp-modal-header">
                <div className="mp-modal-title-wrapper">
                  <h4 className="mp-modal-main-title">Dettaglio Formazioni</h4>
                  <span className="mp-modal-subtitle">
                    <CalendarDays size={12} className="mp-inline-icon" /> {new Date(selectedMatch.data).toLocaleDateString('it-IT')} • {selectedMatch.format}
                  </span>
                </div>
                <button className="mp-modal-close-action" onClick={() => setSelectedMatch(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="mp-modal-score-banner">
                <div className="mp-modal-banner-team mp-banner-text-nera">Nera <span>{selectedMatch.score_nera}</span></div>
                <div className="mp-modal-banner-divider">-</div>
                <div className="mp-modal-banner-team mp-banner-text-bianca">Bianca <span>{selectedMatch.score_bianca}</span></div>
              </div>

              <div className="mp-modal-body-content">
                {Object.entries(squadre).map(([squadraNome, listaGiocatori]) => (
                  <div key={squadraNome} className="mp-modal-squad-section">
                    <div className={`mp-modal-squad-heading mp-heading-group-${squadraNome.toLowerCase()}`}>
                      <Circle 
                        size={13} 
                        className={`mp-squad-circle-marker mp-marker-${squadraNome.toLowerCase()}`}
                      /> 
                      Formazione {squadraNome}
                    </div>
                    <ul className="mp-modal-list-players">
                      {listaGiocatori.length > 0 ? (
                        listaGiocatori.map(p => {
                          const numGoals = p.goal || 0;
                          const numAutogoals = p.ag || p.autogoal || 0;

                          return (
                            <li key={p.playerId || p.id || p.nome} className={`mp-modal-player-row mp-row-team-${squadraNome.toLowerCase()}`}>
                              <div className={`mp-modal-shirt-badge mp-shirt-badge-${squadraNome.toLowerCase()}`}>
                                <Shirt size={14} className="mp-shirt-icon-render" />
                              </div>
                              <span className="mp-modal-player-display-name">{p.nome}</span>
                              
                              {/* SEZIONE ICONE MARCATORE / AUTOGOL INLINE */}
                              <div className="mp-modal-player-inline-stats">
                                {numGoals > 0 && (
                                  <span className="mp-modal-stat-pill-badge mp-pill-goal" title={`Ha segnato ${numGoals} gol`}>
                                    <Icon iconNode={SoccerBall} className="mp-modal-ball-svg mp-ball-color-goal" />
                                    {numGoals > 1 && <span className="mp-modal-stat-multiplier">x{numGoals}</span>}
                                  </span>
                                )}
                                {numAutogoals > 0 && (
                                  <span className="mp-modal-stat-pill-badge mp-pill-autogoal" title={`Ha fatto ${numAutogoals} autogol`}>
                                    <Icon iconNode={SoccerBall} className="mp-modal-ball-svg mp-ball-color-autogoal" />
                                    {numAutogoals > 1 && <span className="mp-modal-stat-multiplier">x{numAutogoals}</span>}
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <li className="mp-modal-no-players-fallback">Nessun giocatore</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default MatchPage;