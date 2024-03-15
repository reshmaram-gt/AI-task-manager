import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../axiosWithAuth';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  useEffect(() => {
    axiosWithAuth.get('tasks/')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
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

  const handleNavigateToDashboard = () => {
    navigate('/dashboard'); // Navigate to the dashboard page
  };

  return (
    <div>
      <h2>Task List</h2>
      <Button type="primary" onClick={handleNavigateToDashboard}>Go to Dashboard</Button> {/* Button to navigate to dashboard */}
      <Table dataSource={tasks} columns={columns} rowKey="id" />
    </div>
  );
};

export default TaskList;
