import React, { useState } from 'react';
import './MatchPage.css';

const MatchPage = ({ matches, onStartEdit, onDeleteMatch }) => {
  // Stato per salvare la partita di cui si vogliono vedere le formazioni nel modal
  const [selectedMatch, setSelectedMatch] = useState(null);

  const openModal = (match) => {
    setSelectedMatch(match);
  };

  const closeModal = () => {
    setSelectedMatch(null);
  };

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
                  {/* Pulsante per aprire il modal con le formazioni */}
                  <button 
                    className="btn-info-modal"
                    onClick={() => openModal(m)}
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
              </div>
            );
          })
        ) : (
          <div className="empty-history">Nessuna partita registrata finora.</div>
        )}
      </div>

      {/* 🏆 STRUTTURA DEL MODAL POP-UP */}
      {selectedMatch && (() => {
        const dettagli = selectedMatch.match_details || {};
        const partecipanti = dettagli.partecipanti || [];
        const squadraNera = partecipanti.filter(p => p.squadra === 'Nera');
        const squadraBianca = partecipanti.filter(p => p.squadra === 'Bianca');

        return (
          <div className="modal-overlay-pro" onClick={closeModal}>
            <div className="modal-content-pro" onClick={(e) => e.stopPropagation()}>
              
              <div className="modal-header-pro">
                <div className="modal-title-container">
                  <h4>Dettaglio Formazioni</h4>
                  <span className="modal-subtitle">
                    {new Date(selectedMatch.data).toLocaleDateString('it-IT')} • {selectedMatch.format}
                  </span>
                </div>
                <button className="modal-close-btn" onClick={closeModal}>&times;</button>
              </div>

              <div className="modal-score-banner">
                <div className="modal-banner-team text-black">Nera <span>{selectedMatch.score_nera}</span></div>
                <div className="modal-banner-sep">-</div>
                <div className="modal-banner-team text-white">Bianca <span>{selectedMatch.score_bianca}</span></div>
              </div>

              <div className="modal-body-squads">
                {/* BLOCCO SQUADRA NERA */}
                <div className="modal-squad-block">
                  <div className="modal-squad-header block-black">
                    ⚫ Formazione Nera ({squadraNera.length})
                  </div>
                  <ul className="modal-players-list">
                    {squadraNera.length > 0 ? (
                      squadraNera.map(p => (
                        <li key={p.playerId || p.id || p.nome} className="modal-player-item">
                          {/* Cerchietto Tattico Nero */}
                          <div className="modal-player-badge badge-black">👕</div>
                          <span className="modal-player-name">{p.nome}</span>
                        </li>
                      ))
                    ) : (
                      <li className="modal-no-players">Nessun giocatore</li>
                    )}
                  </ul>
                </div>

                {/* BLOCCO SQUADRA BIANCA */}
                <div className="modal-squad-block">
                  <div className="modal-squad-header block-white">
                    ⚪ Formazione Bianca ({squadraBianca.length})
                  </div>
                  <ul className="modal-players-list">
                    {squadraBianca.length > 0 ? (
                      squadraBianca.map(p => (
                        <li key={p.playerId || p.id || p.nome} className="modal-player-item">
                          {/* Cerchietto Tattico Bianco */}
                          <div className="modal-player-badge badge-white">👕</div>
                          <span className="modal-player-name">{p.nome}</span>
                        </li>
                      ))
                    ) : (
                      <li className="modal-no-players">Nessun giocatore</li>
                    )}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default MatchPage;