// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Import CSS file for styling

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1 className="landing-page-heading">TodoGPT</h1>
      <div className="landing-page-buttons">
        <Link to="/login" className="landing-page-button"><button>Login</button></Link>
        <Link to="/register" className="landing-page-button"><button>Register</button></Link>
      </div>
    </div>
  );
};

export default LandingPage;
