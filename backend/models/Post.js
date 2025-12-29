const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  scheduledTime: {
    type: Date,
    default: null,
  },
  publishedTime: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published'],
    default: 'draft',
  },
  engagementMetrics: {
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    engagementRate: {
      type: Number,
      default: 0,
    },
  },
  aiSuggestions: {
    recommendedTime: Date,
    recommendedHeadlines: [String],
    confidence: Number,
  },
  category: {
    type: String,
    default: 'general',
  },
  tags: [String],
}, {
  timestamps: true,
});

// Calculate engagement rate before saving
PostSchema.pre('save', function(next) {
  if (this.engagementMetrics.views > 0) {
    const totalEngagement = 
      this.engagementMetrics.likes + 
      this.engagementMetrics.shares + 
      this.engagementMetrics.comments;
    this.engagementMetrics.engagementRate = 
      (totalEngagement / this.engagementMetrics.views) * 100;
  }
  next();
});

module.exports = mongoose.model('Post', PostSchema);
