import { Tournament } from '../types/tournament';

const TOURNAMENTS_KEY = 'padel_tournaments';

export const getTournaments = (): Tournament[] => {
  try {
    const stored = localStorage.getItem(TOURNAMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading tournaments from localStorage:', error);
    return [];
  }
};

export const getTournamentById = (id: string): Tournament | null => {
  const tournaments = getTournaments();
  return tournaments.find(tournament => tournament.id === id) || null;
};

export const saveTournament = (tournament: Tournament): void => {
  try {
    const tournaments = getTournaments();
    const existingIndex = tournaments.findIndex(t => t.id === tournament.id);
    
    if (existingIndex >= 0) {
      tournaments[existingIndex] = tournament;
    } else {
      tournaments.push(tournament);
    }
    
    localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments));
  } catch (error) {
    console.error('Error saving tournament to localStorage:', error);
  }
};

export const updateTournament = (tournament: Tournament): void => {
  saveTournament(tournament);
};

export const deleteTournament = (id: string): void => {
  try {
    const tournaments = getTournaments();
    const filtered = tournaments.filter(tournament => tournament.id !== id);
    localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting tournament from localStorage:', error);
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};