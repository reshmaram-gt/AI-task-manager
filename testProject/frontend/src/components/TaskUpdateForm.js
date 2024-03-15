import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../axiosWithAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, DatePicker, Button, Table } from 'antd';
import './TaskUpdateForm.css';

const TaskUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskId, setTaskId] = useState(id);
  const [formData, setFormData] = useState({
    name: '',
    duedate: '',
    priority: ''
  });
  const [updateId, setUpdateId] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTaskData();
    fetchTaskList();
  }, [id]);

  const fetchTaskData = () => {
    axiosWithAuth.get(`tasks/${id}/`)
      .then(response => {
        setFormData({
          name: response.data.name,
          duedate: response.data.duedate,
          priority: response.data.priority
        });
      })
      .catch(error => {
        console.error('Error fetching task data:', error);
      });
  };

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosWithAuth.put(`tasks/${updateId}/`, formData)
      .then(response => {
        console.log('Task updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Task update failed:', error);
      });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
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
    <div className="task-update-form">
      <h2 className="task-update-form-title">Update Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="task-update-form-input"
          type="text"
          name="id"
          value={updateId}
          onChange={(e) => setUpdateId(e.target.value)}
          placeholder="Task ID"
          required
        />
        <input
          className="task-update-form-input"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Task Name"
          required
        />
        <input
          className="task-update-form-input"
          type="datetime-local"
          name="duedate"
          value={formData.duedate}
          onChange={handleChange}
          required
        />
        <input
          className="task-update-form-input"
          type="number"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          placeholder="Priority"
          required
        />
        <button className="task-update-form-button" type="submit">Update Task</button>
        <button className="task-update-form-button" type="button" onClick={handleBackToDashboard}>Back to Dashboard</button>
      </form>

      <h2>Task List</h2>
      <Table columns={columns} dataSource={tasks} />
    </div>
  );
};

export default TaskUpdateForm;
