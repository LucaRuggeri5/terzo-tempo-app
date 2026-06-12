import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import packageJson from '../../../package.json';
import './Sidebar.css';

// IMPORTAZIONE DELLE ICONE DI LUCIDE-REACT
import { 
  Home, 
  Trophy, 
  Flame, 
  BarChart3, 
  User, 
  History, 
  FileEdit, 
  LogIn, 
  LogOut,
  X,
  Icon,
  Beer
} from 'lucide-react';

import {
    soccerBall as SoccerBall,
    soccerPitch as SoccerPitch
} from '@lucide/lab';

const Sidebar = ({ isOpen, toggleSidebar, session }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Gestione scroll del body quando la sidebar è aperta su mobile
    if (isOpen && window.innerWidth <= 1100) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toggleSidebar();
    navigate('/');
  };

  const appVersion = packageJson.version;

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`} 
        onClick={toggleSidebar}
      ></div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-sticky-wrapper">
          {/* Header con pulsante di chiusura */}
          <div className="sidebar-header">
            <button className="close-sidebar-btn" onClick={toggleSidebar}>
              <X size={18} />
            </button>
            <NavLink to="/" className="brand-container" onClick={toggleSidebar} style={{ textDecoration: 'none' }}>
              <div className="brand-icons">
                <div className="brand-logo-glow"></div>
                <div className="brand-vignette-icons">
                  <Icon iconNode={SoccerBall} className="brand-icon-item ball-icon" />
                  <Beer className="brand-icon-item beer-icon" />
                </div>
              </div>
              <h2 className="brand-text">
                TERZO<span className="brand-text-highlight">TEMPO</span>
              </h2>
            </NavLink>
          </div>

          {/* Area centrale con scroll */}
          <div className="sidebar-content">
            <nav className="sidebar-nav">
              <div className="nav-group">
                <span className="group-title">Menu Principale</span>
                <ul>
                  <li>
                    <NavLink to="/" end onClick={toggleSidebar}>
                      <Home className="nav-icon" /> Home
                    </NavLink>
                  </li>
                </ul>
              </div>

              <div className="nav-group">
                <span className="group-title">Ranking</span>
                <ul>
                  <li>
                    <NavLink to="/classifica" onClick={toggleSidebar}>
                      <Trophy className="nav-icon" /> Classifica Generale
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/classifica-marcatori" onClick={toggleSidebar}>
                      <Icon iconNode={SoccerBall} className="nav-icon" /> Classifica Marcatori
                    </NavLink>
                  </li>
                </ul>
              </div>

              <div className="nav-group">
                <span className="group-title">Analisi</span>
                <ul>
                  <li>
                    <NavLink to="/statistiche" onClick={toggleSidebar}>
                      <BarChart3 className="nav-icon" /> Statistiche Generali
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/statistiche-giocatori" onClick={toggleSidebar}>
                      <User className="nav-icon" /> Statistiche Giocatori
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/partite" onClick={toggleSidebar}>
                      <Icon iconNode={SoccerPitch} className="nav-icon" /> Storico Partite
                    </NavLink>
                  </li>
                </ul>
              </div>

              {session && (
                <div className="nav-group">
                  <span className="group-title">Gestione</span>
                  <ul>
                    <li>
                      <NavLink to="/registro" onClick={toggleSidebar}>
                        <FileEdit className="nav-icon" /> Registro Partite
                      </NavLink>
                    </li>
                  </ul>
                </div>
              )}
            </nav>
          </div>

          {/* Footer fisso in basso */}
          <div className="sidebar-footer">
            <div className="auth-container">
              {session ? (
                <button className="auth-btn logout" onClick={handleLogout}>
                  <LogOut className="auth-icon" /> Logout Admin
                </button>
              ) : (
                <NavLink to="/login" className="auth-btn login" onClick={toggleSidebar}>
                  <LogIn className="auth-icon" /> Login Admin
                </NavLink>
              )}
            </div>
            <span className="version-label">v{appVersion}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;