import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import './forum.css';

const UserProfile = () => {
  const { username } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    fetch(`http://localhost:3001/users/${username}/profile`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfile(data.profile);
      });
  }, [username]);

  useEffect(() => {
    if (location.hash === '#liked') {
      setActiveTab('liked');
    } else {
      setActiveTab('posts');
    }
  }, [location]);

  const renderPosts = (list) =>
    list.map((post) => (
      <div key={post.id} className="post-card">
        <div className="post-header">
          <strong>{post.username}</strong>
          <span className="post-time">• {new Date(post.createdAt).toLocaleString()}</span>
        </div>
        <div className="post-content">{post.content}</div>
        <div className="post-footer">
          <button className="like-btn">❤️ {post.likes}</button>
        </div>
        {post.likers && post.likers.length > 0 && (
          <div className="post-likers">
            <span>Liked by: {post.likers.join(', ')}</span>
          </div>
        )}
      </div>
    ));

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="forum-container">
      <div className="dashboard-header" style={{ paddingBottom: '0' }}>
        <div className="top-bar">
          <span className="greeting">👤 {profile.username}'s Profile</span>
          <Link to="/forum">
            <button className="logout-btn">← Back to Forum</button>
          </Link>
        </div>
        <div className="tab-buttons" style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button
            className={`post-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('posts');
              navigate(`#posts`);
            }}
          >
            📝 Posts
          </button>
          <button
            className={`post-btn ${activeTab === 'liked' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('liked');
              navigate(`#liked`);
            }}
          >
            ❤️ Liked
          </button>
        </div>
      </div>

      <div className="post-list" style={{ paddingTop: '20px' }}>
        {activeTab === 'posts'
          ? renderPosts(profile.posts)
          : renderPosts(profile.likedPosts)}
      </div>
    </div>
  );
};

export default UserProfile;
