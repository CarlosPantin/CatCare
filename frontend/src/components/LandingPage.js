import React from "react";
import { Link } from "react-router-dom";  
import "./styles.css";  

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to CatCare</h1>
        <div className="header-buttons">
          <Link to="/login" className="header-btn">Login</Link>
          <Link to="/register" className="header-btn">Register</Link>
        </div>
      </header>

      <div className="landing-content">
        <h2>Take Care of Your Cat in the Best Way</h2>
        <p>Join the CatCare community and manage your cat’s health and care routines easily!</p>
      </div>

      <footer className="landing-footer">
        <p>&copy; 2025 CatCare. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
