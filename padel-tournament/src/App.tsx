import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateTournamentPage from './components/CreateTournamentPage';
import TournamentDetailPage from './components/TournamentDetailPage';
import StandingsPage from './components/StandingsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateTournamentPage />} />
          <Route path="/tournament/:id" element={<TournamentDetailPage />} />
          <Route path="/tournament/:id/standings" element={<StandingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
