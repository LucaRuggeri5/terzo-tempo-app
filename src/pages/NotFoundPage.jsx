import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-emoji">⚽🏃💨</div>
        <h1>404 - Fuorigioco!</h1>
        <p>La pagina che stai cercando è finita in tribuna o non è mai esistita.</p>
        <button onClick={() => navigate('/')} className="back-btn">
          Rientra in campo
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;