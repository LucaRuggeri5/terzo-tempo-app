import React, { useState, useMemo } from 'react';
import OverlayPlayerStats from '../components/OverlayPlayerStats/OverlayPlayerStats';
import './RankingPageScore.css';

// IMPORTAZIONE DELLE ICONE DI LUCIDE-REACT
import { 
  Flame, 
  Crown, 
  Calendar, 
  AlertCircle,
  Icon
} from 'lucide-react';

import {
    soccerBall as SoccerBall,
    soccerPitch as SoccerPitch
} from '@lucide/lab';

const RankingPageScore = ({ players = [], matches = [] }) => {
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

  // 3. LOGICA DI CALCOLO CLASSIFICA
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

  // 4. GESTIONE RANK (Parimerito)
  let currentRank = 1;
  const rankedList = scoreData.map((player, index) => {
    if (index > 0 && player.goal !== scoreData[index - 1].goal) {
      currentRank = index + 1;
    }
    return { ...player, displayRank: currentRank };
  });

  const podium = rankedList.slice(0, 3);

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <div className="title-group">
          <h1>
            <Icon iconNode={SoccerBall} size={24} className="ranking-main-icon score-title-icon" /> Classifica Marcatori
          </h1>
        </div>

        <div className="filters-group">
          <div className="select-icon-wrapper">
            <select 
              value={filterYear} 
              onChange={(e) => {
                setFilterYear(e.target.value);
                setFilterMonth('all');
              }} 
              className="modern-select"
            >
              <option value="all">Tutti gli Anni</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="select-icon-wrapper">
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
      </div>

      {/* PODIO */}
      {podium.length > 0 && (
        <div className="elite-podium">
          {/* SECONDO POSTO */}
          <div 
            className={`elite-card silver clickable-card ${!podium[1] ? 'invisible' : ''}`}
            onClick={() => podium[1] && setSelectedPlayer({ data: podium[1], rank: podium[1].displayRank })}
          >
            {podium[1] && (
              <>
                <span className="elite-rank">2</span>
                <div className="elite-info-score">
                  <span className="elite-name">{podium[1].nome}</span>
                  <span className="score-pill">{podium[1].goal} GOAL</span>
                </div>
              </>
            )}
          </div>

          {/* PRIMO POSTO */}
          <div 
            className="elite-card gold gold-score clickable-card"
            onClick={() => setSelectedPlayer({ data: podium[0], rank: podium[0].displayRank })}
          >
            <div className="crown-icon-container">
              <Icon iconNode={SoccerBall} size={32} className="crown-icon-lucide" />
            </div>
            <span className="elite-rank">1</span>
            <div className="elite-info-score">
              <span className="elite-name">{podium[0].nome}</span>
              <span className="score-pill">{podium[0].goal} GOAL</span>
            </div>
          </div>

          {/* TERZO POSTO */}
          <div 
            className={`elite-card bronze clickable-card ${!podium[2] ? 'invisible' : ''}`}
            onClick={() => podium[2] && setSelectedPlayer({ data: podium[2], rank: podium[2].displayRank })}
          >
            {podium[2] && (
              <>
                <span className="elite-rank">3</span>
                <div className="elite-info-score">
                  <span className="elite-name">{podium[2].nome}</span>
                  <span className="score-pill">{podium[2].goal} GOAL</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TABELLA UNICA ADATTIVA */}
      <div className="table-container-elite main-score-table">
        <table className="table-elite">
          <thead>
            <tr>
              <th className="w-pos">Pos</th>
              <th className="w-name">Giocatore</th>
              <th className="w-data">Gol</th>
              <th className="w-data hide-mobile">Media/P</th>
              <th className="w-data hide-mobile">Partite</th>
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
                <td className="w-data font-bold score-text">{player.goal}</td>
                <td className="w-data hide-mobile">
                  {player.partite > 0 ? (player.goal / player.partite).toFixed(2) : "0.00"}
                </td>
                <td className="w-data hide-mobile">{player.partite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {rankedList.length === 0 && (
        <p className="no-data-msg">
          <AlertCircle size={16} className="inline-no-data-icon" /> Nessun gol registrato in questo periodo.
        </p>
      )}

      {/* OVERLAY DELLE STATISTICHE COMPLESSIVE */}
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

export default RankingPageScore;