import React, { useState, useMemo } from 'react';
import './MatchRegisterPage.css';
import PlayerManager from '../components/PlayerManager/PlayerManager';
import MatchHistory from '../components/MatchHistory/MatchHistory';
import MatchForm from '../components/MatchForm/MatchForm';
import MatchOverlays from '../components/MatchOverlays/MatchOverlays';

const MatchRegisterPage = ({ players, matches, onAddMatch, onUpdateMatch, onDeleteMatch, onAddPlayer, onDeletePlayer, onUpdatePlayer }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [scoreNera, setScoreNera] = useState('');
    const [scoreBianca, setScoreBianca] = useState('');
    const [selectedMatchPlayers, setSelectedMatchPlayers] = useState([]);
    const [matchType, setMatchType] = useState(8);
    const [editingMatchId, setEditingMatchId] = useState(null);

    const [matchToDelete, setMatchToDelete] = useState(null);
    const [activeDrawerTeam, setActiveDrawerTeam] = useState(null);

    const availablePlayers = useMemo(() => {
        return players
            .filter(p => !selectedMatchPlayers.some(selected => selected.playerId === p.id))
            .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
    }, [players, selectedMatchPlayers]);

    const handleUpdatePlayer = (id, newName) => {
        if (onUpdatePlayer) {
            onUpdatePlayer(id, newName);
        }
    };

    const teamCounts = {
        nera: selectedMatchPlayers.filter(p => p.squadra === 'Nera').length,
        bianca: selectedMatchPlayers.filter(p => p.squadra === 'Bianca').length
    };

    const matchStats = useMemo(() => {
        const neraSegnati = selectedMatchPlayers.filter(p => p.squadra === 'Nera').reduce((sum, p) => sum + (p.goal || 0), 0);
        const neraAG = selectedMatchPlayers.filter(p => p.squadra === 'Nera').reduce((sum, p) => sum + (p.ag || 0), 0);
        const biancaSegnati = selectedMatchPlayers.filter(p => p.squadra === 'Bianca').reduce((sum, p) => sum + (p.goal || 0), 0);
        const biancaAG = selectedMatchPlayers.filter(p => p.squadra === 'Bianca').reduce((sum, p) => sum + (p.ag || 0), 0);
        return { totaleNera: neraSegnati + biancaAG, totaleBianca: biancaSegnati + neraAG };
    }, [selectedMatchPlayers]);

    const isFormValid = useMemo(() => {
        return teamCounts.nera === matchType && teamCounts.bianca === matchType &&
            matchStats.totaleNera === Number(scoreNera) && matchStats.totaleBianca === Number(scoreBianca) &&
            scoreNera !== '' && scoreBianca !== '' && date !== '';
    }, [teamCounts, matchStats, scoreNera, scoreBianca, matchType, date]);

    const addPlayerToTeam = (player) => {
        if (teamCounts[activeDrawerTeam.toLowerCase()] >= matchType) return;
        setSelectedMatchPlayers([...selectedMatchPlayers, {
            playerId: player.id,
            nome: player.nome,
            squadra: activeDrawerTeam,
            punti: 0,
            goal: 0,
            ag: 0,
            dr: 0
        }]);
    };

    const removePlayerFromMatch = (playerId) => {
        setSelectedMatchPlayers(selectedMatchPlayers.filter(pl => pl.playerId !== playerId));
    };

    const adjustStat = (playerId, field, delta) => {
        setSelectedMatchPlayers(prev => prev.map(p =>
            p.playerId === playerId ? { ...p, [field]: Math.max(0, (p[field] || 0) + delta) } : p
        ));
    };

    const handleMatchSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        const sn = Number(scoreNera);
        const sb = Number(scoreBianca);
        let vincitore = sn > sb ? 'Nera' : sb > sn ? 'Bianca' : 'Pareggio';

        // Mapping per lo schema Supabase (data, format, score_nera, score_bianca, match_details)
        const matchData = {
            data: date,
            format: `Calcio a ${matchType}`,
            score_nera: sn,
            score_bianca: sb,
            match_details: {
                vincitore: vincitore,
                match_type: matchType,
                partecipanti: selectedMatchPlayers.map(p => ({
                    ...p,
                    punti: vincitore === 'Pareggio' ? 1 : (p.squadra === vincitore ? 3 : 0),
                    dr: p.squadra === 'Nera' ? sn - sb : sb - sn
                }))
            }
        };

        if (editingMatchId) {
            onUpdateMatch({ ...matchData, id: editingMatchId });
        } else {
            onAddMatch(matchData);
        }
        resetForm();
    };

    const resetForm = () => { 
        setEditingMatchId(null); 
        setScoreNera(''); 
        setScoreBianca(''); 
        setSelectedMatchPlayers([]); 
    };

    const startEdit = (match) => {
        setEditingMatchId(match.id);
        setDate(match.data);
        setScoreNera(match.score_nera.toString());
        setScoreBianca(match.score_bianca.toString());
        
        // Estraiamo il tipo dal formato o dai dettagli
        const mType = match.match_details?.match_type || parseInt(match.format?.replace(/[^0-9]/g, '')) || 8;
        setMatchType(mType);
        
        setSelectedMatchPlayers([...(match.match_details?.partecipanti || [])]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="register-container">
            <MatchOverlays
                matchToDelete={matchToDelete}
                setMatchToDelete={setMatchToDelete}
                onDeleteMatch={onDeleteMatch}
                activeDrawerTeam={activeDrawerTeam}
                setActiveDrawerTeam={setActiveDrawerTeam}
                teamCounts={teamCounts}
                matchType={matchType}
                selectedMatchPlayers={selectedMatchPlayers}
                removePlayerFromMatch={removePlayerFromMatch}
                availablePlayers={availablePlayers}
                addPlayerToTeam={addPlayerToTeam}
            />

            <PlayerManager
                players={players}
                onAddPlayer={onAddPlayer}
                onDeletePlayer={onDeletePlayer}
                onUpdatePlayer={handleUpdatePlayer}
            />

            <MatchForm
                editingMatchId={editingMatchId}
                matchType={matchType} setMatchType={setMatchType}
                date={date} setDate={setDate}
                scoreNera={scoreNera} setScoreNera={setScoreNera}
                scoreBianca={scoreBianca} setScoreBianca={setScoreBianca}
                teamCounts={teamCounts}
                selectedMatchPlayers={selectedMatchPlayers}
                setActiveDrawerTeam={setActiveDrawerTeam}
                adjustStat={adjustStat}
                removePlayerFromMatch={removePlayerFromMatch}
                isFormValid={isFormValid}
                handleMatchSubmit={handleMatchSubmit}
            />

            <MatchHistory
                matches={matches}
                onStartEdit={startEdit}
                onDeleteMatch={setMatchToDelete}
            />
        </div>
    );
};

export default MatchRegisterPage;