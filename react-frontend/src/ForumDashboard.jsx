import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import CommentSection from './CommentSection';
import './forum.css';

const ForumDashboard = () => {
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('http://localhost:3001/me', {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          setUsername(data.username);
        }
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };
  
    fetchMe();
  }, []);
  
  const fetchPosts = async () => {
    const res = await fetch('http://localhost:3001/posts', {
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) setPosts(data.posts);
  };

  const handleNewPost = async () => {
    if (!newPost.trim()) return;
  
    await fetch('http://localhost:3001/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: newPost })
    });
  
    setNewPost('');
    fetchPosts();
  };
  

  const handleLike = async (postId) => {
    const res = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({})
    });
  
    const data = await res.json();
    if (data.success) {
      toast.success(data.action === 'liked' ? '❤️ You liked this post!' : '💔 You unliked this post.');
      fetchPosts();
    }
  };
  

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="forum-container">
      <div className="dashboard-header">
        <div className="top-bar">
          <span className="greeting">Hi, {username}</span>
          <Link to={`/profile/${username}`}>
            <button className="profile-btn">My Profile</button>
          </Link>
          <button className="logout-btn" onClick={async () => {
            await fetch('http://localhost:3001/logout', {
              method: 'POST',
              credentials: 'include'
            });
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
      </div>

      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <strong>{post.username}</strong>
              <span className="post-time">
                • {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="post-content">
              {post.content}
            </div>
            <div className="post-footer">
              <button className="like-btn" onClick={() => handleLike(post.id)}>
                ❤️ {post.likes}
              </button>
            </div>
            {post.likers.length > 0 && (
              <div className="post-likers">
                <span>Liked by: {post.likers.join(', ')}</span>
              </div>
            )}
            <CommentSection postId={post.id} />
          </div>
        ))}
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default ForumDashboard;
