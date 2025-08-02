import { Player, Team, Match, Tournament, TournamentStats } from '../types/tournament';
import { generateId } from './localStorage';

export const createTeamsFromPlayers = (players: Player[]): Team[] => {
  const teams: Team[] = [];
  
  for (let i = 0; i < players.length; i += 2) {
    if (i + 1 < players.length) {
      teams.push({
        id: generateId(),
        player1: players[i],
        player2: players[i + 1]
      });
    }
  }
  
  return teams;
};

export const generateRoundRobinMatches = (tournament: Tournament): Match[] => {
  const matches: Match[] = [];
  const teams = createTeamsFromPlayers(tournament.players);
  let matchId = 0;
  
  // Generate all possible team combinations
  for (let round = 1; round <= tournament.numberOfRounds; round++) {
    let courtNumber = 1;
    
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          id: generateId(),
          roundNumber: round,
          courtNumber: courtNumber,
          team1: teams[i],
          team2: teams[j],
          isCompleted: false
        });
        
        courtNumber++;
        if (courtNumber > tournament.courtNumber) {
          courtNumber = 1;
        }
      }
    }
  }
  
  return matches;
};

export const generateKnockoutMatches = (tournament: Tournament): Match[] => {
  const matches: Match[] = [];
  const shuffledPlayers = [...tournament.players].sort(() => Math.random() - 0.5);
  const teams = createTeamsFromPlayers(shuffledPlayers);
  
  let currentRound = 1;
  let currentTeams = teams;
  let courtNumber = 1;
  
  while (currentTeams.length > 1) {
    const roundMatches: Match[] = [];
    
    for (let i = 0; i < currentTeams.length; i += 2) {
      if (i + 1 < currentTeams.length) {
        roundMatches.push({
          id: generateId(),
          roundNumber: currentRound,
          courtNumber: courtNumber,
          team1: currentTeams[i],
          team2: currentTeams[i + 1],
          isCompleted: false
        });
        
        courtNumber++;
        if (courtNumber > tournament.courtNumber) {
          courtNumber = 1;
        }
      }
    }
    
    matches.push(...roundMatches);
    currentRound++;
    
    // For knockout, we'd need to determine winners to proceed to next round
    // This will be handled when matches are completed
    break;
  }
  
  return matches;
};

export const calculateStats = (tournament: Tournament): TournamentStats[] => {
  const stats: Map<string, TournamentStats> = new Map();
  
  // Initialize stats for all players
  tournament.players.forEach(player => {
    stats.set(player.id, {
      playerId: player.id,
      playerName: player.name,
      wins: 0,
      losses: 0,
      points: 0,
      matchesPlayed: 0
    });
  });
  
  // Calculate stats from completed matches
  tournament.matches
    .filter(match => match.isCompleted && match.team1Score !== undefined && match.team2Score !== undefined)
    .forEach(match => {
      const team1Players = [match.team1.player1, match.team1.player2];
      const team2Players = [match.team2.player1, match.team2.player2];
      
      const team1Won = (match.team1Score || 0) > (match.team2Score || 0);
      
      // Update stats for team 1 players
      team1Players.forEach(player => {
        const playerStats = stats.get(player.id)!;
        playerStats.matchesPlayed++;
        if (team1Won) {
          playerStats.wins++;
          playerStats.points += 3; // 3 points for win
        } else {
          playerStats.losses++;
          playerStats.points += 1; // 1 point for participation
        }
      });
      
      // Update stats for team 2 players
      team2Players.forEach(player => {
        const playerStats = stats.get(player.id)!;
        playerStats.matchesPlayed++;
        if (!team1Won) {
          playerStats.wins++;
          playerStats.points += 3; // 3 points for win
        } else {
          playerStats.losses++;
          playerStats.points += 1; // 1 point for participation
        }
      });
    });
  
  return Array.from(stats.values()).sort((a, b) => b.points - a.points);
};