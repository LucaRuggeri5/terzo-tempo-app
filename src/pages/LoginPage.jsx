import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Navigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ session }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Se è già loggato, lo rimandiamo al registro
  if (session) return <Navigate to="/registro" />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenziali non valide o errore di connessione.");
      setLoading(false);
    } else {
      navigate('/registro');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">🔐</span>
          <h1>Area Admin</h1>
          <p>Accedi per gestire partite e giocatori</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="admin@esempio.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>
        <button className="back-home-btn" onClick={() => navigate('/')}>
          Torna alla HomePage
        </button>
      </div>
    </div>
  );
};

export default LoginPage;