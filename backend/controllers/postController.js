const Post = require('../models/Post');
const { Parser } = require('json2csv');

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create post
exports.createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get engagement analytics
exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await Post.aggregate([
      {
        $match: { status: 'published' }
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$publishedTime' },
            dayOfWeek: { $dayOfWeek: '$publishedTime' }
          },
          avgViews: { $avg: '$engagementMetrics.views' },
          avgLikes: { $avg: '$engagementMetrics.likes' },
          avgShares: { $avg: '$engagementMetrics.shares' },
          avgComments: { $avg: '$engagementMetrics.comments' },
          avgEngagementRate: { $avg: '$engagementMetrics.engagementRate' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { avgEngagementRate: -1 }
      }
    ]);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export posts to CSV
exports.exportToCSV = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'scheduled' }).lean();
    
    if (posts.length === 0) {
      return res.status(404).json({ error: 'No scheduled posts to export' });
    }

    const fields = [
      'title',
      'content',
      'scheduledTime',
      'status',
      'category',
      'tags'
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(posts);

    res.header('Content-Type', 'text/csv');
    res.attachment('scheduled-posts.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
