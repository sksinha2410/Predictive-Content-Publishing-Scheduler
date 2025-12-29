# 📅 Predictive Content Publishing Scheduler

An AI-powered content publishing scheduler that analyzes historical engagement data and recommends optimal publishing times and catchy headlines using OpenAI.

## 🚀 Features

- **AI-Powered Recommendations**: Uses OpenAI to analyze engagement patterns and predict best publishing times
- **Smart Headline Generation**: AI-generated catchy headlines based on content analysis
- **Interactive Calendar**: Drag-and-drop scheduling interface using FullCalendar.io
- **Engagement Analytics**: Visual analytics showing engagement metrics by time and day
- **Historical Post Management**: Track and manage all posts with their engagement metrics
- **CSV Export**: Export scheduled posts for external use
- **Real-time Dashboard**: Monitor posts, metrics, and schedule at a glance

## 🛠️ Technologies Used

### Backend
- **Node.js** & **Express.js**: RESTful API server
- **MongoDB** with **Mongoose**: Data persistence and aggregation pipelines
- **OpenAI API**: AI-powered content analysis and recommendations
- **json2csv**: CSV export functionality

### Frontend
- **React.js**: Modern UI framework
- **FullCalendar.io**: Interactive calendar with drag-and-drop
- **Recharts**: Engagement analytics visualization
- **Axios**: HTTP client for API communication

## 📁 Project Structure

```
Predictive-Content-Publishing-Scheduler/
├── backend/
│   ├── controllers/
│   │   ├── postController.js    # Post CRUD operations
│   │   └── aiController.js      # AI recommendations
│   ├── models/
│   │   └── Post.js              # MongoDB schema
│   ├── routes/
│   │   ├── posts.js             # Post routes
│   │   └── ai.js                # AI routes
│   ├── server.js                # Express server
│   ├── seed.js                  # Sample data seeder
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Calendar.js      # Calendar component
│   │   │   ├── PostList.js      # Post list component
│   │   │   ├── PostEditor.js    # Post editor with AI
│   │   │   ├── Analytics.js     # Analytics dashboard
│   │   │   └── AIRecommendations.js  # AI insights
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.js               # Main application
│   │   └── index.js             # Entry point
│   └── package.json
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/content-scheduler
OPENAI_API_KEY=your_openai_api_key_here
```

5. Seed the database with sample data:
```bash
node seed.js
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📊 Sample Dataset

The application includes a sample dataset with:
- **15 published posts** with realistic engagement metrics
- **2 draft posts** for testing
- **2 scheduled posts** for future publishing
- Engagement data spread across different times and days
- Various categories (technology, marketing, development, etc.)

To load the sample data:
```bash
cd backend
node seed.js
```

## 🎯 Usage Guide

### Dashboard View
1. View all posts in the calendar
2. See recent posts in the sidebar
3. Click on any post to edit or view details

### Creating a New Post
1. Click "+ New Post" button
2. Enter title and content
3. Click "🤖 Generate AI Headlines" for suggestions
4. Select from AI-generated headlines
5. Set category, tags, and scheduled time
6. Save the post

### AI Recommendations
1. Navigate to "AI Recommendations" tab
2. View best publishing times based on historical data
3. See confidence levels and insights
4. Use recommendations when scheduling posts

### Analytics
1. Navigate to "Analytics" tab
2. View engagement metrics by hour and day
3. Analyze patterns to optimize posting strategy

### Scheduling Posts
1. Drag and drop posts on the calendar
2. Posts automatically update to "scheduled" status
3. Export scheduled posts as CSV for external tools

### CSV Export
1. Click "📥 Export Scheduled Posts"
2. Download CSV file with all scheduled posts
3. Use with publishing platforms or tools

## 🔌 API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/analytics` - Get engagement analytics
- `GET /api/posts/export` - Export scheduled posts as CSV

### AI
- `GET /api/ai/predict-times` - Get AI-predicted best publishing times
- `POST /api/ai/generate-headlines` - Generate AI headlines for content
- `GET /api/ai/analyze/:postId` - Get comprehensive AI analysis

## 🤖 AI Features

### Best Time Prediction
The AI analyzes:
- Historical engagement rates
- Publishing times (hour of day)
- Day of week patterns
- View and interaction metrics

Returns top 3 recommended times with confidence levels.

### Headline Generation
The AI generates:
- 5 catchy, engaging headlines
- Optimized for social media
- Based on content analysis
- Uses power words and emotional triggers

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile
- **Drag-and-Drop**: Intuitive post scheduling
- **Real-time Updates**: Changes reflect immediately
- **Visual Analytics**: Charts and graphs for insights
- **Color-Coded Status**: Easy identification of post states
- **Interactive Calendar**: Multiple views (month, week, day)

## 🔒 Security Notes

### Implemented Security Features
- ✅ Rate limiting on all API endpoints (100 requests/15 min)
- ✅ Stricter rate limiting on AI endpoints (20 requests/hour)
- ✅ Environment variables for sensitive data
- ✅ MongoDB schema validation
- ✅ Error handling without exposing sensitive details
- ✅ Git security (.gitignore for secrets)

### Production Recommendations
- Never commit `.env` files with real API keys
- Use environment variables for sensitive data
- Keep your OpenAI API key secure
- Implement authentication for production use
- Enable HTTPS/SSL
- Configure CORS for specific origins
- Add input sanitization
- Set up monitoring and logging

See [SECURITY.md](SECURITY.md) for detailed security documentation.

## 🚀 Deployment

### Backend
- Deploy to services like Heroku, DigitalOcean, or AWS
- Use MongoDB Atlas for cloud database
- Set environment variables in hosting platform

### Frontend
- Deploy to Vercel, Netlify, or GitHub Pages
- Update `REACT_APP_API_URL` to production backend URL
- Run `npm run build` for production build

## 📝 Future Enhancements

- User authentication and authorization
- Social media integration (Twitter, LinkedIn, Facebook)
- Email notifications for scheduled posts
- A/B testing for headlines
- More detailed analytics and reporting
- Multi-user support with team collaboration
- Post templates and content library
- Integration with CMS platforms

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 👥 Author

Built with ❤️ for content creators and marketers

## 🙏 Acknowledgments

- OpenAI for powerful AI capabilities
- FullCalendar.io for excellent calendar component
- Recharts for beautiful analytics visualizations