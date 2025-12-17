import React, { useState } from 'react';
import './ConversationList.css';

export default function ConversationList({ conversations, activeConversation, onConversationSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="conversation-list">
      <div className="conversation-header">
        <h2>Messages</h2>
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="conversations-list">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation-item ${activeConversation?.id === conversation.id ? 'active' : ''}`}
            onClick={() => onConversationSelect(conversation)}
          >
            <div className="conversation-avatar">
              <div className="avatar-circle">
                {getInitials(conversation.userName)}
              </div>
              {conversation.isOnline && <div className="online-indicator"></div>}
            </div>
            
            <div className="conversation-content">
              <div className="conversation-header-info">
                <div className="user-name">
                  {conversation.userName} <span className="ticket-id">{conversation.ticketId}</span>
                </div>
                <div className="timestamp">{formatTime(conversation.timestamp)}</div>
              </div>
              <div className="last-message">
                {conversation.lastMessage}
              </div>
            </div>
            
            {conversation.unreadCount > 0 && (
              <div className="unread-badge">{conversation.unreadCount}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}