# API Testing Guide

This document provides example API requests for testing the backend endpoints.

## Base URL
```
http://localhost:5000/api
```

## Posts Endpoints

### Get All Posts
```bash
curl http://localhost:5000/api/posts
```

### Get Single Post
```bash
curl http://localhost:5000/api/posts/POST_ID
```

### Create New Post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post content",
    "category": "testing",
    "tags": ["test", "api"],
    "status": "draft"
  }'
```

### Update Post
```bash
curl -X PUT http://localhost:5000/api/posts/POST_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test Post",
    "status": "published",
    "publishedTime": "2024-02-20T10:00:00Z"
  }'
```

### Delete Post
```bash
curl -X DELETE http://localhost:5000/api/posts/POST_ID
```

### Get Analytics
```bash
curl http://localhost:5000/api/posts/analytics
```

### Export to CSV
```bash
curl http://localhost:5000/api/posts/export -o scheduled-posts.csv
```

## AI Endpoints

### Predict Best Times
```bash
curl http://localhost:5000/api/ai/predict-times
```

### Generate Headlines
```bash
curl -X POST http://localhost:5000/api/ai/generate-headlines \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Artificial intelligence is transforming the way we create content. Machine learning algorithms can now analyze engagement patterns and predict optimal publishing times.",
    "category": "technology",
    "currentTitle": "AI in Content Creation"
  }'
```

### Analyze Post
```bash
curl http://localhost:5000/api/ai/analyze/POST_ID
```

## Example Responses

### Get All Posts Response
```json
[
  {
    "_id": "65d123abc456def789012345",
    "title": "10 Tips for Effective Remote Work",
    "content": "Working remotely has become the new normal...",
    "status": "published",
    "publishedTime": "2024-01-15T09:00:00.000Z",
    "category": "productivity",
    "tags": ["remote-work", "productivity", "tips"],
    "engagementMetrics": {
      "views": 1500,
      "likes": 145,
      "shares": 23,
      "comments": 18,
      "engagementRate": 12.4
    },
    "createdAt": "2024-01-14T10:00:00.000Z",
    "updatedAt": "2024-01-15T09:00:00.000Z"
  }
]
```

### Predict Best Times Response
```json
{
  "recommendedTimes": [
    {
      "hour": 9,
      "dayOfWeek": 1,
      "reason": "Monday mornings show highest engagement rates at 15.2%"
    },
    {
      "hour": 14,
      "dayOfWeek": 3,
      "reason": "Wednesday afternoons have strong social media activity"
    },
    {
      "hour": 17,
      "dayOfWeek": 5,
      "reason": "Friday evenings capture weekend planners with 13.8% engagement"
    }
  ],
  "confidence": "high",
  "insights": "Based on 15 published posts, peak engagement occurs during business hours on weekdays, particularly Monday mornings and Wednesday afternoons."
}
```

### Generate Headlines Response
```json
{
  "headlines": [
    "How AI is Revolutionizing Content Creation in 2024",
    "The Secret to Perfect Publishing Times: AI Analysis",
    "Machine Learning Reveals When Your Audience Engages Most",
    "Stop Guessing: Let AI Predict Your Best Publishing Times",
    "Transform Your Content Strategy with AI-Powered Insights"
  ],
  "explanation": "Headlines use power words like 'revolutionizing', 'secret', and 'transform' combined with specific value propositions and current year reference for relevance."
}
```

### Get Analytics Response
```json
[
  {
    "_id": {
      "hour": 9,
      "dayOfWeek": 2
    },
    "avgViews": 2100,
    "avgLikes": 234,
    "avgShares": 45,
    "avgComments": 31,
    "avgEngagementRate": 15.2,
    "count": 3
  },
  {
    "_id": {
      "hour": 14,
      "dayOfWeek": 4
    },
    "avgViews": 1850,
    "avgLikes": 198,
    "avgShares": 38,
    "avgComments": 25,
    "avgEngagementRate": 14.1,
    "count": 2
  }
]
```

## Testing with Postman

1. Import the following collection URL:
```
https://www.postman.com/collections/[collection-id]
```

Or create a new collection with the above endpoints.

## Testing with JavaScript/Axios

```javascript
// Example: Get all posts
const axios = require('axios');

async function getAllPosts() {
  try {
    const response = await axios.get('http://localhost:5000/api/posts');
    console.log('Posts:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example: Create a post
async function createPost() {
  try {
    const response = await axios.post('http://localhost:5000/api/posts', {
      title: 'Test Post from Script',
      content: 'This is test content',
      category: 'testing',
      status: 'draft'
    });
    console.log('Created post:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example: Generate headlines
async function generateHeadlines() {
  try {
    const response = await axios.post('http://localhost:5000/api/ai/generate-headlines', {
      content: 'Your content here...',
      category: 'technology'
    });
    console.log('Headlines:', response.data.headlines);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Content is required"
}
```

### 404 Not Found
```json
{
  "error": "Post not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error message"
}
```

## Rate Limiting

Currently, there are no rate limits. For production, consider:
- 100 requests per 15 minutes per IP for general endpoints
- 10 requests per hour for AI endpoints (due to OpenAI costs)

## Authentication

Current version: No authentication required
Production recommendation: Add JWT-based authentication

Example with authentication (future):
```bash
curl http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Health Check

Check if the server is running:
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```
