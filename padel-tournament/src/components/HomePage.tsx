import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tournament } from '../types/tournament';
import { getTournaments, deleteTournament } from '../utils/localStorage';

const HomePage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = () => {
    const loadedTournaments = getTournaments();
    setTournaments(loadedTournaments);
  };

  const handleDeleteTournament = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      deleteTournament(id);
      loadTournaments();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Padel Tournament Manager</h1>
          <p className="text-lg text-gray-600">Manage your local padel tournaments</p>
        </div>

        <div className="mb-8 text-center">
          <Link
            to="/create"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Tournament
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tournaments</h2>
          
          {tournaments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No tournaments yet</h3>
              <p className="text-gray-500 mb-4">Create your first tournament to get started!</p>
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Tournament
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 truncate">{tournament.name}</h3>
                      <button
                        onClick={() => handleDeleteTournament(tournament.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete tournament"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Format:</span>
                        <span className="font-medium">{tournament.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mode:</span>
                        <span className="font-medium">{tournament.mode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Players:</span>
                        <span className="font-medium">{tournament.numberOfPlayers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rounds:</span>
                        <span className="font-medium">{tournament.numberOfRounds}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Courts:</span>
                        <span className="font-medium">{tournament.courtNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{formatDate(tournament.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/tournament/${tournament.id}`}
                        className="flex-1 text-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                      {tournament.isGenerated && (
                        <Link
                          to={`/tournament/${tournament.id}/standings`}
                          className="flex-1 text-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                        >
                          Standings
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;