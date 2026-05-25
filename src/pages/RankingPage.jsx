import React, { useState, useMemo } from 'react';
import OverlayPlayerStats from '../components/OverlayPlayerStats/OverlayPlayerStats';
import './RankingPage.css';

const RankingPage = ({ players = [], matches = [] }) => {
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // 1. CALCOLO DINAMICO ANNI DISPONIBILI
  const availableYears = useMemo(() => {
    if (matches.length === 0) return [];
    const years = matches.map(m => new Date(m.data).getFullYear().toString());
    return [...new Set(years)].sort((a, b) => b - a);
  }, [matches]);

  // 2. CALCOLO DINAMICO MESI DISPONIBILI
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

  const filteredData = useMemo(() => {
    const statsMap = {};
    players.forEach(p => {
      statsMap[p.id] = { id: p.id, nome: p.nome, punti: 0, dr: 0, goal: 0, partite: 0 };
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

  const podium = rankedList.slice(0, 3);

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <div className="title-group">
          <h1>Classifica Generale</h1>
        </div>

        <div className="filters-group">
          <select 
            value={filterYear} 
            onChange={(e) => {
              setFilterYear(e.target.value);
              setFilterMonth('all');
            }} 
            className="modern-select"
          >
            <option value="all">Tutti gli Anni</option>
            {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
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

      {/* 🏆 PODIO */}
      {podium.length > 0 && (
        <div className="elite-podium">
          <div 
            className={`elite-card silver clickable-card ${!podium[1] ? 'invisible' : ''}`}
            onClick={() => podium[1] && setSelectedPlayer({ data: podium[1], rank: podium[1].displayRank })}
          >
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

          <div 
            className="elite-card gold clickable-card"
            onClick={() => setSelectedPlayer({ data: podium[0], rank: podium[0].displayRank })}
          >
            <div className="crown-icon">👑</div>
            <span className="elite-rank">1</span>
            <div className="elite-info-rank">
              <span className="elite-name">{podium[0].nome}</span>
              <span className="elite-pts">{podium[0].punti} Punti</span>
            </div>
          </div>

          <div 
            className={`elite-card bronze clickable-card ${!podium[2] ? 'invisible' : ''}`}
            onClick={() => podium[2] && setSelectedPlayer({ data: podium[2], rank: podium[2].displayRank })}
          >
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

      {/* TABELLA UNICA ADATTIVA */}
      <div className="table-container-elite main-ranking-table">
        <table className="table-elite">
          <thead>
            <tr>
              <th className="w-pos">Rank</th>
              <th className="w-name">Giocatore</th>
              <th className="w-data">Punti</th>
              <th className="w-data hide-mobile">Partite</th>
              <th className="w-data">DR</th>
              <th className="w-data hide-mobile">Goal</th>
            </tr>
          </thead>
          <tbody>
            {rankedList.map((player) => (
              <tr 
                key={player.id} 
                className={`ranking-row-clickable ${player.displayRank <= 3 ? 'row-highlight' : ''}`}
                onClick={() => setSelectedPlayer({ data: player, rank: player.displayRank })}
              >
                <td className="w-pos">
                  <span className={`rank-dot ${player.displayRank <= 3 ? `dot-${player.displayRank}` : ''}`}>
                    {player.displayRank}
                  </span>
                </td>
                <td className="w-name name-text">{player.nome}</td>
                <td className="w-data font-bold">{player.punti}</td>
                <td className="w-data hide-mobile">{player.partite}</td>
                <td className={`w-data font-bold ${player.dr > 0 ? 'text-green' : player.dr < 0 ? 'text-red' : ''}`}>
                  {player.dr > 0 ? `+${player.dr}` : player.dr}
                </td>
                <td className="w-data hide-mobile">{player.goal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rankedList.length === 0 && <p className="no-data-msg">Nessuna partita registrata.</p>}

      {/* RENDER DELL'OVERLAY SE SELEZIONATO */}
      {selectedPlayer && (
        <OverlayPlayerStats 
          player={selectedPlayer.data}
          currentRank={selectedPlayer.rank}
          matches={matches}
          filterYear={filterYear}
          filterMonth={filterMonth}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
};

export default RankingPage;