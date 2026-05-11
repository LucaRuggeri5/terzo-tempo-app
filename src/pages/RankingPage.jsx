import React, { useState, useMemo } from 'react';
import './RankingPage.css';

const RankingPage = ({ players = [], matches = [] }) => {
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

  const filteredData = useMemo(() => {
    const statsMap = {};
    players.forEach(p => {
      statsMap[p.id] = { ...p, punti: 0, dr: 0, goal: 0, partite: 0 };
    });

    matches.forEach(match => {
      const matchDate = new Date(match.data);
      const m = (matchDate.getMonth() + 1).toString();
      const y = matchDate.getFullYear().toString();

      if ((filterMonth === 'all' || filterMonth === m) && (filterYear === 'all' || filterYear === y)) {
        match.partecipanti?.forEach(p => {
          if (statsMap[p.playerId]) {
            statsMap[p.playerId].punti += (p.punti || 0);
            statsMap[p.playerId].dr += (p.dr || 0);
            statsMap[p.playerId].goal += (p.goal || 0);
            statsMap[p.playerId].partite += 1;
          }
        });
      }
    });

    return Object.values(statsMap)
      .filter(p => p.partite > 0)
      .sort((a, b) => b.punti - a.punti || b.dr - a.dr || b.goal - a.goal);
  }, [players, matches, filterMonth, filterYear]);

  const isPariMerito = (p1, p2) => {
    return p1 && p2 && p1.punti === p2.punti && p1.dr === p2.dr && p1.goal === p2.goal;
  };

  let currentRank = 1;
  const rankedList = filteredData.map((player, index) => {
    if (index > 0 && !isPariMerito(player, filteredData[index - 1])) {
      currentRank = index + 1;
    }
    return { ...player, displayRank: currentRank };
  });

  const podium = filteredData.slice(0, 3);

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <div className="title-group">
          <h1>Classifica Generale</h1>
          <span className="subtitle">
            {filterYear === 'all' ? 'Storico Totale' : `Stagione ${filterYear}`}
          </span>
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
            {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
      </div>

      {/* 🏆 PODIO: 2° - 1° - 3° */}
      {podium.length > 0 && (
        <div className="elite-podium">
          <div className={`elite-card silver ${!podium[1] ? 'invisible' : ''}`}>
            {podium[1] && (
              <>
                <span className="elite-rank">2</span>
                <div className="elite-info-rank">
                  <span className="elite-name">{podium[1].nome}</span>
                  <span className="elite-pts">{podium[1].punti} Punti</span>
                </div>
              </>
            )}
          </div>

          <div className="elite-card gold">
            <div className="crown-icon">👑</div>
            <span className="elite-rank">1</span>
            <div className="elite-info-rank">
              <span className="elite-name">{podium[0].nome}</span>
              <span className="elite-pts">{podium[0].punti} Punti</span>
            </div>
          </div>

          <div className={`elite-card bronze ${!podium[2] ? 'invisible' : ''}`}>
            {podium[2] && (
              <>
                <span className="elite-rank">3</span>
                <div className="elite-info-rank">
                  <span className="elite-name">{podium[2].nome}</span>
                  <span className="elite-pts">{podium[2].punti} Punti</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* LISTA MOBILE */}
      <div className="ranking-list-mobile">
        {rankedList.map((player) => (
          <div key={player.id} className="ranking-card-mobile">
            <div className="ranking-card-top">
              <div className="ranking-rank-box">
                <span className={`rank-dot ${player.displayRank <= 3 ? `dot-${player.displayRank}` : ''}`}>
                  {player.displayRank}
                </span>
              </div>
              <div className="ranking-name-box">{player.nome}</div>
              <div className="ranking-pts-box">{player.punti} PT</div>
            </div>
            <div className="ranking-card-stats">
              <div className="stat-item">
                <span>Partite</span>
                <strong>{player.partite}</strong>
              </div>
              <div className="stat-item">
                <span>DR</span>
                <strong className={player.dr > 0 ? 'text-green' : player.dr < 0 ? 'text-red' : ''}>
                  {player.dr > 0 ? `+${player.dr}` : player.dr}
                </strong>
              </div>
              <div className="stat-item">
                <span>Goal</span>
                <strong>{player.goal}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABELLA */}
      <div className="table-container-elite main-ranking-table">
        <table className="table-elite">
          <thead>
            <tr>
              <th className="w-pos">Rank</th>
              <th className="w-name">Giocatore</th>
              <th className="w-data">Punti</th>
              <th className="w-data">Partite</th>
              <th className="w-data">DR</th>
              <th className="w-data">Goal</th>
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
                <td className="w-data font-bold">{player.punti}</td>
                <td className="w-data">{player.partite}</td>
                <td className={`w-data font-bold ${player.dr > 0 ? 'text-green' : player.dr < 0 ? 'text-red' : ''}`}>
                  {player.dr > 0 ? `+${player.dr}` : player.dr}
                </td>
                <td className="w-data">{player.goal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rankedList.length === 0 && <p className="no-data-msg">Nessuna partita registrata.</p>}
    </div>
  );
};

export default RankingPage;