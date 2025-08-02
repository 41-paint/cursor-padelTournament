import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Tournament, Match } from '../types/tournament';
import { getTournamentById, updateTournament } from '../utils/localStorage';
import { generateRoundRobinMatches, generateKnockoutMatches } from '../utils/matchGeneration';
import BracketView from './BracketView';

const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const tournamentData = getTournamentById(id);
      if (tournamentData) {
        setTournament(tournamentData);
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  const generateMatches = () => {
    if (!tournament) return;

    let matches: Match[] = [];
    
    if (tournament.format === 'Americano' || tournament.format === 'Mexicano') {
      matches = generateRoundRobinMatches(tournament);
    } else if (tournament.format === 'Knockout') {
      matches = generateKnockoutMatches(tournament);
    }

    const updatedTournament = {
      ...tournament,
      matches,
      isGenerated: true
    };

    updateTournament(updatedTournament);
    setTournament(updatedTournament);
  };

  const updateMatchScore = (matchId: string, team1Score: number, team2Score: number) => {
    if (!tournament) return;

    const updatedMatches = tournament.matches.map(match => 
      match.id === matchId 
        ? { ...match, team1Score, team2Score, isCompleted: true }
        : match
    );

    const updatedTournament = {
      ...tournament,
      matches: updatedMatches
    };

    updateTournament(updatedTournament);
    setTournament(updatedTournament);
  };

  const groupMatchesByRound = (matches: Match[]) => {
    const grouped: { [round: number]: Match[] } = {};
    matches.forEach(match => {
      if (!grouped[match.roundNumber]) {
        grouped[match.roundNumber] = [];
      }
      grouped[match.roundNumber].push(match);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tournament not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const groupedMatches = groupMatchesByRound(tournament.matches);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <div className="flex gap-2">
              {tournament.isGenerated && (
                <Link
                  to={`/tournament/${tournament.id}/standings`}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  View Standings
                </Link>
              )}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tournament.name}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="text-gray-600">Format</div>
              <div className="font-semibold">{tournament.format}</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="text-gray-600">Mode</div>
              <div className="font-semibold">{tournament.mode}</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="text-gray-600">Players</div>
              <div className="font-semibold">{tournament.numberOfPlayers}</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="text-gray-600">Courts</div>
              <div className="font-semibold">{tournament.courtNumber}</div>
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Players</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tournament.players.map((player, index) => (
              <div key={player.id} className="bg-gray-50 px-3 py-2 rounded-md">
                {index + 1}. {player.name}
              </div>
            ))}
          </div>
        </div>

        {/* Matches Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Matches</h2>
            {!tournament.isGenerated && (
              <button
                onClick={generateMatches}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Generate Matches
              </button>
            )}
          </div>

          {!tournament.isGenerated ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No matches generated yet</p>
              <button
                onClick={generateMatches}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Matches
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {tournament.format === 'Knockout' && (
                <BracketView tournament={tournament} />
              )}
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Match Results</h3>
                {Object.entries(groupedMatches).map(([round, matches]) => (
                  <div key={round} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h4 className="text-md font-medium text-gray-700 mb-4">Round {round}</h4>
                    <div className="space-y-4">
                      {matches.map((match) => (
                        <MatchRow
                          key={match.id}
                          match={match}
                          onScoreUpdate={updateMatchScore}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface MatchRowProps {
  match: Match;
  onScoreUpdate: (matchId: string, team1Score: number, team2Score: number) => void;
}

const MatchRow: React.FC<MatchRowProps> = ({ match, onScoreUpdate }) => {
  const [team1Score, setTeam1Score] = useState(match.team1Score || 0);
  const [team2Score, setTeam2Score] = useState(match.team2Score || 0);

  const handleSaveResult = () => {
    onScoreUpdate(match.id, team1Score, team2Score);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Court {match.courtNumber}</span>
        {match.isCompleted && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            Completed
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Team 1 */}
        <div className="text-center">
          <div className="font-medium text-gray-900 mb-2">
            {match.team1.player1.name} & {match.team1.player2.name}
          </div>
          <input
            type="number"
            value={team1Score}
            onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
            min="0"
            disabled={match.isCompleted}
          />
        </div>

        {/* VS */}
        <div className="text-center text-gray-500 font-medium">VS</div>

        {/* Team 2 */}
        <div className="text-center">
          <div className="font-medium text-gray-900 mb-2">
            {match.team2.player1.name} & {match.team2.player2.name}
          </div>
          <input
            type="number"
            value={team2Score}
            onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
            min="0"
            disabled={match.isCompleted}
          />
        </div>
      </div>

      {!match.isCompleted && (
        <div className="mt-4 text-center">
          <button
            onClick={handleSaveResult}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Result
          </button>
        </div>
      )}
    </div>
  );
};

export default TournamentDetailPage;