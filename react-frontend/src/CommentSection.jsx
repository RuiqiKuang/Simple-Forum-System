import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
      }
    };

    fetchComments();
  }, [postId]);

  const handlePostComment = async () => {
    if (!commentInput.trim()) return;

    await fetch(`http://localhost:3001/posts/${postId}/comments`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: commentInput })
    });

    setCommentInput('');

    const res = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setComments(data.comments);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <span className="comment-user">{comment.username}</span>
            <span className="comment-content">{comment.content}</span>
            <span className="comment-time">{dayjs(comment.createdAt).fromNow()}</span>
          </div>
        ))}
      </div>

      <div className="comment-input-wrapper">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
          className="comment-input"
        />
        <button onClick={handlePostComment} className="comment-btn">Reply</button>
      </div>
    </div>
  );
};

export default CommentSection;
