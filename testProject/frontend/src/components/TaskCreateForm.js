import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Table } from 'antd';
import axiosWithAuth from '../axiosWithAuth'; // Import axiosWithAuth instance
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation

const TaskCreateForm = () => {
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  useEffect(() => {
    // Fetch tasks when the component mounts
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

  const handleSubmit = (values) => {
    axiosWithAuth.post('tasks/', values) // Use axiosWithAuth for making the API call
      .then(response => {
        console.log('Task created successfully:', response.data);
        form.resetFields(); // Reset form fields after successful submission
        fetchTasks(); // Refresh tasks after creating a new one
      })
      .catch(error => {
        console.error('Task creation failed:', error);
        // Show error message
      });
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
    <div>
      <h2>Create Task</h2>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item name="name" label="Task Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="duedate" label="Due Date" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Create Task</Button>
          <Button type="button" onClick={handleBackToDashboard}>Back to Dashboard</Button>
        </Form.Item>
      </Form>

      {/* Button to view tasks
      <Button onClick={fetchTasks}>View Tasks</Button> */}
      
      {/* Table to display tasks */}
      <h2>Task List</h2>
      <Table columns={columns} dataSource={tasks} />
    </div>
  );
};

export default TaskCreateForm;