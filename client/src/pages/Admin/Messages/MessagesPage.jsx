import React, { useState, useEffect } from 'react';
import ConversationList from '../../../components/admin/messages/ConversationList';
import ChatWindow from '../../../components/admin/messages/ChatWindow';
import messagesData from '../../../mock/messages.json';
import './MessagesPage.css';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setConversations(messagesData.conversations);
        setMessages(messagesData.messages);
        setActiveConversation(messagesData.conversations[0]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation);
  };

  const handleSendMessage = (messageText) => {
    if (!activeConversation || !messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      senderId: 'admin_001',
      senderType: 'admin',
      message: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => ({
      ...prev,
      [activeConversation.id]: [
        ...(prev[activeConversation.id] || []),
        newMessage
      ]
    }));

    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversation.id 
          ? { ...conv, lastMessage: messageText, timestamp: new Date().toISOString() }
          : conv
      )
    );
  };

  if (loading) {
    return (
      <div className="messages-page-loading">
        <div className="loading-spinner">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <ConversationList
          conversations={conversations}
          activeConversation={activeConversation}
          onConversationSelect={handleConversationSelect}
        />
        <ChatWindow
          conversation={activeConversation}
          messages={messages[activeConversation?.id] || []}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}