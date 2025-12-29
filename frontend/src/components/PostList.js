import React from 'react';
import './PostList.css';

const PostList = ({ posts, onPostClick, onDeletePost }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return '#4caf50';
      case 'scheduled':
        return '#2196f3';
      case 'draft':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="post-list-container">
      <h2>Posts</h2>
      <div className="post-list">
        {posts.length === 0 ? (
          <p className="no-posts">No posts available</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="post-item" onClick={() => onPostClick(post)}>
              <div className="post-header">
                <h3>{post.title}</h3>
                <span 
                  className="post-status" 
                  style={{ backgroundColor: getStatusColor(post.status) }}
                >
                  {post.status}
                </span>
              </div>
              <p className="post-content">{post.content.substring(0, 150)}...</p>
              <div className="post-meta">
                <span className="post-category">{post.category}</span>
                {post.publishedTime && (
                  <span className="post-date">Published: {formatDate(post.publishedTime)}</span>
                )}
                {post.scheduledTime && !post.publishedTime && (
                  <span className="post-date">Scheduled: {formatDate(post.scheduledTime)}</span>
                )}
              </div>
              {post.status === 'published' && (
                <div className="post-metrics">
                  <span>👁 {post.engagementMetrics.views}</span>
                  <span>👍 {post.engagementMetrics.likes}</span>
                  <span>📤 {post.engagementMetrics.shares}</span>
                  <span>💬 {post.engagementMetrics.comments}</span>
                  <span className="engagement-rate">
                    {post.engagementMetrics.engagementRate?.toFixed(2)}% engagement
                  </span>
                </div>
              )}
              {onDeletePost && (
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePost(post._id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostList;
