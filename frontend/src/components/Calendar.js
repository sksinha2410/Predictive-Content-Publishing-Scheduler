import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { postService } from '../services/api';
import './Calendar.css';

const Calendar = ({ posts, onEventDrop, onDateSelect, onEventClick }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const calendarEvents = posts.map(post => ({
      id: post._id,
      title: post.title,
      start: post.scheduledTime || post.publishedTime,
      backgroundColor: post.status === 'published' ? '#4caf50' : post.status === 'scheduled' ? '#2196f3' : '#ff9800',
      borderColor: post.status === 'published' ? '#4caf50' : post.status === 'scheduled' ? '#2196f3' : '#ff9800',
      extendedProps: {
        ...post
      }
    }));
    setEvents(calendarEvents);
  }, [posts]);

  const handleEventDrop = async (info) => {
    const updatedPost = {
      scheduledTime: info.event.start,
      status: 'scheduled'
    };
    
    try {
      await postService.updatePost(info.event.id, updatedPost);
      if (onEventDrop) {
        onEventDrop(info.event.id, updatedPost);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      info.revert();
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        dateClick={onDateSelect}
        eventClick={onEventClick}
        height="auto"
      />
    </div>
  );
};

export default Calendar;
