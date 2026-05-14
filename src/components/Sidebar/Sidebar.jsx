import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import packageJson from '../../../package.json';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, session }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && window.innerWidth <= 1100) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toggleSidebar();
    navigate('/');
  };

  const appVersion = packageJson.version;

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={toggleSidebar}></div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-sticky-wrapper">
          <button className="close-sidebar-btn" onClick={toggleSidebar}>✕</button>

          <div className="sidebar-header">
            {/* Cliccando sul brand si torna in Home */}
            <NavLink to="/" className="brand-container" onClick={toggleSidebar} style={{ textDecoration: 'none' }}>
              <div className="brand-icons">
                <span className="brand-ball">⚽</span>
                <span className="brand-beer">🍺</span>
              </div>
              <h2 className="brand-text">
                TERZO<span className="highlight">TEMPO</span>
              </h2>
            </NavLink>
          </div>

          <div className="sidebar-content">
            <nav className="sidebar-nav">
              <div className="nav-group">
                <span className="group-title">Menu Principale</span>
                <ul>
                  <li><NavLink to="/" end onClick={toggleSidebar}>🏠 Home</NavLink></li>
                </ul>
              </div>

              <div className="nav-group">
                <span className="group-title">Ranking</span>
                <ul>
                  <li><NavLink to="/classifica" onClick={toggleSidebar}>🏆 Classifica Generale</NavLink></li>
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

              {session && (
                <div className="nav-group">
                  <span className="group-title">Gestione</span>
                  <ul>
                    <li><NavLink to="/registro" onClick={toggleSidebar}>📝 Registro Partite</NavLink></li>
                  </ul>
                </div>
              )}
            </nav>
          </div>

          <div className="sidebar-footer">
            {session ? (
              <button className="auth-btn logout" onClick={handleLogout}>🚪 Logout Admin</button>
            ) : (
              <NavLink to="/login" className="auth-btn login" onClick={toggleSidebar}>🔐 Login Admin</NavLink>
            )}
            <span className="version-label">v{appVersion}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;