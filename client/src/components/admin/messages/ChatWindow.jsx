import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import './ChatWindow.css';

export default function ChatWindow({ conversation, messages, onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  };

  if (!conversation) {
    return (
      <div className="chat-window">
        <div className="no-conversation">
          <div className="no-conversation-icon">💬</div>
          <h3>Select a conversation</h3>
          <p>Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-avatar">
            <div className="avatar-circle">
              {getInitials(conversation.userName)}
            </div>
            {conversation.isOnline && <div className="online-indicator"></div>}
          </div>
          <div className="user-details">
            <div className="user-name">
              {conversation.userName} <span className="ticket-id">{conversation.ticketId}</span>
            </div>
            <div className="user-status">
              {conversation.isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
        
        <div className="chat-actions">
          <button 
            className="menu-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {showMenu && (
            <div className="dropdown-menu">
              <button className="menu-item">View Profile</button>
              <button className="menu-item">Block User</button>
              <button className="menu-item danger">Delete Chat</button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input-area">
        <form onSubmit={handleSendMessage} className="message-form">
          <div className="input-container">
            <input
              type="text"
              placeholder="Type something..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="message-input"
            />
            <div className="input-actions">
              <button type="button" className="action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1C12 1 12 1 12 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button type="button" className="action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21.44 11.05L12.25 1.86C11.86 1.47 11.23 1.47 10.84 1.86L1.65 11.05C1.26 11.44 1.26 12.07 1.65 12.46L10.84 21.65C11.23 22.04 11.86 22.04 12.25 21.65L21.44 12.46C21.83 12.07 21.83 11.44 21.44 11.05Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 7H13V13H11V7Z" fill="currentColor"/>
                  <path d="M11 15H13V17H11V15Z" fill="currentColor"/>
                </svg>
              </button>
              <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}