import React from 'react';
import './RankingTable.css';

const RankingTable = ({ data = [] }) => {
  // Se non ci sono dati, mostriamo un piccolo feedback invece di una tabella vuota
  if (!data || data.length === 0) {
    return <p className="no-data-minimal">Nessun dato disponibile.</p>;
  }

  return (
    <div className="ranking-container-minimal">
      <table className="minimal-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Giocatore</th>
            <th>PG</th>
            <th>Punti</th>
            <th>DR</th>
            <th>GF</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, index) => (
            <tr key={p.id || index}>
              <td className="col-pos">{index + 1}</td>
              <td className="col-name">{p.nome}</td>
              <td>{p.partite}</td>
              <td className="font-bold">{p.punti}</td>
              <td className={`col-dr ${p.dr > 0 ? 'text-green' : p.dr < 0 ? 'text-red' : ''}`}>
                {p.dr > 0 ? `+${p.dr}` : p.dr}
              </td>
              <td>{p.goal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable;