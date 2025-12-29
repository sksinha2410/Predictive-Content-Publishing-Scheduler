const OpenAI = require('openai');
const Post = require('../models/Post');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Analyze engagement patterns and predict best times
exports.predictBestTimes = async (req, res) => {
  try {
    // Get historical posts with engagement data
    const posts = await Post.find({ 
      status: 'published',
      publishedTime: { $exists: true }
    }).lean();

    if (posts.length < 5) {
      return res.json({
        recommendedTimes: [
          { time: '09:00', dayOfWeek: 2, reason: 'Default recommendation: Monday 9 AM' },
          { time: '14:00', dayOfWeek: 4, reason: 'Default recommendation: Wednesday 2 PM' },
          { time: '17:00', dayOfWeek: 6, reason: 'Default recommendation: Friday 5 PM' }
        ],
        confidence: 'low',
        message: 'Not enough historical data. Using default recommendations.'
      });
    }

    // Prepare data for AI analysis
    const engagementData = posts.map(post => {
      const publishedTime = new Date(post.publishedTime);
      return {
        hour: publishedTime.getHours(),
        dayOfWeek: publishedTime.getDay(),
        engagementRate: post.engagementMetrics.engagementRate,
        views: post.engagementMetrics.views,
        likes: post.engagementMetrics.likes,
        shares: post.engagementMetrics.shares
      };
    });

    const prompt = `Analyze the following engagement data from published posts and recommend the top 3 best times to publish content:

${JSON.stringify(engagementData, null, 2)}

Consider:
1. Time of day (hour) when engagement is highest
2. Day of week when engagement is highest
3. Engagement rate patterns

Respond in JSON format with this structure:
{
  "recommendedTimes": [
    { "hour": 9, "dayOfWeek": 1, "reason": "explanation" },
    { "hour": 14, "dayOfWeek": 3, "reason": "explanation" },
    { "hour": 17, "dayOfWeek": 5, "reason": "explanation" }
  ],
  "confidence": "high/medium/low",
  "insights": "overall analysis summary"
}

DayOfWeek: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert data analyst specializing in content engagement patterns." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    res.json(aiResponse);
  } catch (error) {
    console.error('AI prediction error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Generate catchy headlines using AI
exports.generateHeadlines = async (req, res) => {
  try {
    const { content, category, currentTitle } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const prompt = `Given the following blog post content, generate 5 catchy and engaging headlines that would maximize reader engagement.

Content: ${content.substring(0, 500)}...
${category ? `Category: ${category}` : ''}
${currentTitle ? `Current title: ${currentTitle}` : ''}

Requirements:
- Make headlines attention-grabbing and click-worthy
- Keep them between 40-60 characters
- Use power words and emotional triggers
- Make them specific and valuable
- Optimize for social media sharing

Return response in JSON format:
{
  "headlines": ["headline 1", "headline 2", "headline 3", "headline 4", "headline 5"],
  "explanation": "brief explanation of the strategy used"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert copywriter specializing in viral headlines and content marketing." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    res.json(aiResponse);
  } catch (error) {
    console.error('AI headline generation error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Analyze content and provide comprehensive suggestions
exports.analyzeSuggestions = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get best times
    const bestTimesResponse = await this.predictBestTimes({ }, { 
      json: (data) => data 
    });

    // Generate headlines
    const headlinesResponse = await this.generateHeadlines({ 
      body: { 
        content: post.content, 
        category: post.category,
        currentTitle: post.title 
      } 
    }, { 
      json: (data) => data,
      status: () => ({ json: (data) => data })
    });

    // Update post with AI suggestions
    post.aiSuggestions = {
      recommendedTime: bestTimesResponse.recommendedTimes?.[0] || null,
      recommendedHeadlines: headlinesResponse.headlines || [],
      confidence: bestTimesResponse.confidence || 'low'
    };

    await post.save();

    res.json({
      bestTimes: bestTimesResponse,
      headlines: headlinesResponse,
      post: post
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ error: error.message });
  }
};
