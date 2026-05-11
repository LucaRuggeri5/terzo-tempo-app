import React from 'react';
import './RankingTable.css';

const RankingTable = ({ data }) => {
  return (
    <div className="ranking-container">
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
            <tr key={p.id}>
              <td>{index + 1}</td>
              <td>{p.nome}</td>
              <td>{p.partite}</td>
              <td>{p.punti}</td>
              <td>{p.dr}</td>
              <td>{p.goal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingTable;