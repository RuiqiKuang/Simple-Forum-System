import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './style.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userList, setUserList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/users');
      const data = await res.json();
      if (data.success) setUserList(data.users || []);
      else toast.error(data.message || 'Failed to fetch user list.');
    } catch {
      toast.error('Network error: unable to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:3001/registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Registration successful!');
        setUsername('');
        setPassword('');
        fetchUsers();
      } else {
        toast.error(data.message || 'Registration failed.');
      }
    } catch {
      toast.error('Network error: unable to register.');
    }
  };

  const strengthScore = calculatePasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Good', 'Strong', 'Very Strong'];

  return (
    <div className="container">
      <div className="title">Register</div>
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
        <div className="password-strength-bar">
          <div className={`strength-fill strength-${strengthScore}`}></div>
        </div>
        {password && <span className="strength-label">{strengthLabels[strengthScore]}</span>}
      </div>
      <button onClick={handleRegister}>Register</button>
      <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link>.</p>
      <div className="users">
        <div className="title">Registered Users</div>
        <div id="userList">
          {userList.map((user, index) => <div key={index}>{user}</div>)}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default RegisterPage;