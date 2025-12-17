import React from 'react';
import './MessageBubble.css';

export default function MessageBubble({ message }) {
  const isAdmin = message.senderType === 'admin';
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-bubble ${isAdmin ? 'admin' : 'user'}`}>
      <div className="message-content">
        {message.message}
      </div>
      <div className="message-time">
        {formatTime(message.timestamp)}
      </div>
    </div>
  );
}