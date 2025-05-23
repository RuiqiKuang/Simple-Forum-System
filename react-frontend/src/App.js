import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForumDashboard from './ForumDashboard';
import UserProfile from './UserProfile';
import RequireAuth from './utils/RequireAuth';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/forum"
        element={
          <RequireAuth>
            <ForumDashboard />
          </RequireAuth>
        }
      />
      <Route
          path="/profile/:username"
          element={
            <RequireAuth>
              <UserProfile />
            </RequireAuth>
          }
        />
    </Routes>
  </Router>
);

export default App;
