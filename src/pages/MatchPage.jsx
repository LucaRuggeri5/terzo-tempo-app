import React from 'react';
import './MatchPage.css';

const MatchPage = ({ matches, onStartEdit, onDeleteMatch }) => {
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
                  {/* COLONNA NERA */}
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
                    {/* Visualizzazione Autogol della squadra Nera (fatti a favore della Bianca) */}
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

                  {/* COLONNA BIANCA */}
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
                    {/* Visualizzazione Autogol della squadra Bianca (fatti a favore della Nera) */}
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