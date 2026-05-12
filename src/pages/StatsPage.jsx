import React, { useState, useMemo } from 'react';
import './StatsPage.css';

const StatsPage = ({ players = [], matches = [] }) => {
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'punti', direction: 'desc' });

  const availableYears = useMemo(() => {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = startYear; y <= currentYear; y++) {
      years.push(y.toString());
    }
    return years.reverse();
  }, []);

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
          s.autogoal += (p.ag || 0); // Corretto da autogoal a ag come nel form
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

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>Statistiche Generali</h1>
        <div className="stats-filters">
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="all">Tutti i Mesi</option>
            {["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"].map((m, i) => (
              <option key={i} value={(i + 1).toString()}>{m}</option>
            ))}
          </select>
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="all">Tutti gli Anni</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="stats-table-wrapper">
        <div className="stats-table-scroll">
          <div className="stats-row header-row">
            <div className={`col-name sticky-col ${sortConfig.key === 'nome' ? 'active-sort' : ''}`} onClick={() => requestSort('nome')}>
              Giocatore {sortConfig.key === 'nome' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
            </div>
            <div className="col-data" onClick={() => requestSort('partite')}>P</div>
            <div className="col-data" onClick={() => requestSort('punti')}>PT</div>
            <div className="col-data" onClick={() => requestSort('vittorie')}>V</div>
            <div className="col-data" onClick={() => requestSort('pareggi')}>N</div>
            <div className="col-data" onClick={() => requestSort('sconfitte')}>P</div>
            <div className="col-data" onClick={() => requestSort('goalFatti')}>GF</div>
            <div className="col-data" onClick={() => requestSort('dr')}>DR</div>
            <div className="col-data" onClick={() => requestSort('mediaPunti')}>MP</div>
            <div className="col-data" onClick={() => requestSort('percentualeVittoria')}>%W</div>
            <div className="col-forma">Forma</div>
          </div>

          {sortedData.map((s) => (
            <div key={s.id} className="stats-row">
              <div className="col-name sticky-col">{s.nome}</div>
              <div className="col-data">{s.partite}</div>
              <div className="col-data highlight">{s.punti}</div>
              <div className="col-data">{s.vittorie}</div>
              <div className="col-data">{s.pareggi}</div>
              <div className="col-data">{s.sconfitte}</div>
              <div className="col-data">{s.goalFatti}</div>
              <div className={`col-data ${s.dr > 0 ? 'text-green' : s.dr < 0 ? 'text-red' : ''}`}>
                {s.dr > 0 ? `+${s.dr}` : s.dr}
              </div>
              <div className="col-data">{s.mediaPunti}</div>
              <div className="col-data">{s.percentualeVittoria}%</div>
              <div className="col-forma">
                <div className="forma-dots">
                  {s.forma.map((res, i) => (
                    <span key={i} className={`dot ${res}`}>
                      {res === 'W' ? 'V' : res === 'D' ? 'N' : 'P'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {sortedData.length === 0 && <p className="no-data">Nessun dato disponibile per questo periodo.</p>}
    </div>
  );
};

export default StatsPage;