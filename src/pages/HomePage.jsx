import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

// IMPORTAZIONE DELLE ICONE DI LUCIDE-REACT
import {
    Trophy,
    Users,
    Calendar,
    Quote,
    Icon
} from 'lucide-react';

import {
    soccerBall as SoccerBall,
    soccerPitch as SoccerPitch
} from '@lucide/lab';

// IMPORTAZIONE DELLE IMMAGINI DI SFONDO DALLA CARTELLA ASSETS
import championsBg from '../assets/Background/champions_background.jpg';
import europaBg from '../assets/Background/europa_background.jpg';
import conferenceBg from '../assets/Background/conference_background.jpg';

const HomePage = ({ players, matches }) => {
    const navigate = useNavigate();
    const [currentQuote, setCurrentQuote] = useState(0);
    const [activeTheme, setActiveTheme] = useState('champions');

    const quotes = [
        { text: "Se penso quello che dico sai cosa viene fuori...", author: "Antonio Cassano" },
        { text: "Tom! Gli undici giocatori più forti con la quale che hai giocato? Tom!", author: "Antonio Cassano" },
        { text: "Non chiamatemi arrogante, ma sono campione al Circolo Italia e penso di essere speciale.", author: "José Mourinho" },
        { text: "I rigori al Circolo Italia li sbaglia solo chi ha il coraggio di tirarli", author: "Roberto Baggio" },
        { text: "Voglio diventare l'idolo dei ragazzi poveri di Napoli, perché loro sono come ero io al Circolo Sportivo Italia", author: "Diego Armando Maradona" },
        { text: "Sono il più forte della storia, non vedo nessuno migliore di me oltre Matteo Falasca e Messi", author: "Cristiano Ronaldo" },
        { text: "Nun te preoccupà, mo je faccio er cucchiaio", author: "Francesco Totti" }
    ];

    // Sincronizza lo sfondo con il tema globale impostato sul body di App.jsx
    useEffect(() => {
        const updateTheme = () => {
            const currentTheme = document.body.getAttribute('data-theme') || 'champions';
            setActiveTheme(currentTheme);
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

        return () => observer.disconnect();
    }, []);

    // Carosello automatico ogni 5 secondi
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [quotes.length]);

    // Funzione per recuperare l'immagine corretta in base al tema
    const getHeroBackground = () => {
        if (activeTheme === 'europa') return europaBg;
        if (activeTheme === 'conference') return conferenceBg;
        return championsBg;
    };

    // Calcoli rapidi per le card
    const totalPlayers = players.length;
    const totalMatches = matches.length;
    const lastMatchDate = matches.length > 0
        ? new Date(matches[0].data).toLocaleDateString('it-IT')
        : "Nessuna partita";

    return (
        <div className="home-container">
            {/* HERO SECTION / JUMBOTRON CON SFONDO VARIABILE */}
            <section 
                className="home-hero" 
                style={{ '--hero-bg-image': `url(${getHeroBackground()})` }}
            >
                <div className="hero-content">
                    <h1 className="hero-main-title">
                        Benvenuto su <span className="hero-title-highlight">Terzo Tempo</span>
                    </h1>
                    <p className="hero-subtitle">Il posto dove i gol contano, ma la birra dopo la partita conta di più.</p>
                    <div className="hero-buttons">
                        <button onClick={() => navigate('/classifica')} className="btn-primary">
                            <Trophy className="btn-icon" /> Classifica Generale
                        </button>
                        <button onClick={() => navigate('/classifica-marcatori')} className="btn-secondary">
                            <Icon iconNode={SoccerBall} className="btn-icon" /> Classifica Marcatori
                        </button>
                    </div>
                </div>
            </section>

            {/* STATS CARDS */}
            <section className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper wrapper-players">
                        <Users className="stat-icon-lucide" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{totalPlayers}</span>
                        <span className="stat-label">Giocatori Iscritti</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper wrapper-matches">
                        <Icon iconNode={SoccerPitch} className="stat-icon-lucide" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{totalMatches}</span>
                        <span className="stat-label">Partite Giocate</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper wrapper-date">
                        <Calendar className="stat-icon-lucide" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{lastMatchDate}</span>
                        <span className="stat-label">Ultimo Match</span>
                    </div>
                </div>
            </section>

            {/* CAROSELLO CITAZIONI */}
            <section className="quotes-section">
                <h3 className="section-title">Cosa dicono di noi:</h3>
                <div className="quotes-carousel">
                    <div className="quote-decoration">
                        <Quote size={40} />
                    </div>
                    <div className="quote-card">
                        <p className="quote-text">"{quotes[currentQuote].text}"</p>
                        <span className="quote-author">- {quotes[currentQuote].author}</span>
                    </div>
                    <div className="carousel-dots">
                        {quotes.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentQuote ? 'active' : ''}`}
                                onClick={() => setCurrentQuote(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;