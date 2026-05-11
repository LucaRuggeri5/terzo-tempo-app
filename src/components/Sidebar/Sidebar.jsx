import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import packageJson from '../../../package.json';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {

  useEffect(() => {
    if (isOpen && window.innerWidth <= 1100) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const appVersion = packageJson.version;

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={toggleSidebar}
      ></div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-sticky-wrapper">
          <button className="close-sidebar-btn" onClick={toggleSidebar}>✕</button>

          <div className="sidebar-header">
            <div className="brand-container">
              <div className="brand-icons">
                <span className="brand-ball">⚽</span>
                <span className="brand-beer">🍺</span>
              </div>
              <h2 className="brand-text">
                TERZO<span className="highlight">TEMPO</span>
              </h2>
            </div>
          </div>

          <div className="sidebar-content">
            <nav className="sidebar-nav">
              <div className="nav-group">
                <span className="group-title">Ranking</span>
                <ul>
                  <li><NavLink to="/" end onClick={toggleSidebar}>🏆 Classifica Generale</NavLink></li>
                  <li><NavLink to="/classifica-marcatori" onClick={toggleSidebar}>⚽ Classifica Marcatori</NavLink></li>
                </ul>
              </div>

              <div className="nav-group">
                <span className="group-title">Analisi</span>
                <ul>
                  <li><NavLink to="/statistiche" onClick={toggleSidebar}>📊 Statistiche Generali</NavLink></li>
                  <li><NavLink to="/statistiche-giocatori" onClick={toggleSidebar}>👤 Statistiche Giocatori</NavLink></li>
                  <li><NavLink to="/partite" onClick={toggleSidebar}>🏟️ Storico Partite</NavLink></li>
                </ul>
              </div>

              <div className="nav-group">
                <span className="group-title">Gestione</span>
                <ul>
                  <li><NavLink to="/registro" onClick={toggleSidebar}>📝 Registro Partite</NavLink></li>
                </ul>
              </div>
            </nav>
          </div>
          <div className="sidebar-footer">
            <span className="version-label">v{appVersion}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;