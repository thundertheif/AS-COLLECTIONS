import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css"; // optional CSS file

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Dummy Admin Credentials (change later)
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "1234";

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/admin-dashboard"); // change route if needed
    } else {
      setError("❌ Invalid Username or Password");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );

}

