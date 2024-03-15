import React from 'react';
import { Link } from 'react-router-dom';
import './UserDashboard.css'; // Import CSS file for styling

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="dashboard-links">
        <Link to="/tasks/view" className="dashboard-link">View Tasks</Link>
        <Link to="/tasks/create" className="dashboard-link">Create Task</Link>
        <Link to="/tasks/edit" className="dashboard-link">Edit Task</Link>
        <Link to="/tasks/delete" className="dashboard-link">Delete Task</Link>
      </div>
    </div>
  );
};

export default Dashboard;
