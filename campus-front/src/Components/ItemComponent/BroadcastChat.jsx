import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBroadcastMessages, sendBroadcastMessage, getActiveUsers } from '../../Services/ChatService';
import './Chat.css';

const BroadcastChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const currentUser = localStorage.getItem('username') || sessionStorage.getItem('currentUser');

  useEffect(() => {
    loadMessages();
    loadActiveUsers();
    const interval = setInterval(() => {
      loadMessages();
      loadActiveUsers();
    }, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await getBroadcastMessages();
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveUsers = async () => {
    try {
      const response = await getActiveUsers();
      setActiveUsers(response.data || []);
    } catch (error) {
      console.error('Error loading active users:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        senderUsername: currentUser,
        content: newMessage,
        timestamp: new Date().toISOString()
      };
      
      setNewMessage('');
      await sendBroadcastMessage(messageData);
      loadMessages(); // Reload messages after sending
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="loading">Loading chat...</div>;

  return (
    <div className="chat">
      <div className="chat-header">
        <button onClick={() => navigate('/StudentMenu')} className="back-btn">← Back</button>
        <h3>Campus Chat - Everyone</h3>
        <p>Public chat for all students</p>
      </div>
      
      <div className="chat-body">
        <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.senderUsername === currentUser ? 'own-message' : 'other-message'}`}
            >
              <div className="message-header">
                <span className="sender-name">{message.senderUsername}</span>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="message-content">{message.content}</div>
            </div>
          ))
        )}
          <div ref={messagesEndRef} />
        </div>

        <div className="active-users-sidebar">
          <h4>Active Users ({activeUsers.length})</h4>
          <div className="users-list">
            {activeUsers.map((user, index) => (
              <div key={index} className={`user-item ${user === currentUser ? 'current-user' : ''}`}>
                <span className="user-status">●</span>
                <span className="user-name">{user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message to everyone..."
          className="message-input"
          maxLength={500}
        />
        <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default BroadcastChat;