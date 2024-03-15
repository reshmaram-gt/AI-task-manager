import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../axiosWithAuth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { Table } from 'antd';

const DeleteTask = () => {
  const [deleteId, setDeleteId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    fetchTaskList();
  }, []);

  const fetchTaskList = () => {
    axiosWithAuth.get('tasks/')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };

  const handleChange = (e) => {
    setDeleteId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosWithAuth.delete(`tasks/${deleteId}/`)
      .then(response => {
        console.log('Task deleted successfully:', response.data);
        setSuccessMessage('Task deleted successfully');
        setErrorMessage('');
        fetchTaskList(); // Refresh task list after deletion
      })
      .catch(error => {
        console.error('Task deletion failed:', error);
        if (error.response) {
          setErrorMessage(`Task deletion failed: ${error.response.data.message}`);
        } else {
          setErrorMessage('Task deletion failed. Please try again.');
        }
        setSuccessMessage('');
      });
  };

  const handleNavigate = () => {
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
    <div>
      <h2>Delete Task</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="taskId" value={deleteId} onChange={handleChange} placeholder="Enter Task ID" required />
        <button type="submit">Delete Task</button>
      </form>
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {/* Button to navigate back to the dashboard */}
      <button onClick={handleNavigate}>Go to Dashboard</button>

      {/* Task List */}
      <h2>Task List</h2>
      <Table columns={columns} dataSource={tasks} />
    </div>
  );
};

export default DeleteTask;
