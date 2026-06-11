import React, { useState } from 'react';
import './MatchPage.css';

const MatchPage = ({ matches = [], onStartEdit, onDeleteMatch }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  return (
    <div className="history-section-pro">
      <h3 className="section-title-pro">Storico Partite</h3>
      
      <div className="history-grid-pro">
        {matches.length > 0 ? (
          matches.map((m) => {
            const dettagli = m.match_details || {};
            const partecipanti = dettagli.partecipanti || [];
            const vincitore = dettagli.vincitore || 'Pareggio';

            return (
              <div key={m.id} className="history-card-pro card-pro">
                <div className="h-top-bar">
                  <span className="h-date">
                    {new Date(m.data).toLocaleDateString('it-IT')} • {m.format}
                  </span>
                  <button 
                    className="btn-info-modal"
                    onClick={() => setSelectedMatch(m)}
                    title="Visualizza Formazioni"
                  >
                    ℹ️ Formazioni
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
                  {['Nera', 'Bianca'].map(team => {
                    const scorers = partecipanti.filter(p => p.squadra === team && p.goal > 0);
                    const autogoals = partecipanti.filter(p => p.squadra === team && (p.ag > 0 || p.autogoal > 0));

                    return (
                      <div key={team} className="h-col">
                        <div className="scorer-group">
                          <strong>Goal {team === 'Nera' ? 'Neri' : 'Bianchi'}:</strong>
                          <span className="scorers-list">
                            {scorers.map(p => `${p.nome}${p.goal > 1 ? ` (${p.goal})` : ''}`).join(', ') || '-'}
                          </span>
                        </div>
                        {autogoals.length > 0 && (
                          <div className="ag-group">
                            <strong className="ag-label">Autogol {team === 'Nera' ? 'Neri' : 'Bianchi'}:</strong>
                            <span className="ag-list">
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
          <div className="empty-history">Nessuna partita registrata finora.</div>
        )}
      </div>

      {/* modal POP-UP DETTAGLIO FORMAZIONI */}
      {selectedMatch && (() => {
        const partecipanti = selectedMatch.match_details?.partecipanti || [];
        const squadre = {
          Nera: partecipanti.filter(p => p.squadra === 'Nera'),
          Bianca: partecipanti.filter(p => p.squadra === 'Bianca')
        };

        return (
          <div className="modal-overlay-pro" onClick={() => setSelectedMatch(null)}>
            <div className="modal-content-pro" onClick={(e) => e.stopPropagation()}>
              
              <div className="modal-header-pro">
                <div className="modal-title-container">
                  <h4>Dettaglio Formazioni</h4>
                  <span className="modal-subtitle">
                    {new Date(selectedMatch.data).toLocaleDateString('it-IT')} • {selectedMatch.format}
                  </span>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedMatch(null)}>&times;</button>
              </div>

              <div className="modal-score-banner">
                <div className="modal-banner-team text-black">Nera <span>{selectedMatch.score_nera}</span></div>
                <div className="modal-banner-sep">-</div>
                <div className="modal-banner-team text-white">Bianca <span>{selectedMatch.score_bianca}</span></div>
              </div>

              <div className="modal-body-squads">
                {Object.entries(squadre).map(([squadraNome, listaGiocatori]) => (
                  <div key={squadraNome} className="modal-squad-block">
                    <div className={`modal-squad-header block-${squadraNome.toLowerCase()}`}>
                      {squadraNome === 'Nera' ? '⚫' : '⚪'} Formazione {squadraNome} ({listaGiocatori.length})
                    </div>
                    <ul className="modal-players-list">
                      {listaGiocatori.length > 0 ? (
                        listaGiocatori.map(p => (
                          <li key={p.playerId || p.id || p.nome} className="modal-player-item">
                            <div className={`modal-player-badge badge-${squadraNome.toLowerCase()}`}>👕</div>
                            <span className="modal-player-name">{p.nome}</span>
                          </li>
                        ))
                      ) : (
                        <li className="modal-no-players">Nessun giocatore</li>
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