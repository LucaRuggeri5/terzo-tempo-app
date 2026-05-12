import React, { useMemo } from 'react';
import './MatchOverlays.css';

const MatchOverlays = ({ 
  matchToDelete, 
  setMatchToDelete, 
  onDeleteMatch,
  activeDrawerTeam, 
  setActiveDrawerTeam, 
  teamCounts, 
  matchType, 
  selectedMatchPlayers, 
  removePlayerFromMatch, 
  availablePlayers, 
  addPlayerToTeam 
}) => {
  
  // Ordiniamo i giocatori disponibili per nome per facilitare la ricerca visiva
  const sortedAvailable = useMemo(() => {
    return [...availablePlayers].sort((a, b) => a.nome.localeCompare(b.nome));
  }, [availablePlayers]);

  return (
    <>
      {/* 🛑 MODALE ELIMINAZIONE */}
      {matchToDelete && (
        <div className="fixed-overlay">
          <div className="confirm-modal-pro card-pro">
            <div className="modal-icon">⚠️</div>
            <h3>Elimina Partita</h3>
            <p>Sei sicuro di voler rimuovere la partita del <strong>{new Date(matchToDelete.data).toLocaleDateString('it-IT')}</strong>?</p>
            <div className="modal-actions-pro">
              <button className="btn-cancel-pro" onClick={() => setMatchToDelete(null)}>Annulla</button>
              <button className="btn-danger-pro" onClick={() => { onDeleteMatch(matchToDelete.id); setMatchToDelete(null); }}>Conferma</button>
            </div>
          </div>
        </div>
      )}

      {/* 📋 DRAWER CONVOCAZIONI (Mobile & Desktop) */}
      {activeDrawerTeam && (
        <div className="fixed-overlay drawer-mobile-overlay" onClick={() => setActiveDrawerTeam(null)}>
          <div className={`drawer-modal-pro team-${activeDrawerTeam.toLowerCase()}`} onClick={e => e.stopPropagation()}>
            <div className="drawer-header-pro">
              <div className="drawer-title-row">
                <h3>Convocazioni {activeDrawerTeam}</h3>
                <span className="count-badge-pro">
                  {teamCounts[activeDrawerTeam.toLowerCase()] || 0}/{matchType}
                </span>
              </div>
              <div className="drawer-selection-summary">
                <div className="summary-chips">
                  {selectedMatchPlayers
                    .filter(p => p.squadra === activeDrawerTeam)
                    .map(p => (
                      <span key={p.playerId} className="mini-chip-pro">
                        {p.nome} 
                        <button className="remove-chip-btn" onClick={() => removePlayerFromMatch(p.playerId)}>×</button>
                      </span>
                    ))}
                  {selectedMatchPlayers.filter(p => p.squadra === activeDrawerTeam).length === 0 && (
                    <span className="empty-label">Seleziona i giocatori dalla lista</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="drawer-body-grid">
              {sortedAvailable.map(p => (
                <button 
                  key={p.id} 
                  className="player-select-btn" 
                  onClick={() => addPlayerToTeam(p)}
                >
                  {p.nome}
                </button>
              ))}
              {sortedAvailable.length === 0 && (
                <p className="all-selected-msg">Tutti i giocatori sono stati convocati o non ci sono altri profili.</p>
              )}
            </div>
            
            <button className="btn-drawer-close" onClick={() => setActiveDrawerTeam(null)}>
              CONFERMA
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MatchOverlays;