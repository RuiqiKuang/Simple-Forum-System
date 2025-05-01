import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('username', data.username);
        toast.success(`Welcome, ${data.username}!`);
        setTimeout(() => navigate('/forum'), 800);
      } else {
        toast.error(data.message || 'Login failed.');
      }
    } catch (err) {
      toast.error('Network error: unable to login.');
    } finally {
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="container">
      <div className="title">Sign In</div>
      <div className="mgb12">
        <label>Username</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} autoComplete="off" />
      </div>
      <div className="mgb12">
        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="password-input"
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
          </span>
        </div>
      </div>
      <button onClick={handleLogin}>Login</button>
      <p className="auth-switch">Don't have an account? <Link to="/register">Register here</Link>.</p>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default LoginPage;
