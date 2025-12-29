import React, { useState, useEffect } from 'react';
import { aiService } from '../services/api';
import './AIRecommendations.css';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await aiService.predictBestTimes();
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      alert('Failed to fetch AI recommendations. Make sure the backend server is running with OpenAI API key configured.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const getDayName = (dayOfWeek) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  return (
    <div className="ai-recommendations-container">
      <div className="recommendations-header">
        <h2>🤖 AI-Powered Recommendations</h2>
        <button onClick={fetchRecommendations} disabled={loading} className="refresh-btn">
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {loading && !recommendations ? (
        <div className="loading">Analyzing engagement patterns...</div>
      ) : recommendations ? (
        <div className="recommendations-content">
          <div className="confidence-badge" data-confidence={recommendations.confidence}>
            Confidence: {recommendations.confidence}
          </div>

          {recommendations.message && (
            <div className="info-message">{recommendations.message}</div>
          )}

          {recommendations.insights && (
            <div className="insights-box">
              <h3>📊 Insights</h3>
              <p>{recommendations.insights}</p>
            </div>
          )}

          <div className="recommended-times">
            <h3>⏰ Best Times to Publish</h3>
            <div className="times-grid">
              {recommendations.recommendedTimes?.map((time, index) => (
                <div key={index} className="time-card">
                  <div className="time-rank">#{index + 1}</div>
                  <div className="time-details">
                    <div className="time-day">
                      {typeof time.dayOfWeek === 'number' 
                        ? getDayName(time.dayOfWeek) 
                        : time.dayOfWeek}
                    </div>
                    <div className="time-hour">
                      {typeof time.hour === 'number' 
                        ? `${time.hour}:00` 
                        : time.time}
                    </div>
                  </div>
                  {time.reason && (
                    <div className="time-reason">{time.reason}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data">No recommendations available</div>
      )}
    </div>
  );
};

export default AIRecommendations;
