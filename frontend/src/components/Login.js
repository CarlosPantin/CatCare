import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const API_BASE_URL =
      process.env.NODE_ENV === "production"
        ? "https://catcare-clak.onrender.com"
        : "http://localhost:5000";
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("API BASE URL:", API_BASE_URL);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form-container">
        <h2>Welcome Back!</h2>
        <p>Log in to your account and start managing your cat's care!</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
