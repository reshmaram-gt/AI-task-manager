import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Import CSS file for styling

const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/token/', loginData)
      .then(response => {
        const accessToken = response.data.access;
        localStorage.setItem('accessToken', accessToken);
        console.log('Access Token:', accessToken);
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('Login failed:', error);
        setError('Invalid username or password');
      });
  };

  return (
    <div className="login-form-container">
      <h2>Login Form</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input type="email" name="email" value={loginData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="username" value={loginData.username} onChange={handleChange} placeholder="Username" required />
        <input type="password" name="password" value={loginData.password} onChange={handleChange} placeholder="Password" required />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
