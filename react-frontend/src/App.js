import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import ForumDashboard from './ForumDashboard';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forum" element={<ForumDashboard />} />
    </Routes>
  </Router>
);

export default App;
