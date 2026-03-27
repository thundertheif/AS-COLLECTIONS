import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyAccount.css";

export default function MyAccount() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: "Guest User",
    email: "guest@example.com",
    phone: "+91 9876543210",
    avatar: "👤"
  });
  
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const menuItems = [
    { id: "dashboard", label: "📊 Dashboard", icon: "📊" },
    { id: "orders", label: "📦 My Orders", icon: "📦" },
    { id: "wishlist", label: "❤️ Wishlist", icon: "❤️" },
    { id: "addresses", label: "📍 Addresses", icon: "📍" },
    { id: "profile", label: "👤 Profile", icon: "👤" },
    { id: "settings", label: "⚙️ Settings", icon: "⚙️" }
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear auth tokens
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Sidebar */}
        <aside className="account-sidebar">
          <div className="user-profile">
            <div className="user-avatar">{user.avatar}</div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          
          <nav className="account-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
          
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </aside>
        
        {/* Main Content */}
        <main className="account-main">
          {activeTab === "dashboard" && (
            <div className="dashboard-content">
              <h1>Welcome back, {user.name.split(" ")[0]}! 👋</h1>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-icon">📦</span>
                  <h3>5</h3>
                  <p>Total Orders</p>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🚚</span>
                  <h3>1</h3>
                  <p>In Transit</p>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">❤️</span>
                  <h3>12</h3>
                  <p>Wishlist Items</p>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🎁</span>
                  <h3>₹250</h3>
                  <p>Rewards Points</p>
                </div>
              </div>
              
              <div className="recent-orders">
                <h2>Recent Orders</h2>
                <button className="view-all-btn" onClick={() => setActiveTab("orders")}>
                  View All Orders →
                </button>
              </div>
            </div>
          )}
          
          {activeTab === "orders" && (
            <div className="orders-content">
              <h1>📦 My Orders</h1>
              <button className="track-btn" onClick={() => navigate("/track-order")}>
                📍 Track Order
              </button>
              {/* Order list would go here */}
            </div>
          )}
          
          {activeTab === "wishlist" && (
            <div className="wishlist-content">
              <h1>❤️ My Wishlist</h1>
              <button className="shop-btn" onClick={() => navigate("/wishlist")}>
                View Full Wishlist →
              </button>
            </div>
          )}
          
          {activeTab === "profile" && (
            <div className="profile-content">
              <h1>👤 Profile Settings</h1>
              <form className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user.name} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue={user.email} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" defaultValue={user.phone} />
                </div>
                <button type="submit" className="save-btn">💾 Save Changes</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}