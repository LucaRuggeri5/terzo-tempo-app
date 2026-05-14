import React, { useState, useMemo } from 'react';
import './RankingPageScore.css';

const RankingPageScore = ({ players = [], matches = [] }) => {
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  // 1. CALCOLO DINAMICO ANNI DISPONIBILI
  const availableYears = useMemo(() => {
    if (matches.length === 0) return [];
    const years = matches.map(m => new Date(m.data).getFullYear().toString());
    return [...new Set(years)].sort((a, b) => b - a);
  }, [matches]);

  // 2. CALCOLO DINAMICO MESI DISPONIBILI (basato sull'anno selezionato)
  const availableMonths = useMemo(() => {
    if (matches.length === 0) return [];

    let relevantMatches = matches;
    if (filterYear !== 'all') {
      relevantMatches = matches.filter(m => new Date(m.data).getFullYear().toString() === filterYear);
    }

    const monthsIdx = relevantMatches.map(m => new Date(m.data).getMonth() + 1);
    const uniqueMonths = [...new Set(monthsIdx)].sort((a, b) => a - b);

    const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
    
    return uniqueMonths.map(m => ({
      value: m.toString(),
      label: monthNames[m - 1]
    }));
  }, [matches, filterYear]);

  const scoreData = useMemo(() => {
    const statsMap = {};
    players.forEach(p => {
      statsMap[p.id] = { id: p.id, nome: p.nome, goal: 0, partite: 0 };
    });

    matches.forEach(match => {
      const matchDate = new Date(match.data);
      const m = (matchDate.getMonth() + 1).toString();
      const y = matchDate.getFullYear().toString();

      if ((filterMonth === 'all' || filterMonth === m) && (filterYear === 'all' || filterYear === y)) {
        const dettagli = match.match_details || {};
        const partecipanti = dettagli.partecipanti || [];

        partecipanti.forEach(p => {
          if (statsMap[p.playerId]) {
            statsMap[p.playerId].goal += (p.goal || 0);
            statsMap[p.playerId].partite += 1;
          }
        });
      }
    });

    return Object.values(statsMap)
      .filter(p => p.partite > 0)
      .sort((a, b) => b.goal - a.goal || a.partite - b.partite);
  }, [players, matches, filterMonth, filterYear]);

  // Gestione dei Rank per i parimerito
  let currentRank = 1;
  const rankedList = scoreData.map((player, index) => {
    if (index > 0 && player.goal !== scoreData[index - 1].goal) {
      currentRank = index + 1;
    }
    return { ...player, displayRank: currentRank };
  });

  const topScorers = rankedList.slice(0, 3);

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <div className="title-group">
          <h1>Classifica Marcatori</h1>
        </div>

        <div className="filters-group">
          <select 
            value={filterYear} 
            onChange={(e) => {
              setFilterYear(e.target.value);
              setFilterMonth('all'); // Reset mese al cambio anno
            }} 
            className="modern-select"
          >
            <option value="all">Tutti gli Anni</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)} 
            className="modern-select"
          >
            <option value="all">Tutti i Mesi</option>
            {availableMonths.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {topScorers.length > 0 && (
        <div className="elite-podium">
          <div className={`elite-card silver ${!topScorers[1] ? 'invisible' : ''}`}>
            {topScorers[1] && (
              <>
                <span className="elite-rank">2</span>
                <div className="elite-info elite-info-score">
                  <span className="elite-name">{topScorers[1].nome}</span>
                  <span className="score-pill">{topScorers[1].goal} GOAL</span>
                </div>
              </>
            )}
          </div>

          <div className="elite-card gold gold-score">
            <div className="crown-icon">⚽</div>
            <span className="elite-rank">1</span>
            <div className="elite-info elite-info-score">
              <span className="elite-name">{topScorers[0].nome}</span>
              <span className="score-pill">{topScorers[0].goal} GOAL</span>
            </div>
          </div>

          <div className={`elite-card bronze ${!topScorers[2] ? 'invisible' : ''}`}>
            {topScorers[2] && (
              <>
                <span className="elite-rank">3</span>
                <div className="elite-info elite-info-score">
                  <span className="elite-name">{topScorers[2].nome}</span>
                  <span className="score-pill">{topScorers[2].goal} GOAL</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="score-list-mobile">
        {rankedList.map((player) => (
          <div key={player.id} className="score-row-mobile">
            <div className="score-rank-box">
              <span className={`rank-dot ${player.displayRank <= 3 ? `dot-${player.displayRank}` : ''}`}>
                {player.displayRank}
              </span>
            </div>
            <div className="score-name-box">{player.nome}</div>
            <div className="score-badge-box">
              <span className="goal-count">{player.goal}</span>
              <span className="goal-label">GOAL</span>
            </div>
          </div>
        ))}
      </div>

      <div className="table-container-elite main-score-table">
        <table className="table-elite">
          <thead>
            <tr>
              <th className="w-pos">Pos</th>
              <th className="w-name">Giocatore</th>
              <th className="w-data">Gol</th>
              <th className="w-data">Media/P</th>
              <th className="w-data">Partite</th>
            </tr>
          </thead>
          <tbody>
            {rankedList.map((player) => (
              <tr key={player.id} className={player.displayRank <= 3 ? 'row-highlight' : ''}>
                <td className="w-pos">
                  <span className={`rank-dot ${player.displayRank <= 3 ? `dot-${player.displayRank}` : ''}`}>
                    {player.displayRank}
                  </span>
                </td>
                <td className="w-name name-text">{player.nome}</td>
                <td className="w-data font-bold score-text">{player.goal}</td>
                <td className="w-data">
                  {player.partite > 0 ? (player.goal / player.partite).toFixed(2) : "0.00"}
                </td>
                <td className="w-data">{player.partite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rankedList.length === 0 && <p className="no-data-msg">Nessun gol registrato.</p>}
    </div>
  );
};

export default RankingPageScore;