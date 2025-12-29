const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/content-scheduler';

// Sample posts with realistic engagement data
const samplePosts = [
  {
    title: "10 Tips for Effective Remote Work",
    content: "Working remotely has become the new normal for many professionals. Here are 10 essential tips to help you stay productive and maintain work-life balance while working from home...",
    publishedTime: new Date('2024-01-15T09:00:00'),
    status: 'published',
    category: 'productivity',
    tags: ['remote-work', 'productivity', 'tips'],
    engagementMetrics: {
      views: 1500,
      likes: 145,
      shares: 23,
      comments: 18
    }
  },
  {
    title: "The Future of AI in Content Creation",
    content: "Artificial Intelligence is revolutionizing the way we create and consume content. From automated writing assistants to AI-generated images, the landscape is changing rapidly...",
    publishedTime: new Date('2024-01-17T14:00:00'),
    status: 'published',
    category: 'technology',
    tags: ['ai', 'content-creation', 'future'],
    engagementMetrics: {
      views: 2300,
      likes: 234,
      shares: 45,
      comments: 31
    }
  },
  {
    title: "5 Marketing Strategies That Actually Work",
    content: "In today's crowded digital landscape, standing out requires more than just good content. Here are five proven marketing strategies that deliver real results...",
    publishedTime: new Date('2024-01-19T10:30:00'),
    status: 'published',
    category: 'marketing',
    tags: ['marketing', 'strategy', 'business'],
    engagementMetrics: {
      views: 1800,
      likes: 167,
      shares: 34,
      comments: 22
    }
  },
  {
    title: "Building Scalable Web Applications",
    content: "Learn the principles and best practices for building web applications that can handle growth. We'll cover architecture patterns, database optimization, and more...",
    publishedTime: new Date('2024-01-22T15:00:00'),
    status: 'published',
    category: 'development',
    tags: ['web-development', 'scalability', 'architecture'],
    engagementMetrics: {
      views: 1200,
      likes: 98,
      shares: 19,
      comments: 14
    }
  },
  {
    title: "Social Media Trends to Watch in 2024",
    content: "The social media landscape is constantly evolving. Here are the key trends that will shape how brands and creators engage with their audiences this year...",
    publishedTime: new Date('2024-01-24T11:00:00'),
    status: 'published',
    category: 'social-media',
    tags: ['social-media', 'trends', '2024'],
    engagementMetrics: {
      views: 2800,
      likes: 312,
      shares: 67,
      comments: 43
    }
  },
  {
    title: "Understanding React Hooks: A Complete Guide",
    content: "React Hooks have transformed how we write React applications. This comprehensive guide covers useState, useEffect, and custom hooks with practical examples...",
    publishedTime: new Date('2024-01-26T09:30:00'),
    status: 'published',
    category: 'development',
    tags: ['react', 'javascript', 'tutorial'],
    engagementMetrics: {
      views: 3200,
      likes: 389,
      shares: 78,
      comments: 56
    }
  },
  {
    title: "Data Privacy in the Digital Age",
    content: "As our lives become increasingly digital, protecting personal data has never been more important. Learn about the latest privacy concerns and how to protect yourself...",
    publishedTime: new Date('2024-01-29T13:00:00'),
    status: 'published',
    category: 'security',
    tags: ['privacy', 'security', 'data-protection'],
    engagementMetrics: {
      views: 1950,
      likes: 201,
      shares: 41,
      comments: 28
    }
  },
  {
    title: "Mastering Time Management for Entrepreneurs",
    content: "Time is the most valuable resource for entrepreneurs. Discover proven techniques to maximize productivity, prioritize tasks, and achieve your business goals...",
    publishedTime: new Date('2024-02-01T08:00:00'),
    status: 'published',
    category: 'business',
    tags: ['time-management', 'entrepreneurship', 'productivity'],
    engagementMetrics: {
      views: 2100,
      likes: 223,
      shares: 48,
      comments: 35
    }
  },
  {
    title: "The Rise of Sustainable Tech",
    content: "Technology companies are increasingly focusing on sustainability. From green data centers to eco-friendly devices, here's how the industry is evolving...",
    publishedTime: new Date('2024-02-03T16:00:00'),
    status: 'published',
    category: 'technology',
    tags: ['sustainability', 'green-tech', 'environment'],
    engagementMetrics: {
      views: 1670,
      likes: 154,
      shares: 29,
      comments: 21
    }
  },
  {
    title: "Creating Engaging Video Content",
    content: "Video content dominates social media engagement. Learn the essential techniques for creating videos that capture attention and drive engagement...",
    publishedTime: new Date('2024-02-05T12:00:00'),
    status: 'published',
    category: 'content-creation',
    tags: ['video', 'content', 'engagement'],
    engagementMetrics: {
      views: 2650,
      likes: 287,
      shares: 59,
      comments: 41
    }
  },
  {
    title: "SEO Best Practices for 2024",
    content: "Search engine optimization continues to evolve. Stay ahead of the curve with these updated SEO strategies that work in today's competitive landscape...",
    publishedTime: new Date('2024-02-07T10:00:00'),
    status: 'published',
    category: 'seo',
    tags: ['seo', 'search-optimization', 'digital-marketing'],
    engagementMetrics: {
      views: 2450,
      likes: 267,
      shares: 52,
      comments: 38
    }
  },
  {
    title: "The Power of Email Marketing",
    content: "Despite new marketing channels, email remains one of the most effective tools for reaching customers. Learn how to craft compelling email campaigns...",
    publishedTime: new Date('2024-02-09T14:30:00'),
    status: 'published',
    category: 'marketing',
    tags: ['email-marketing', 'campaigns', 'conversion'],
    engagementMetrics: {
      views: 1890,
      likes: 178,
      shares: 36,
      comments: 24
    }
  },
  {
    title: "Building a Personal Brand Online",
    content: "Your personal brand is your professional reputation in the digital world. Here's a step-by-step guide to building and maintaining a strong online presence...",
    publishedTime: new Date('2024-02-12T09:00:00'),
    status: 'published',
    category: 'personal-development',
    tags: ['personal-brand', 'career', 'online-presence'],
    engagementMetrics: {
      views: 3100,
      likes: 345,
      shares: 71,
      comments: 49
    }
  },
  {
    title: "Cybersecurity Essentials for Small Businesses",
    content: "Small businesses are increasingly targeted by cyber attacks. Protect your company with these essential cybersecurity measures and best practices...",
    publishedTime: new Date('2024-02-14T11:30:00'),
    status: 'published',
    category: 'security',
    tags: ['cybersecurity', 'small-business', 'protection'],
    engagementMetrics: {
      views: 1730,
      likes: 162,
      shares: 31,
      comments: 19
    }
  },
  {
    title: "The Art of Storytelling in Marketing",
    content: "Great marketing tells a story. Learn how to craft compelling narratives that resonate with your audience and drive meaningful engagement...",
    publishedTime: new Date('2024-02-16T13:00:00'),
    status: 'published',
    category: 'marketing',
    tags: ['storytelling', 'marketing', 'content-strategy'],
    engagementMetrics: {
      views: 2230,
      likes: 241,
      shares: 49,
      comments: 33
    }
  },
  // Draft posts
  {
    title: "Upcoming: Cloud Computing Trends",
    content: "Exploring the latest trends in cloud computing including serverless architecture, edge computing, and multi-cloud strategies...",
    status: 'draft',
    category: 'technology',
    tags: ['cloud', 'computing', 'trends']
  },
  {
    title: "Draft: Mobile App Development Guide",
    content: "A comprehensive guide to building modern mobile applications with React Native and Flutter...",
    status: 'draft',
    category: 'development',
    tags: ['mobile', 'app-development', 'react-native']
  },
  // Scheduled posts
  {
    title: "Scheduled: Digital Transformation in Healthcare",
    content: "How digital technologies are revolutionizing healthcare delivery and patient outcomes...",
    scheduledTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    status: 'scheduled',
    category: 'healthcare',
    tags: ['digital-transformation', 'healthcare', 'technology']
  },
  {
    title: "Scheduled: The Future of E-commerce",
    content: "Emerging trends and technologies shaping the future of online retail and customer experience...",
    scheduledTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    status: 'scheduled',
    category: 'e-commerce',
    tags: ['e-commerce', 'retail', 'trends']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Insert sample posts
    await Post.insertMany(samplePosts);
    console.log(`Inserted ${samplePosts.length} sample posts`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
