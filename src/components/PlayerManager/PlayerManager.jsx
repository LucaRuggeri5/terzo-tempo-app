import React, { useState } from 'react';
import './PlayerManager.css';

// IMPORTAZIONE DELLE ICONE DI LUCIDE-REACT
import { 
  Users, 
  Settings, 
  ChevronUp, 
  ChevronDown, 
  UserPlus, 
  UserCheck,
  UserX,
  Pencil, 
  Trash2, 
  Check, 
  X 
} from 'lucide-react';

const PlayerManager = ({ players = [], onAddPlayer, onDeletePlayer, onUpdatePlayer }) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Stato isolato per gestire la comparsa e il testo del toast locale
  const [toastMessage, setToastMessage] = useState('');

  // Funzione helper riutilizzabile per attivare il toast e smontarlo dopo 3 secondi
  const triggerToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleAdd = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName);
      triggerToast(`Giocatore "${newPlayerName.trim()}" aggiunto con successo!`);
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
      triggerToast("Nome del giocatore modificato con successo!");
    }
    setEditingPlayerId(null);
  };

  return (
    <div className="admin-section-pro">
      {/* RENDERIZZAZIONE DEL TOAST GRAFICO IN ALTO A DESTRA */}
      <div className={`tactical-toast-layer ${toastMessage ? 'show-toast' : ''}`}>
        <div className="tactical-toast-pill">
          <UserCheck size={16} className="toast-success-icon-lucide" />
          <span>{toastMessage}</span>
        </div>
      </div>

      {playerToDelete && (
        <div className="fixed-overlay-admin" onClick={() => setPlayerToDelete(null)}>
          <div className="confirm-modal-mini card-pro" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-mini-wrapper">
              <Trash2 size={32} className="modal-icon-mini-lucide" />
            </div>
            <h4>Elimina Giocatore?</h4>
            <p>Vuoi davvero rimuovere <strong>{playerToDelete.nome}</strong>?</p>
            <div className="modal-actions-mini">
              <button className="btn-cancel-mini" onClick={() => setPlayerToDelete(null)}>Annulla</button>
              <button className="btn-danger-mini" onClick={() => {
                onDeletePlayer(playerToDelete.id);
                triggerToast(`Giocatore "${playerToDelete.nome}" eliminato`);
                setPlayerToDelete(null);
              }}>Elimina</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-header-row" onClick={() => setShowAdmin(!showAdmin)}>
        <div className="admin-title">
          <Settings size={18} className="admin-icon-lucide-gear" />
          <h3>Gestione Giocatori</h3>
        </div>
        <button className={`admin-toggle-btn ${showAdmin ? 'active' : ''}`} type="button">
          {showAdmin ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {showAdmin && (
        <div className="admin-content-pro card-pro">
          <div className="admin-add-player">
            <div className="input-with-icon-wrapper">
              <Users size={16} className="input-inner-icon-lucide" />
              <input
                type="text"
                placeholder="Nome e Cognome..."
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <button onClick={handleAdd}>
              <UserPlus size={16} /> Aggiungi Giocatore
            </button>
          </div>

          <div className="admin-player-chips-container">
            {players.map((p) => (
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
                    <button className="pill-save-btn" onMouseDown={(e) => { e.preventDefault(); saveEdit(p.id); }}>
                      <Check size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="pill-name">{p.nome}</span>
                    <div className="pill-actions">
                      <button className="pill-action-btn action-edit" onClick={() => startEditing(p)} title="Modifica">
                        <Pencil size={13} />
                      </button>
                      <button className="pill-action-btn action-delete" onClick={() => setPlayerToDelete(p)} title="Elimina">
                        <X size={15} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {players.length === 0 && (
              <p className="empty-msg">
                <UserX size={16} className="inline-icon-manager" /> Nessun giocatore nel database.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerManager;