import React, { useState, useMemo } from 'react';
import './StatsPage.css';

const StatsPage = ({ players = [], matches = [] }) => {
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'asc' });

  // 1. CALCOLO DINAMICO ANNI DISPONIBILI
  const availableYears = useMemo(() => {
    if (matches.length === 0) return [];
    const years = matches.map(m => new Date(m.data).getFullYear().toString());
    return [...new Set(years)].sort((a, b) => b - a);
  }, [matches]);

  // 2. CALCOLO DINAMICO MESI DISPONIBILI (in base all'anno selezionato)
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

  const statsData = useMemo(() => {
    const statsMap = {};
    players.forEach(p => {
      statsMap[p.id] = {
        id: p.id, nome: p.nome, partite: 0, punti: 0, vittorie: 0, pareggi: 0,
        sconfitte: 0, goalFatti: 0, autogoal: 0, dr: 0, mediaPunti: 0,
        mediaGoal: 0, percentualeVittoria: 0, forma: []
      };
    });

    const filteredMatches = matches.filter(match => {
      const matchDate = new Date(match.data);
      const m = (matchDate.getMonth() + 1).toString();
      const y = matchDate.getFullYear().toString();
      return (filterMonth === 'all' || filterMonth === m) && (filterYear === 'all' || filterYear === y);
    }).sort((a, b) => new Date(a.data) - new Date(b.data));

    filteredMatches.forEach(match => {
      const dettagli = match.match_details || {};
      const partecipanti = dettagli.partecipanti || [];

      partecipanti.forEach(p => {
        const s = statsMap[p.playerId];
        if (s) {
          s.partite += 1;
          s.punti += (p.punti || 0);
          s.goalFatti += (p.goal || 0);
          s.autogoal += (p.ag || 0);
          s.dr += (p.dr || 0);
          
          if (p.punti === 3) { s.vittorie += 1; s.forma.push('W'); }
          else if (p.punti === 1) { s.pareggi += 1; s.forma.push('D'); }
          else { s.sconfitte += 1; s.forma.push('L'); }
          
          if (s.forma.length > 5) s.forma.shift();
        }
      });
    });

    return Object.values(statsMap)
      .filter(s => s.partite > 0)
      .map(s => ({
        ...s,
        mediaPunti: s.partite > 0 ? parseFloat((s.punti / s.partite).toFixed(2)) : 0,
        mediaGoal: s.partite > 0 ? parseFloat((s.goalFatti / s.partite).toFixed(2)) : 0,
        percentualeVittoria: s.partite > 0 ? Math.round((s.vittorie / s.partite) * 100) : 0
      }));
  }, [players, matches, filterMonth, filterYear]);

  const sortedData = useMemo(() => {
    let sortableItems = [...statsData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [statsData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (key === 'nome') direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === (key === 'nome' ? 'asc' : 'desc')) {
      direction = key === 'nome' ? 'desc' : 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>Statistiche Generali</h1>
        <div className="stats-filters">
          <select value={filterYear} onChange={(e) => {
            setFilterYear(e.target.value);
            setFilterMonth('all'); 
          }} className="modern-select">
            <option value="all">Tutti gli Anni</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="modern-select">
            <option value="all">Tutti i Mesi</option>
            {availableMonths.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-table-wrapper">
        <div className="stats-table-scroll">
          <table className="stats-table-native">
            <thead>
              <tr className="header-row">
                <th className={`col-name sticky-col ${sortConfig.key === 'nome' ? 'active-sort' : ''}`} onClick={() => requestSort('nome')}>
                  Giocatore{getSortIcon('nome')}
                </th>
                <th className={`col-data ${sortConfig.key === 'partite' ? 'active-sort' : ''}`} onClick={() => requestSort('partite')}>PG{getSortIcon('partite')}</th>
                <th className={`col-data ${sortConfig.key === 'punti' ? 'active-sort' : ''}`} onClick={() => requestSort('punti')}>PT{getSortIcon('punti')}</th>
                <th className={`col-data ${sortConfig.key === 'vittorie' ? 'active-sort' : ''}`} onClick={() => requestSort('vittorie')}>V{getSortIcon('vittorie')}</th>
                <th className={`col-data ${sortConfig.key === 'pareggi' ? 'active-sort' : ''}`} onClick={() => requestSort('pareggi')}>P{getSortIcon('pareggi')}</th>
                <th className={`col-data ${sortConfig.key === 'sconfitte' ? 'active-sort' : ''}`} onClick={() => requestSort('sconfitte')}>S{getSortIcon('sconfitte')}</th>
                <th className={`col-data ${sortConfig.key === 'goalFatti' ? 'active-sort' : ''}`} onClick={() => requestSort('goalFatti')}>GF{getSortIcon('goalFatti')}</th>
                <th className={`col-data ${sortConfig.key === 'dr' ? 'active-sort' : ''}`} onClick={() => requestSort('dr')}>DR{getSortIcon('dr')}</th>
                <th className={`col-data ${sortConfig.key === 'mediaPunti' ? 'active-sort' : ''}`} onClick={() => requestSort('mediaPunti')}>MP{getSortIcon('mediaPunti')}</th>
                <th className={`col-data ${sortConfig.key === 'percentualeVittoria' ? 'active-sort' : ''}`} onClick={() => requestSort('percentualeVittoria')}>%W{getSortIcon('percentualeVittoria')}</th>
                <th className="col-forma">Forma</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((s) => (
                <tr key={s.id} className="stats-row">
                  <td className="col-name sticky-col">{s.nome}</td>
                  <td className="col-data">{s.partite}</td>
                  <td className="col-data highlight">{s.punti}</td>
                  <td className="col-data">{s.vittorie}</td>
                  <td className="col-data">{s.pareggi}</td>
                  <td className="col-data">{s.sconfitte}</td>
                  <td className="col-data">{s.goalFatti}</td>
                  <td className={`col-data ${s.dr > 0 ? 'text-green' : s.dr < 0 ? 'text-red' : ''}`}>
                    {s.dr > 0 ? `+${s.dr}` : s.dr}
                  </td>
                  <td className="col-data">{s.mediaPunti}</td>
                  <td className="col-data">{s.percentualeVittoria}%</td>
                  <td className="col-forma">
                    <div className="forma-dots">
                      {s.forma.map((res, i) => (
                        <span key={i} className={`dot ${res}`}>
                          {res === 'W' ? 'V' : res === 'D' ? 'P' : 'S'}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {sortedData.length === 0 && <p className="no-data">Nessun dato disponibile per questo periodo.</p>}
    </div>
  );
};

export default StatsPage;