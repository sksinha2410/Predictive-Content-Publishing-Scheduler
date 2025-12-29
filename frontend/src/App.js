import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import PostList from './components/PostList';
import PostEditor from './components/PostEditor';
import Analytics from './components/Analytics';
import AIRecommendations from './components/AIRecommendations';
import { postService } from './services/api';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('Failed to fetch posts. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowEditor(true);
  };

  const handleSavePost = async (postData) => {
    try {
      if (selectedPost) {
        await postService.updatePost(selectedPost._id, postData);
      } else {
        await postService.createPost(postData);
      }
      await fetchPosts();
      setShowEditor(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(postId);
        await fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await postService.exportToCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'scheduled-posts.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Make sure there are scheduled posts available.');
    }
  };

  const handleEventDrop = async (postId, updatedData) => {
    await fetchPosts();
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📅 Content Publishing Scheduler</h1>
        <div className="header-actions">
          <button onClick={() => {
            setSelectedPost(null);
            setShowEditor(true);
          }} className="new-post-btn">
            + New Post
          </button>
          <button onClick={handleExportCSV} className="export-btn">
            📥 Export Scheduled Posts
          </button>
        </div>
      </header>

      <nav className="tab-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'calendar' ? 'active' : ''}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={activeTab === 'ai' ? 'active' : ''}
          onClick={() => setActiveTab('ai')}
        >
          AI Recommendations
        </button>
      </nav>

      <main className="app-main">
        {loading ? (
          <div className="loading-container">Loading...</div>
        ) : showEditor ? (
          <PostEditor
            post={selectedPost}
            onSave={handleSavePost}
            onCancel={() => {
              setShowEditor(false);
              setSelectedPost(null);
            }}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="dashboard-layout">
                <div className="dashboard-main">
                  <Calendar
                    posts={posts}
                    onEventDrop={handleEventDrop}
                    onEventClick={(info) => {
                      const post = posts.find(p => p._id === info.event.id);
                      if (post) handlePostClick(post);
                    }}
                  />
                </div>
                <div className="dashboard-sidebar">
                  <PostList
                    posts={posts.slice(0, 10)}
                    onPostClick={handlePostClick}
                    onDeletePost={handleDeletePost}
                  />
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <Calendar
                posts={posts}
                onEventDrop={handleEventDrop}
                onEventClick={(info) => {
                  const post = posts.find(p => p._id === info.event.id);
                  if (post) handlePostClick(post);
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <Analytics posts={posts} />
            )}

            {activeTab === 'ai' && (
              <AIRecommendations />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
