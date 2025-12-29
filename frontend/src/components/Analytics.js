import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Analytics.css';

const Analytics = ({ posts }) => {
  // Calculate engagement by hour
  const engagementByHour = posts
    .filter(p => p.status === 'published' && p.publishedTime)
    .reduce((acc, post) => {
      const hour = new Date(post.publishedTime).getHours();
      if (!acc[hour]) {
        acc[hour] = { hour: `${hour}:00`, views: 0, engagement: 0, count: 0 };
      }
      acc[hour].views += post.engagementMetrics.views;
      acc[hour].engagement += post.engagementMetrics.engagementRate || 0;
      acc[hour].count += 1;
      return acc;
    }, {});

  const hourlyData = Object.values(engagementByHour)
    .map(data => ({
      hour: data.hour,
      avgViews: Math.round(data.views / data.count),
      avgEngagement: (data.engagement / data.count).toFixed(2)
    }))
    .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  // Calculate engagement by day of week
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const engagementByDay = posts
    .filter(p => p.status === 'published' && p.publishedTime)
    .reduce((acc, post) => {
      const day = new Date(post.publishedTime).getDay();
      if (!acc[day]) {
        acc[day] = { day: dayNames[day], views: 0, engagement: 0, count: 0 };
      }
      acc[day].views += post.engagementMetrics.views;
      acc[day].engagement += post.engagementMetrics.engagementRate || 0;
      acc[day].count += 1;
      return acc;
    }, {});

  const dailyData = Object.values(engagementByDay)
    .map(data => ({
      day: data.day,
      avgViews: Math.round(data.views / data.count),
      avgEngagement: (data.engagement / data.count).toFixed(2)
    }));

  // Calculate overall stats
  const publishedPosts = posts.filter(p => p.status === 'published');
  const totalViews = publishedPosts.reduce((sum, p) => sum + p.engagementMetrics.views, 0);
  const totalLikes = publishedPosts.reduce((sum, p) => sum + p.engagementMetrics.likes, 0);
  const totalShares = publishedPosts.reduce((sum, p) => sum + p.engagementMetrics.shares, 0);
  const avgEngagement = publishedPosts.length > 0
    ? (publishedPosts.reduce((sum, p) => sum + (p.engagementMetrics.engagementRate || 0), 0) / publishedPosts.length).toFixed(2)
    : 0;

  return (
    <div className="analytics-container">
      <h2>Engagement Analytics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Views</h3>
          <p className="stat-value">{totalViews.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Total Likes</h3>
          <p className="stat-value">{totalLikes.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Total Shares</h3>
          <p className="stat-value">{totalShares.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Engagement</h3>
          <p className="stat-value">{avgEngagement}%</p>
        </div>
      </div>

      {hourlyData.length > 0 && (
        <div className="chart-section">
          <h3>Engagement by Hour of Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="avgViews" stroke="#8884d8" name="Avg Views" />
              <Line yAxisId="right" type="monotone" dataKey="avgEngagement" stroke="#82ca9d" name="Avg Engagement %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {dailyData.length > 0 && (
        <div className="chart-section">
          <h3>Engagement by Day of Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="avgViews" fill="#8884d8" name="Avg Views" />
              <Bar yAxisId="right" dataKey="avgEngagement" fill="#82ca9d" name="Avg Engagement %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Analytics;
