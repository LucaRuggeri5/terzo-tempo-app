import React, { useState, useMemo } from 'react';
import './RankingPageScore.css';

const RankingPageScore = ({ players = [], matches = [] }) => {
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  const availableYears = useMemo(() => {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = startYear; y <= currentYear; y++) {
      years.push(y.toString());
    }
    return years.reverse();
  }, []);

  const scoreData = useMemo(() => {
    const statsMap = {};
    players.forEach(p => {
      statsMap[p.id] = { ...p, goal: 0, partite: 0 };
    });

    matches.forEach(match => {
      const matchDate = new Date(match.data);
      const m = (matchDate.getMonth() + 1).toString();
      const y = matchDate.getFullYear().toString();

      if ((filterMonth === 'all' || filterMonth === m) && (filterYear === 'all' || filterYear === y)) {
        match.partecipanti?.forEach(p => {
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
          <span className="subtitle-score">I migliori bomber</span>
        </div>

        <div className="filters-group">
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="modern-select">
            <option value="all">Tutti i Mesi</option>
            {["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"].map((m, i) => (
              <option key={i} value={(i + 1).toString()}>{m}</option>
            ))}
          </select>
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="modern-select">
            <option value="all">Tutti gli Anni</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* 🏆 PODIO MARCATORI: 2° - 1° - 3° */}
      {topScorers.length > 0 && (
        <div className="elite-podium">
          {/* SECONDO BOMBER */}
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

          {/* CAPOCANNONIERE */}
          <div className="elite-card gold gold-score">
            <div className="crown-icon">⚽</div>
            <span className="elite-rank">1</span>
            <div className="elite-info elite-info-score">
              <span className="elite-name">{topScorers[0].nome}</span>
              <span className="score-pill">{topScorers[0].goal} GOAL</span>
            </div>
          </div>

          {/* TERZO BOMBER */}
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

      {/* LISTA MOBILE */}
      <div className="score-list-mobile">
        {rankedList.map((player) => (
          <div key={player.id} className="score-row-mobile">
            <div className="score-rank-box">
              <span className={`rank-dot ${player.displayRank <= 3 ? `dot-${player.displayRank}` : ''}`}>
                {player.displayRank}
              </span>
            </div>
            <div className="score-name-box">
              {player.nome}
            </div>
            <div className="score-badge-box">
              <span className="goal-count">{player.goal}</span>
              <span className="goal-label">GOAL</span>
            </div>
          </div>
        ))}
      </div>

      {/* TABELLA */}
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
                <td className="w-data">{(player.goal / player.partite).toFixed(2)}</td>
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