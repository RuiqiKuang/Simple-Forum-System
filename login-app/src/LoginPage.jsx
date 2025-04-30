import React, { useState, useEffect } from 'react';
import './style.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginUserName, setLoginUserName] = useState('');
  const [userList, setUserList] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/users');
      const data = await res.json();
      if (data.success) {
        setUserList(data.users || []);
      } else {
        alert(data.message || '获取用户列表失败');
      }
    } catch (err) {
      alert('网络错误：无法获取用户列表');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
  
      if (res.ok && data.success) {
        setLoginUserName(data.username);
        alert(`欢迎你，${data.username}！`);
      } else {
        alert(data.message || '登录失败');
      }
    } catch (err) {
      alert('网络错误：无法登录');
    } finally {
      // 登录成功或失败都清空输入
      setUsername('');
      setPassword('');
    }
  };
  

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:3001/registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('注册成功！');
        setUsername('');
        setPassword('');
        fetchUsers();
      } else {
        alert(data.message || '注册失败');
      }
    } catch (err) {
      alert('网络错误：无法注册');
    }
  };

  return (
    <div className="container">
      <div className="title">登 陆</div>

      <div className="mgb12">
        <label>用户名</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="mgb12">
        <label>密码</label>
        <input
          type="text"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleLogin}>登录</button>
      <button onClick={handleRegister}>注册</button>

      <div className="info mgb12">
        <label>当前登陆的用户：</label>
        <span>{loginUserName}</span>
      </div>

      <div className="users">
        <div className="title">所有注册用户</div>
        <div id="userList">
          {userList.map((user, index) => (
            <div key={index}>{user}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
