import React from 'react';
import './MatchForm.css';

// IMPORTAZIONE DELLE ICONE DI LUCIDE-REACT
import { 
  FilePlus2, 
  FileCode, 
  CalendarDays, 
  Settings2, 
  Users, 
  UserPlus2, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Icon
} from 'lucide-react';

import {
    soccerBall as SoccerBall,
    soccerPitch as SoccerPitch
} from '@lucide/lab';

const MatchForm = ({
  editingMatchId,
  matchType, setMatchType,
  date, setDate,
  scoreNera, setScoreNera,
  scoreBianca, setScoreBianca,
  teamCounts,
  selectedMatchPlayers = [],
  setActiveDrawerTeam,
  adjustStat,
  removePlayerFromMatch,
  isFormValid,
  handleMatchSubmit
}) => {

  const getGoalStatus = (team) => {
    const totalInputScore = team === 'nera' ? parseInt(scoreNera || 0) : parseInt(scoreBianca || 0);

    const goalsByPlayers = selectedMatchPlayers
      .filter(p => p.squadra === (team === 'nera' ? 'Nera' : 'Bianca'))
      .reduce((sum, p) => sum + (p.goal || 0), 0);

    const autogoalsByOpponents = selectedMatchPlayers
      .filter(p => p.squadra === (team === 'nera' ? 'Bianca' : 'Nera'))
      .reduce((sum, p) => sum + (p.ag || 0), 0);

    const assignedTotal = goalsByPlayers + autogoalsByOpponents;

    return {
      assigned: assignedTotal,
      target: totalInputScore,
      isOk: assignedTotal === totalInputScore && totalInputScore >= 0
    };
  };

  return (
    <div className="main-match-card card-pro">
      <div className="card-header-pro">
        <h2>
          {editingMatchId ? (
            <>
              <FileCode className="header-title-icon" size={22} /> Modifica Partita
            </>
          ) : (
            <>
              <FilePlus2 className="header-title-icon" size={22} /> Nuova Partita
            </>
          )}
        </h2>
        <div className="header-controls">
          <div className="control-field">
            <label><Settings2 size={10} className="label-icon-inline" /> Formato</label>
            <select
              className="modern-select"
              value={matchType}
              onChange={(e) => setMatchType(parseInt(e.target.value))}
            >
              {[8, 5, 6, 7, 11].map(n => <option key={n} value={n}>Calcio a {n}</option>)}
            </select>
          </div>
          <div className="control-field">
            <label><CalendarDays size={10} className="label-icon-inline" /> Data</label>
            <input
              type="date"
              className="modern-date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="match-score-strip">
        <div className="score-live-input">
          <div className="team-score-block">
            <label>SQUADRA NERA</label>
            <input type="number" placeholder="0" value={scoreNera} onChange={(e) => setScoreNera(e.target.value)} />
          </div>
          <div className="vs-sep">VS</div>
          <div className="team-score-block">
            <label>SQUADRA BIANCA</label>
            <input type="number" placeholder="0" value={scoreBianca} onChange={(e) => setScoreBianca(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="squads-builder-grid">
        {['Nera', 'Bianca'].map(team => {
          const goalStatus = getGoalStatus(team.toLowerCase());
          return (
            <div key={team} className={`squad-column-pro ${team.toLowerCase()}-theme`}>
              <div className="squad-header-pro">
                <h3>SQUADRA {team.toUpperCase()}</h3>
                <div className="squad-badges-group">
                  <span className={`squad-badge ${teamCounts[team.toLowerCase()] === matchType ? 'ok' : ''}`}>
                    <Users size={12} className="badge-inner-icon" /> {teamCounts[team.toLowerCase()]}/{matchType}
                  </span>
                  <span className={`squad-badge badge-goals ${goalStatus.isOk ? 'ok' : ''}`}>
                    {goalStatus.isOk ? (
                      <Icon iconNode={SoccerBall} size={12} className="badge-inner-icon text-ready" />
                    ) : (
                      <AlertCircle size={12} className="badge-inner-icon" />
                    )}
                    {goalStatus.assigned}/{goalStatus.target}
                  </span>
                </div>
              </div>

              {teamCounts[team.toLowerCase()] < matchType && (
                <button className="btn-add-p-trigger" onClick={() => setActiveDrawerTeam(team)}>
                  <UserPlus2 size={14} /> Aggiungi Convocati
                </button>
              )}

              <div className="players-match-list">
                {selectedMatchPlayers.filter(p => p.squadra === team).map(p => (
                  <div key={p.playerId} className="p-match-row-pro">
                    <span className="p-name">{p.nome}</span>
                    <div className="p-stats-controls">

                      <div className="stat-group goal-group">
                        <label>GOAL</label>
                        <div className="stepper-pro">
                          <button onClick={() => adjustStat(p.playerId, 'goal', -1)}>
                            <Minus size={10} />
                          </button>
                          <span>{p.goal}</span>
                          <button onClick={() => adjustStat(p.playerId, 'goal', 1)}>
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>

                      <div className="stat-group ag-group">
                        <label>AUTOGOAL</label>
                        <div className="stepper-pro">
                          <button onClick={() => adjustStat(p.playerId, 'ag', -1)}>
                            <Minus size={10} />
                          </button>
                          <span>{p.ag}</span>
                          <button onClick={() => adjustStat(p.playerId, 'ag', 1)}>
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>

                      <button className="btn-remove-p-lucide" onClick={() => removePlayerFromMatch(p.playerId)} title="Rimuovi">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className={`btn-save-match-pro ${isFormValid ? 'ready' : 'locked'}`}
        disabled={!isFormValid}
        onClick={handleMatchSubmit}
      >
        {isFormValid ? (editingMatchId ? "AGGIORNA RISULTATO" : "SALVA PARTITA") : "DATI INCOMPLETI"}
      </button>
    </div>
  );
};

export default MatchForm;