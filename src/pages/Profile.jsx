import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>
        
        <div className="profile-card">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name || "Not provided"}</p>
            <p><strong>Email:</strong> {user.email || "Not provided"}</p>
            <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
          </div>
          
          <div className="profile-actions">
            <button onClick={() => navigate("/my-account")}>Edit Profile</button>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}