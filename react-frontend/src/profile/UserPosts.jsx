import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../forum.css';
const UserPosts = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/users/${username}/posts`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setPosts(data.posts);
      });
  }, [username]);

  return (
    <div>
      <h2>{username}'s Posts</h2>
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <strong>{username}</strong>
            <span className="post-time">• {new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="post-content">{post.content}</div>
          <div className="post-footer">
            <button className="like-btn">❤️ {post.likes}</button>
          </div>
          {post.likers?.length > 0 && (
            <div className="post-likers">
              <span>Liked by: {post.likers.join(', ')}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserPosts;
