import 'antd/dist/reset.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskCreateForm from './components/TaskCreateForm';
import TaskUpdateForm from './components/TaskUpdateForm';
import TaskDelete from './components/TaskDelete';
import RegistrationForm from './components/RegistrationForm';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard';
import ChatBot from './components/ChatBot';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage  />}/>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="tasks/create" element={<TaskCreateForm />} />
          <Route path="tasks/edit" element={<TaskUpdateForm />} />
          <Route path="tasks/delete" element={<TaskDelete />} />
          <Route path="tasks/view" element={<TaskList />} />
          <Route path="chatbot" element={<ChatBot />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
