import React, { useMemo } from 'react';
import './OverlayPlayerStats.css';

const OverlayPlayerStats = ({ player, matches, filterYear, filterMonth, currentRank, onClose }) => {
  if (!player) return null;

  // Calcoliamo i dati avanzati del giocatore in base ai filtri attivi sulla classifica
  const playerStats = useMemo(() => {
    const stats = {
      partite: 0, punti: 0, vittorie: 0, pareggi: 0, sconfitte: 0, goalFatti: 0, dr: 0
    };

    matches.forEach(match => {
      const matchDate = new Date(match.data);
      const m = (matchDate.getMonth() + 1).toString();
      const y = matchDate.getFullYear().toString();

      // Rispettiamo i filtri temporali della RankingPage
      if ((filterMonth === 'all' || filterMonth === m) && (filterYear === 'all' || filterYear === y)) {
        const dettagli = match.match_details || {};
        const partecipanti = dettagli.partecipanti || [];

        const p = partecipanti.find(part => part.playerId === player.id);
        if (p) {
          stats.partite += 1;
          stats.punti += (p.punti || 0);
          stats.goalFatti += (p.goal || 0);
          stats.dr += (p.dr || 0);

          if (p.punti === 3) stats.vittorie += 1;
          else if (p.punti === 1) stats.pareggi += 1;
          else stats.sconfitte += 1;
        }
      }
    });

    return stats;
  }, [player.id, matches, filterYear, filterMonth]);

  return (
    <div className="player-overlay-backdrop" onClick={onClose}>
      <div className="player-overlay-card" onClick={(e) => e.stopPropagation()}>
        <button className="player-overlay-close" onClick={onClose}>&times;</button>
        
        <div className="player-overlay-header">
          <div className="player-overlay-avatar">⚽</div>
          <h2>{player.nome}</h2>
          <span className="player-overlay-badge">Rank #{currentRank}</span>
        </div>

        <div className="player-overlay-grid">
          <div className="overlay-stat-box highlight">
            <span className="stat-label">Punti Totali</span>
            <span className="stat-value">{playerStats.punti}</span>
          </div>
          <div className="overlay-stat-box">
            <span className="stat-label">Partite Giocate</span>
            <span className="stat-value">{playerStats.partite}</span>
          </div>
          <div className="overlay-stat-box">
            <span className="stat-label">Gol Fatti</span>
            <span className="stat-value text-green">{playerStats.goalFatti}</span>
          </div>
          <div className="overlay-stat-box">
            <span className="stat-label">Diff. Reti</span>
            <span className={`stat-value ${playerStats.dr > 0 ? 'text-green' : playerStats.dr < 0 ? 'text-red' : ''}`}>
              {playerStats.dr > 0 ? `+${playerStats.dr}` : playerStats.dr}
            </span>
          </div>
        </div>

        <div className="player-overlay-subgrid">
          <div className="sub-stat">
            <span className="sub-label">Vittorie</span>
            <span className="sub-value text-green">{playerStats.vittorie}</span>
          </div>
          <div className="sub-stat">
            <span className="sub-label">Pareggi</span>
            <span className="sub-value text-gray">{playerStats.pareggi}</span>
          </div>
          <div className="sub-stat">
            <span className="sub-label">Sconfitte</span>
            <span className="sub-value text-red">{playerStats.sconfitte}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverlayPlayerStats;