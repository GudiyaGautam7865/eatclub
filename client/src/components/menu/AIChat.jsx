import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { getAIRecommendations } from '../../services/geminiService';
import './AIChat.css';

export const AIChat = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! Not sure what to eat? Tell me your mood (e.g., "Spicy and cheap" or "Healthy dinner") and I will help!' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await getAIRecommendations(userMsg, menuItems);

    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="ai-chat-trigger"
        >
          <Sparkles size={24} fill="currentColor" />
          <span className="font-bold pr-1">Ask AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-container">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <Sparkles size={18} fill="currentColor" />
              <h3>EatClub Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="ai-chat-close-btn">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-chat-message ${msg.role === 'user' ? 'user' : 'model'}`}>
                <div 
                  className={`ai-chat-bubble ${msg.role === 'user' ? 'user' : 'model'}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="ai-chat-message model">
                <div className="ai-chat-typing">
                  <div className="ai-chat-dot"></div>
                  <div className="ai-chat-dot"></div>
                  <div className="ai-chat-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-chat-input-wrapper">
            <div className="ai-chat-input-container">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="What are you craving?"
                className="ai-chat-input"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="ai-chat-send-btn"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};