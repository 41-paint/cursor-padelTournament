import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tournament, TournamentFormat, TournamentMode, Player } from '../types/tournament';
import { saveTournament, generateId } from '../utils/localStorage';

const CreateTournamentPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    format: 'Americano' as TournamentFormat,
    mode: 'Team' as TournamentMode,
    numberOfPlayers: 4,
    numberOfRounds: 1,
    courtNumber: 1
  });
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleFormatChange = (format: TournamentFormat) => {
    setFormData(prev => ({ ...prev, format }));
  };

  const handleModeChange = (mode: TournamentMode) => {
    setFormData(prev => ({ ...prev, mode }));
  };

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < formData.numberOfPlayers) {
      const newPlayer: Player = {
        id: generateId(),
        name: newPlayerName.trim()
      };
      setPlayers(prev => [...prev, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(player => player.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (players.length !== formData.numberOfPlayers) {
      alert(`Please add exactly ${formData.numberOfPlayers} players`);
      return;
    }

    const tournament: Tournament = {
      id: generateId(),
      name: formData.name,
      format: formData.format,
      mode: formData.mode,
      numberOfPlayers: formData.numberOfPlayers,
      players: players,
      numberOfRounds: formData.numberOfRounds,
      courtNumber: formData.courtNumber,
      matches: [],
      isGenerated: false,
      createdAt: new Date().toISOString()
    };

    saveTournament(tournament);
    navigate(`/tournament/${tournament.id}`);
  };

  const isFormValid = formData.name.trim() && players.length === formData.numberOfPlayers;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Tournament</h1>
            <p className="text-gray-600">Set up your padel tournament</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tournament Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tournament Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tournament name"
                  required
                />
              </div>

              {/* Tournament Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tournament Format
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleFormatChange('Mexicano')}
                    className={`px-4 py-3 rounded-md border-2 font-medium transition-colors ${
                      formData.format === 'Mexicano'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Mexicano
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatChange('Americano')}
                    className={`px-4 py-3 rounded-md border-2 font-medium transition-colors ${
                      formData.format === 'Americano'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Americano
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatChange('Knockout')}
                    className={`px-4 py-3 rounded-md border-2 font-medium transition-colors ${
                      formData.format === 'Knockout'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Knockout
                  </button>
                </div>
              </div>

              {/* Tournament Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tournament Mode
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleModeChange('Individual')}
                    className={`flex-1 px-4 py-3 rounded-md border-2 font-medium transition-colors ${
                      formData.mode === 'Individual'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('Team')}
                    className={`flex-1 px-4 py-3 rounded-md border-2 font-medium transition-colors ${
                      formData.mode === 'Team'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Team
                  </button>
                </div>
              </div>

              {/* Number of Players */}
              <div>
                <label htmlFor="numberOfPlayers" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Players
                </label>
                <input
                  type="number"
                  id="numberOfPlayers"
                  name="numberOfPlayers"
                  value={formData.numberOfPlayers}
                  onChange={handleInputChange}
                  min="2"
                  max="32"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Number of Rounds */}
              <div>
                <label htmlFor="numberOfRounds" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rounds
                </label>
                <input
                  type="number"
                  id="numberOfRounds"
                  name="numberOfRounds"
                  value={formData.numberOfRounds}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Court Number */}
              <div>
                <label htmlFor="courtNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Courts
                </label>
                <input
                  type="number"
                  id="courtNumber"
                  name="courtNumber"
                  value={formData.courtNumber}
                  onChange={handleInputChange}
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Add Players Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Players ({players.length}/{formData.numberOfPlayers})
                </label>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Enter player name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={players.length >= formData.numberOfPlayers}
                  />
                  <button
                    type="button"
                    onClick={addPlayer}
                    disabled={!newPlayerName.trim() || players.length >= formData.numberOfPlayers}
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                </div>

                {players.length > 0 && (
                  <div className="space-y-2">
                    {players.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <span className="font-medium">{index + 1}. {player.name}</span>
                        <button
                          type="button"
                          onClick={() => removePlayer(player.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Create Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTournamentPage;