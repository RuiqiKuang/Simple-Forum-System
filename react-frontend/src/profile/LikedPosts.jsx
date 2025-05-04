import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../forum.css';
const LikedPosts = () => {
  const { username } = useParams();
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/users/${username}/likedPosts`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.success) setLikedPosts(data.likedPosts || []);
      });
  }, [username]);

  return (
    <div>
      <h2>Posts liked by {username}</h2>
      {likedPosts.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <strong>{post.username}</strong>
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

export default LikedPosts;
