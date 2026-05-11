import React from 'react';
import './MatchPage.css';

const MatchPage = ({ matches, onStartEdit, onDeleteMatch }) => {
  return (
    <div className="history-section-pro">
      <h3 className="section-title-pro">Storico Partite</h3>
      <div className="history-grid-pro">
        {matches.length > 0 ? (
          matches.slice().reverse().map((m) => (
            <div key={m.id} className="history-card-pro card-pro">
              <div className="h-top-bar">
                <span className="h-date">{m.data} • C{m.matchType}</span>
              </div>

              <div className="h-score-row">
                <div className={`h-team ${m.vincitore === 'Nera' ? 'winner' : ''}`}>
                  <span className="h-name">Nera</span>
                  <span className="h-val">{m.scoreNera}</span>
                </div>
                <div className="h-sep">:</div>
                <div className={`h-team ${m.vincitore === 'Bianca' ? 'winner' : ''}`}>
                  <span className="h-name">Bianca</span>
                  <span className="h-val">{m.scoreBianca}</span>
                </div>
              </div>

              <div className="h-footer-scorers">
                <div className="h-col">
                  <strong>Marcatori:</strong>
                  <span className="scorers-list">
                    {m.partecipanti
                      .filter(p => p.squadra === 'Nera' && (p.goal > 0 || p.ag > 0))
                      .map(p => `${p.nome}${p.goal > 1 ? ` (${p.goal})` : ''}`)
                      .join(', ') || '-'}
                  </span>
                </div>
                <div className="h-col">
                  <strong>Marcatori:</strong>
                  <span className="scorers-list">
                    {m.partecipanti
                      .filter(p => p.squadra === 'Bianca' && (p.goal > 0 || p.ag > 0))
                      .map(p => `${p.nome}${p.goal > 1 ? ` (${p.goal})` : ''}`)
                      .join(', ') || '-'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-history">Nessun match registrato finora.</div>
        )}
      </div>
    </div>
  );
};

export default MatchPage;