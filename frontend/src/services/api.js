import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const postService = {
  getAllPosts: () => api.get('/posts'),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getAnalytics: () => api.get('/posts/analytics'),
  exportToCSV: () => api.get('/posts/export', { responseType: 'blob' }),
};

export const aiService = {
  predictBestTimes: () => api.get('/ai/predict-times'),
  generateHeadlines: (data) => api.post('/ai/generate-headlines', data),
  analyzeSuggestions: (postId) => api.get(`/ai/analyze/${postId}`),
};

export default api;
