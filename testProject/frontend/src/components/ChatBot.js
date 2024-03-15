import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Table } from 'antd';
import axiosWithAuth from '../axiosWithAuth'; // Import axiosWithAuth instance
import './ChatBot.css'; // Import CSS for styling
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  useEffect(() => {
    const scrollToBottom = () => {
      const chatWindow = document.getElementById('chat-window');
      chatWindow.scrollTop = chatWindow.scrollHeight;
    };
    scrollToBottom();
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    // Fetch tasks using axiosWithAuth
    axiosWithAuth.get('tasks/')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosWithAuth.post('/chatbot/', { user_input: userInput });
      const newChat = [...chatHistory, { role: 'user', content: userInput }, { role: 'bot', content: response.data.chatbot_reply }];
      setChatHistory(newChat);
      setUserInput('');
      setLoading(false);
      // Fetch tasks again after submitting the form
      fetchTasks();
    } catch (error) {
      console.error('Error fetching chatbot reply:', error);
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard'); // Navigate to the dashboard page
  };

  const columns = [
    {
      title: 'Task ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Task Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Due Date',
      dataIndex: 'duedate',
      key: 'duedate',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
    },
  ];

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>TodoGPT</h1>
      </div>
      <div id="chat-window" className="chat-window">
        {chatHistory.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {loading && <div className="loading">...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="input-box"
          placeholder="Type your message here..."
          required
        />
        <button type="submit" className="send-button">Send</button>
      </form>
      
      {/* Table to display tasks */}
      <div>
        <h2>Task List</h2>
        <Table columns={columns} dataSource={tasks} />
        <Button type="button" onClick={handleBackToDashboard}>Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default Chatbot;
