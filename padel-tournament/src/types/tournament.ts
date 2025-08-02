export type TournamentFormat = 'Mexicano' | 'Americano' | 'Knockout';
export type TournamentMode = 'Individual' | 'Team';

export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  player1: Player;
  player2: Player;
}

export interface Match {
  id: string;
  roundNumber: number;
  courtNumber: number;
  team1: Team;
  team2: Team;
  team1Score?: number;
  team2Score?: number;
  isCompleted: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  format: TournamentFormat;
  mode: TournamentMode;
  numberOfPlayers: number;
  players: Player[];
  numberOfRounds: number;
  courtNumber: number;
  matches: Match[];
  isGenerated: boolean;
  createdAt: string;
}

export interface TournamentStats {
  playerId: string;
  playerName: string;
  wins: number;
  losses: number;
  points: number;
  matchesPlayed: number;
}