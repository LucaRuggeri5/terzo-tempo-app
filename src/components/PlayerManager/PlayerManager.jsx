import React, { useState } from 'react';
import './PlayerManager.css';

const PlayerManager = ({ players, onAddPlayer, onDeletePlayer, onUpdatePlayer }) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [playerToDelete, setPlayerToDelete] = useState(null);

  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName);
      setNewPlayerName('');
    }
  };

  const startEditing = (p) => {
    setEditValue(p.nome);
    setEditingPlayerId(p.id);
  };

  const saveEdit = (id) => {
    if (editValue.trim() !== "") {
      onUpdatePlayer(id, editValue);
    }
    setEditingPlayerId(null);
  };

  return (
    <div className="admin-section-pro">
      {/* Overlay Conferma Eliminazione */}
      {playerToDelete && (
        <div className="fixed-overlay-admin">
          <div className="confirm-modal-mini card-pro">
            <div className="modal-icon-mini">🗑️</div>
            <h4>Elimina Giocatore?</h4>
            <p>Vuoi davvero rimuovere <strong>{playerToDelete.nome}</strong>?</p>
            <div className="modal-actions-mini">
              <button className="btn-cancel-mini" onClick={() => setPlayerToDelete(null)}>Annulla</button>
              <button className="btn-danger-mini" onClick={() => {
                onDeletePlayer(playerToDelete.id);
                setPlayerToDelete(null);
              }}>Elimina</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Gestione */}
      <div className="admin-header-row" onClick={() => setShowAdmin(!showAdmin)}>
        <div className="admin-title">
          <span className="admin-icon">⚙️</span>
          <h3>Gestione Giocatori</h3>
        </div>
        <button className={`admin-toggle-btn ${showAdmin ? 'active' : ''}`}>
          {showAdmin ? "⬆️" : "⬇️"}
        </button>
      </div>

      {showAdmin && (
        <div className="admin-content-pro card-pro">
          <div className="admin-add-player">
            <input
              type="text"
              placeholder="Nome e Cognome..."
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button onClick={handleAdd}>Aggiungi Giocatore</button>
          </div>

          <div className="admin-player-chips-container">
            {players && players.map((p) => (
              <div key={p.id} className={`player-pill-pro ${editingPlayerId === p.id ? 'is-editing' : ''}`}>
                {editingPlayerId === p.id ? (
                  <div className="pill-edit-wrapper">
                    <input
                      className="pill-edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(p.id);
                        if (e.key === 'Escape') setEditingPlayerId(null);
                      }}
                      autoFocus
                    />
                    <button
                      className="pill-save-btn"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Impedisce la perdita del focus dell'input prima del click
                        saveEdit(p.id);
                      }}
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="pill-name">{p.nome}</span>
                    <div className="pill-actions">
                      <span className="pill-edit-icon" onClick={() => startEditing(p)}>✎</span>
                      <span className="pill-delete" onClick={() => setPlayerToDelete(p)}>×</span>
                    </div>
                  </>
                )}
              </div>
            ))}
            {players.length === 0 && <p className="empty-msg">Nessun giocatore nel database.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerManager;