import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

// 🔥 Simple Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>✕</button>
    </div>
  );
};

export default function OrderHistory() {
  const navigate = useNavigate();
  
  // 🔥 State
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // 🔥 Mock Customer Orders (Replace with API)
  useEffect(() => {
    const loadOrders = () => {
      // Get current user from localStorage (mock auth)
      const currentUser = JSON.parse(localStorage.getItem("user")) || { email: "customer@example.com" };
      
      // Mock orders for this customer
      const mockOrders = [
        {
          id: "#ORD-ABC123",
          date: "2024-01-15T10:30:00",
          status: "Delivered",
          total: 2499,
          items: 3,
          products: [
            { name: "Black Party Top", qty: 1, price: 599, image: "/no-image.png" },
            { name: "Designer Kurti", qty: 2, price: 950, image: "/no-image.png" }
          ],
          shipping: { address: "123 MG Road, Bangalore", pincode: "560001" },
          payment: "UPI"
        },
        {
          id: "#ORD-XYZ789",
          date: "2024-01-10T14:20:00",
          status: "Shipped",
          total: 1299,
          items: 1,
          products: [
            { name: "Silk Saree - Red", qty: 1, price: 1299, image: "/no-image.png" }
          ],
          shipping: { address: "123 MG Road, Bangalore", pincode: "560001" },
          payment: "COD",
          tracking: { carrier: "Delhivery", trackingId: "DLV123456789IN" }
        },
        {
          id: "#ORD-DEF456",
          date: "2024-01-05T09:15:00",
          status: "Pending",
          total: 899,
          items: 1,
          products: [
            { name: "Cotton Kurti - Blue", qty: 1, price: 899, image: "/no-image.png" }
          ],
          shipping: { address: "123 MG Road, Bangalore", pincode: "560001" },
          payment: "Card"
        }
      ].filter(o => o.shipping?.address); // Filter for current user in real app
      
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    };
    
    loadOrders();
  }, []);

  // 🔥 Apply Filters
  useEffect(() => {
    let result = [...orders];
    
    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(o => o.status === statusFilter);
    }
    
    // Search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(query) ||
        o.products?.some(p => p.name.toLowerCase().includes(query))
      );
    }
    
    // Sort by newest
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredOrders(result);
  }, [orders, statusFilter, search]);

  // 🔥 Show Toast
  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  // 🔥 Format Date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  // 🔥 Format Currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };

  // 🔥 Status Badge Color
  const getStatusColor = (status) => {
    const colors = {
      "Pending": "#f59e0b",
      "Processing": "#3b82f6",
      "Shipped": "#8b5cf6",
      "Out for Delivery": "#06b6d4",
      "Delivered": "#10b981",
      "Cancelled": "#ef4444"
    };
    return colors[status] || "#9ca3af";
  };

  // 🔥 Reorder Items
  const handleReorder = (order) => {
    showToast("🛒 Items added to cart!", "success");
    // In real app: add order.products to cart via context
    navigate("/cart");
  };

  // 🔥 Track This Order
  const handleTrack = (orderId) => {
    navigate("/track-order", { state: { orderId } });
  };

  // 🔥 Toggle Order Details
  const toggleExpand = (orderId) => {
    setExpandedOrder(prev => prev === orderId ? null : orderId);
  };

  // 🔥 Loading State
  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loader-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      {/* 🔥 Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* 🔥 Header */}
      <div className="order-header">
        <h1 className="page-title">📦 My Order History</h1>
        <p className="page-subtitle">View and manage your past orders</p>
      </div>

      {/* 🔥 Filters */}
      <div className="order-filters">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search orders or products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* 🔥 Orders List */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>😕 No orders found</p>
            <button className="shop-btn" onClick={() => navigate("/tops")}>
              🛍️ Start Shopping
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Order Header */}
              <div className="order-card-header" onClick={() => toggleExpand(order.id)}>
                <div className="order-id-date">
                  <span className="order-id">{order.id}</span>
                  <span className="order-date">{formatDate(order.date)}</span>
                </div>
                
                <div className="order-status-amount">
                  <span 
                    className="status-badge" 
                    style={{ background: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                  <span className="order-total">{formatCurrency(order.total)}</span>
                </div>
                
                <span className="expand-icon">{expandedOrder === order.id ? '▲' : '▼'}</span>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="order-card-details">
                  {/* Products */}
                  <div className="order-products">
                    <h4>🛍️ Items ({order.items})</h4>
                    {order.products?.map((prod, idx) => (
                      <div key={idx} className="product-row">
                        <img src={prod.image} alt={prod.name} />
                        <div className="product-info">
                          <p className="product-name">{prod.name}</p>
                          <p className="product-qty">Qty: {prod.qty}</p>
                        </div>
                        <p className="product-price">{formatCurrency(prod.price * prod.qty)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  <div className="order-shipping">
                    <h4>📬 Shipping Address</h4>
                    <p>{order.shipping?.address}</p>
                    <p>Pin: {order.shipping?.pincode}</p>
                  </div>

                  {/* Payment Info */}
                  <div className="order-payment">
                    <h4>💳 Payment</h4>
                    <p>{order.payment} • {formatCurrency(order.total)}</p>
                  </div>

                  {/* Tracking Info (if shipped) */}
                  {order.tracking && (
                    <div className="order-tracking">
                      <h4>🚚 Tracking</h4>
                      <p>{order.tracking.carrier}: {order.tracking.trackingId}</p>
                      <button onClick={() => handleTrack(order.id)} className="track-btn-small">
                        Track Package
                      </button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="order-actions">
                    <button 
                      className="action-btn track" 
                      onClick={() => handleTrack(order.id)}
                    >
                      📍 Track Order
                    </button>
                    <button 
                      className="action-btn reorder" 
                      onClick={() => handleReorder(order)}
                    >
                      🔄 Reorder
                    </button>
                    <button 
                      className="action-btn invoice"
                      onClick={() => showToast("📄 Invoice downloaded", "success")}
                    >
                      📄 Download Invoice
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 🔥 Back to Account */}
      <div className="back-to-account">
        <button className="back-btn" onClick={() => navigate("/my-account")}>
          ← Back to My Account
        </button>
      </div>
    </div>
  );
}