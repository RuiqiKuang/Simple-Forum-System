// ForumDashboard.jsx (React Frontend - Styled)
import React, { useState, useEffect } from 'react';
import './forum.css';

const ForumDashboard = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const fetchPosts = async () => {
    const res = await fetch('http://localhost:3001/posts');
    const data = await res.json();
    if (data.success) setPosts(data.posts);
  };

  const handleNewPost = async () => {
    if (!newPost.trim()) return;
    await fetch('http://localhost:3001/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newPost, username })
    });
    setNewPost('');
    fetchPosts();
  };

  const handleLike = async (postId) => {
    await fetch(`http://localhost:3001/posts/${postId}/like`, { method: 'POST' });
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="forum-container">
      <div className="top-bar">
        <span className="greeting">Hi, {username}</span>
        <button className="logout-btn" onClick={() => {
          localStorage.removeItem('username');
          window.location.href = '/';
        }}>Logout</button>
      </div>

      <div className="new-post-card">
        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Share something new..."
          className="new-post-input"
        />
        <button className="post-btn" onClick={handleNewPost}>Post</button>
      </div>

      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <strong>{post.username}</strong>
            </div>
            <div className="post-content">
              {post.content}
            </div>
            <div className="post-footer">
              <button className="like-btn" onClick={() => handleLike(post.id)}>❤️ {post.likes}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumDashboard;
