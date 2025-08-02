import React from 'react';
import { Tournament, Match } from '../types/tournament';

interface BracketViewProps {
  tournament: Tournament;
}

const BracketView: React.FC<BracketViewProps> = ({ tournament }) => {
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

  const groupedMatches = groupMatchesByRound(tournament.matches);
  const rounds = Object.keys(groupedMatches).map(Number).sort((a, b) => a - b);

  if (rounds.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No matches generated yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Tournament Bracket</h3>
      
      {rounds.map(round => (
        <div key={round} className="border-l-4 border-blue-500 pl-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            {round === 1 && rounds.length === 1 ? 'Final' :
             round === rounds.length ? 'Final' :
             round === rounds.length - 1 ? 'Semi-Finals' :
             round === rounds.length - 2 ? 'Quarter-Finals' :
             `Round ${round}`}
          </h4>
          
          <div className="space-y-4">
            {groupedMatches[round].map(match => (
              <div key={match.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Court {match.courtNumber}</span>
                  {match.isCompleted && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      Completed
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 items-center">
                  {/* Team 1 */}
                  <div className={`text-center p-3 rounded ${
                    match.isCompleted && (match.team1Score || 0) > (match.team2Score || 0)
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-gray-50'
                  }`}>
                    <div className="font-medium text-sm mb-1">
                      {match.team1.player1.name}
                    </div>
                    <div className="font-medium text-sm mb-2">
                      {match.team1.player2.name}
                    </div>
                    <div className="text-xl font-bold">
                      {match.team1Score !== undefined ? match.team1Score : '-'}
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center text-gray-500 font-medium">VS</div>

                  {/* Team 2 */}
                  <div className={`text-center p-3 rounded ${
                    match.isCompleted && (match.team2Score || 0) > (match.team1Score || 0)
                      ? 'bg-green-100 border-2 border-green-500'
                      : 'bg-gray-50'
                  }`}>
                    <div className="font-medium text-sm mb-1">
                      {match.team2.player1.name}
                    </div>
                    <div className="font-medium text-sm mb-2">
                      {match.team2.player2.name}
                    </div>
                    <div className="text-xl font-bold">
                      {match.team2Score !== undefined ? match.team2Score : '-'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Knockout Format</h4>
        <p className="text-sm text-blue-800">
          In knockout format, losing teams are eliminated and winning teams advance to the next round.
          The tournament continues until there is one winning team.
        </p>
      </div>
    </div>
  );
};

export default BracketView;