import React, { useState } from 'react';
import { aiService } from '../services/api';
import './PostEditor.css';

const PostEditor = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    category: post?.category || 'general',
    tags: post?.tags?.join(', ') || '',
    scheduledTime: post?.scheduledTime ? new Date(post.scheduledTime).toISOString().slice(0, 16) : '',
    status: post?.status || 'draft'
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateHeadlines = async () => {
    if (!formData.content) {
      alert('Please add some content first');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.generateHeadlines({
        content: formData.content,
        category: formData.category,
        currentTitle: formData.title
      });
      setSuggestions(response.data.headlines || []);
    } catch (error) {
      console.error('Error generating headlines:', error);
      alert('Failed to generate headlines. Make sure the backend server is running with OpenAI API key configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      scheduledTime: formData.scheduledTime || null
    };
    onSave(postData);
  };

  return (
    <div className="post-editor-container">
      <h2>{post ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={handleGenerateHeadlines}
            disabled={loading}
            className="ai-btn"
          >
            {loading ? 'Generating...' : '🤖 Generate AI Headlines'}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-box">
            <h4>AI Suggested Headlines:</h4>
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => setFormData({ ...formData, title: suggestion })}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="ai, technology, marketing"
          />
        </div>

        <div className="form-group">
          <label htmlFor="scheduledTime">Scheduled Time</label>
          <input
            type="datetime-local"
            id="scheduledTime"
            name="scheduledTime"
            value={formData.scheduledTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {post ? 'Update Post' : 'Create Post'}
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;
