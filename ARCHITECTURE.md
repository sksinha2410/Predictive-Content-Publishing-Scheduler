# 🏗️ Architecture Documentation

## System Architecture

The Predictive Content Publishing Scheduler follows a modern three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌─────────────┬──────────────┬─────────────┬──────────────┐│
│  │  Dashboard  │   Calendar   │  Analytics  │  AI Insights ││
│  └─────────────┴──────────────┴─────────────┴──────────────┘│
│                            │                                 │
│                         Axios API Client                     │
└───────────────────────────┼─────────────────────────────────┘
                            │
                    HTTP REST API (CORS enabled)
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                   Backend (Node.js/Express)                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                      Routes Layer                        ││
│  │  ┌──────────────┐              ┌──────────────┐         ││
│  │  │  Post Routes │              │   AI Routes  │         ││
│  │  └──────────────┘              └──────────────┘         ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Controllers Layer                      ││
│  │  ┌────────────────┐          ┌────────────────┐         ││
│  │  │ postController │          │  aiController  │         ││
│  │  └────────────────┘          └────────────────┘         ││
│  └─────────────────────────────────────────────────────────┘│
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   MongoDB    │    │  OpenAI API  │    │  CSV Export  │
│   Database   │    │   (GPT-3.5)  │    │   Service    │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Component Breakdown

### Frontend Components

#### 1. **App.js** (Main Container)
- State management for posts and UI
- Tab navigation (Dashboard, Calendar, Analytics, AI)
- Orchestrates child components
- Handles API calls coordination

#### 2. **Calendar.js**
- FullCalendar integration
- Drag-and-drop event handling
- Multiple view modes (month, week, day)
- Event click handlers
- Real-time post updates

#### 3. **PostList.js**
- List view of posts
- Status color coding
- Engagement metrics display
- Click-to-edit functionality
- Delete operations

#### 4. **PostEditor.js**
- Create/edit post form
- AI headline generation integration
- Form validation
- Real-time preview
- Schedule picker

#### 5. **Analytics.js**
- Recharts integration
- Engagement statistics calculation
- Hourly engagement visualization
- Daily engagement visualization
- Summary metrics cards

#### 6. **AIRecommendations.js**
- Best time predictions display
- Confidence level indicators
- Insights presentation
- Refresh functionality

### Backend Structure

#### 1. **Models**

**Post.js**
```javascript
{
  title: String (required),
  content: String (required),
  scheduledTime: Date,
  publishedTime: Date,
  status: Enum ['draft', 'scheduled', 'published'],
  engagementMetrics: {
    views: Number,
    likes: Number,
    shares: Number,
    comments: Number,
    engagementRate: Number (calculated)
  },
  aiSuggestions: {
    recommendedTime: Date,
    recommendedHeadlines: [String],
    confidence: Number
  },
  category: String,
  tags: [String],
  timestamps: true
}
```

#### 2. **Controllers**

**postController.js**
- `getAllPosts()`: Fetch all posts
- `getPost(id)`: Fetch single post
- `createPost(data)`: Create new post
- `updatePost(id, data)`: Update existing post
- `deletePost(id)`: Delete post
- `getAnalytics()`: MongoDB aggregation for engagement data
- `exportToCSV()`: Generate CSV file

**aiController.js**
- `predictBestTimes()`: Analyze historical data with OpenAI
- `generateHeadlines(content)`: AI headline generation
- `analyzeSuggestions(postId)`: Comprehensive AI analysis

#### 3. **Routes**

**posts.js**
```
GET    /api/posts          - List all posts
GET    /api/posts/:id      - Get single post
POST   /api/posts          - Create post
PUT    /api/posts/:id      - Update post
DELETE /api/posts/:id      - Delete post
GET    /api/posts/analytics - Get analytics
GET    /api/posts/export   - Export CSV
```

**ai.js**
```
GET  /api/ai/predict-times        - Get best posting times
POST /api/ai/generate-headlines   - Generate headlines
GET  /api/ai/analyze/:postId      - Full AI analysis
```

## Data Flow

### Creating a Post with AI Headlines

1. User enters content in PostEditor
2. User clicks "Generate AI Headlines"
3. Frontend calls `POST /api/ai/generate-headlines`
4. Backend calls OpenAI API with content
5. OpenAI returns 5 headline suggestions
6. Backend returns suggestions to frontend
7. User selects headline and saves post
8. Frontend calls `POST /api/posts`
9. Backend saves to MongoDB
10. Frontend refreshes post list

### Scheduling a Post via Drag-and-Drop

1. User drags post to new date in calendar
2. Calendar component calls `handleEventDrop`
3. Frontend calls `PUT /api/posts/:id` with new scheduledTime
4. Backend updates MongoDB document
5. MongoDB triggers pre-save hook if needed
6. Backend returns updated post
7. Frontend updates state and re-renders calendar

### Viewing AI Recommendations

1. User navigates to AI Recommendations tab
2. Component calls `GET /api/ai/predict-times`
3. Backend queries MongoDB for published posts
4. Backend aggregates engagement data
5. Backend calls OpenAI with aggregated data
6. OpenAI analyzes patterns and returns recommendations
7. Backend formats response with confidence levels
8. Frontend displays recommendations with visual indicators

## Database Schema

### Collections

**posts**
- Primary collection for all content
- Indexed on: `status`, `publishedTime`, `scheduledTime`
- Aggregation pipelines for analytics

### Aggregation Pipelines

**Engagement by Time Analysis**
```javascript
[
  { $match: { status: 'published' } },
  {
    $group: {
      _id: {
        hour: { $hour: '$publishedTime' },
        dayOfWeek: { $dayOfWeek: '$publishedTime' }
      },
      avgViews: { $avg: '$engagementMetrics.views' },
      avgEngagementRate: { $avg: '$engagementMetrics.engagementRate' },
      count: { $sum: 1 }
    }
  },
  { $sort: { avgEngagementRate: -1 } }
]
```

## API Integration

### OpenAI Integration

**Model**: GPT-3.5-turbo
**Temperature**: 0.7 for time predictions, 0.8 for headlines
**Max Tokens**: Default per request

**Request Format (Headlines)**:
```javascript
{
  model: "gpt-3.5-turbo",
  messages: [
    { 
      role: "system", 
      content: "You are an expert copywriter..." 
    },
    { 
      role: "user", 
      content: "Generate headlines for: [content]" 
    }
  ],
  temperature: 0.8
}
```

**Response Processing**:
- Parse JSON response
- Extract headlines array
- Return to frontend

## Security Considerations

### Current Implementation
- CORS enabled for development
- Environment variables for sensitive data
- API key stored server-side only
- Input validation on backend

### Production Recommendations
1. Add authentication (JWT)
2. Rate limiting on API endpoints
3. Input sanitization
4. HTTPS only
5. Restricted CORS origins
6. MongoDB user permissions
7. API key rotation
8. Request logging and monitoring

## Performance Optimizations

### Frontend
- Component lazy loading potential
- Memoization for expensive calculations
- Virtual scrolling for large post lists
- Debounced search/filter operations

### Backend
- MongoDB indexing on query fields
- Pagination for large datasets
- Response caching for analytics
- Connection pooling

### Database
- Compound indexes on (status, publishedTime)
- Aggregation pipeline optimization
- Limit result sets

## Scalability Considerations

### Current Limitations
- Single server architecture
- No caching layer
- Limited to single MongoDB instance

### Future Enhancements
- Load balancer for backend
- Redis caching layer
- MongoDB replica set
- CDN for frontend assets
- Microservices architecture
- Queue system for AI processing
- Horizontal scaling

## Error Handling

### Frontend
- Try-catch blocks for API calls
- User-friendly error messages
- Fallback UI states
- Network error recovery

### Backend
- Global error handler middleware
- Validation error responses
- Database error handling
- External API failure handling
- Logging system

## Testing Strategy

### Recommended Tests

**Frontend**
- Component rendering tests
- User interaction tests
- API integration tests
- Accessibility tests

**Backend**
- Unit tests for controllers
- Integration tests for routes
- Database operation tests
- API mocking for AI calls

**End-to-End**
- User flow tests
- Cross-browser testing
- Mobile responsiveness
- Performance testing

## Deployment Architecture

### Recommended Setup

**Frontend**: Vercel/Netlify
- Static hosting
- CDN distribution
- Auto-scaling
- SSL included

**Backend**: Heroku/DigitalOcean/AWS
- Node.js runtime
- Environment variables
- Auto-restart on crash
- Monitoring and logging

**Database**: MongoDB Atlas
- Managed MongoDB
- Automatic backups
- Scalable clusters
- Security features

**CI/CD**: GitHub Actions
- Automated testing
- Build verification
- Deployment automation

## Monitoring and Logging

### Recommended Tools
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Usage analytics
- API rate monitoring
- Database performance metrics

## Cost Estimation

### Development/Testing
- MongoDB Atlas: Free (M0 tier)
- OpenAI API: ~$0.002 per request
- Hosting: Free tier available

### Production (estimated monthly)
- MongoDB Atlas: $0-57 (M0-M10)
- OpenAI API: Variable based on usage
- Backend hosting: $7-50
- Frontend hosting: $0-20
- Total: ~$10-150/month

## Future Architecture Improvements

1. **Microservices**
   - Separate AI service
   - Analytics service
   - Notification service

2. **Event-Driven**
   - Message queue (RabbitMQ/Redis)
   - Async processing
   - Webhook support

3. **Caching Layer**
   - Redis for session data
   - API response caching
   - Analytics caching

4. **Real-time Features**
   - WebSocket for live updates
   - Collaborative editing
   - Real-time analytics

5. **Advanced AI**
   - Content quality scoring
   - Sentiment analysis
   - Topic clustering
   - Competitor analysis
