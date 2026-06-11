import React from 'react';
import './MatchHistory.css';

const MatchHistory = ({ matches = [], onStartEdit, onDeleteMatch }) => {
  return (
    <div className="history-section-pro">
      <h3 className="section-title-pro">Storico Risultati</h3>
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
                  <div className="h-actions">
                    <button className="btn-edit" onClick={() => onStartEdit(m)}>Modifica</button>
                    <button className="btn-del" onClick={() => onDeleteMatch(m)}>Elimina</button>
                  </div>
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
    </div>
  );
};

export default MatchHistory;