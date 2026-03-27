import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OrderTracking.css";

export default function OrderTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [orderId, setOrderId] = useState(location.state?.orderId || "");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // 🔥 Mock Order Status Data (Replace with API call)
  const ORDER_STATUS = {
    confirmed: { label: "Order Confirmed", icon: "✅", color: "#10b981" },
    processing: { label: "Processing", icon: "📦", color: "#3b82f6" },
    shipped: { label: "Shipped", icon: "🚚", color: "#f59e0b" },
    out_for_delivery: { label: "Out for Delivery", icon: "📬", color: "#8b5cf6" },
    delivered: { label: "Delivered", icon: "🎉", color: "#10b981" }
  };

  // 🔥 Track Order
  const trackOrder = async () => {
    if (!orderId.trim()) {
      setError("⚠️ Please enter order ID");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock order data (Replace with real API)
    const mockOrder = {
      orderId: orderId.toUpperCase(),
      status: "shipped",
      orderDate: "2024-01-15",
      estimatedDelivery: "2024-01-22",
      items: [
        { name: "Black Party Top", qty: 1, price: 599, image: "/no-image.png" },
        { name: "Designer Kurti", qty: 2, price: 1299, image: "/no-image.png" }
      ],
      shipping: {
        name: "John Doe",
        address: "123, Main Street, Mumbai, Maharashtra - 400001",
        phone: "+91 9876543210"
      },
      timeline: [
        { status: "confirmed", date: "2024-01-15 10:30 AM", completed: true },
        { status: "processing", date: "2024-01-16 02:00 PM", completed: true },
        { status: "shipped", date: "2024-01-17 11:00 AM", completed: true },
        { status: "out_for_delivery", date: "Expected Jan 21", completed: false },
        { status: "delivered", date: "Expected Jan 22", completed: false }
      ]
    };
    
    setOrderData(mockOrder);
    
    // Set active step based on status
    const statusIndex = ["confirmed", "processing", "shipped", "out_for_delivery", "delivered"]
      .indexOf(mockOrder.status);
    setActiveStep(statusIndex);
    
    setLoading(false);
  };

  // Auto-track if orderId passed from checkout
  useEffect(() => {
    if (location.state?.orderId) {
      trackOrder();
    }
  }, [location.state?.orderId]);

  return (
    <div className="tracking-page">
      <div className="tracking-container">
        <h1 className="tracking-title">📍 Track Your Order</h1>
        
        {/* Search Box */}
        <div className="tracking-search">
          <input
            type="text"
            placeholder="Enter Order ID (e.g., ORD-ABC123)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === "Enter" && trackOrder()}
          />
          <button onClick={trackOrder} disabled={loading}>
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Loading State */}
        {loading && (
          <div className="tracking-loading">
            <div className="loader-spinner"></div>
            <p>Finding your order...</p>
          </div>
        )}
        
        {/* Order Details */}
        {orderData && !loading && (
          <>
            {/* Order Header */}
            <div className="order-header">
              <div className="order-info">
                <p><strong>Order ID:</strong> {orderData.orderId}</p>
                <p><strong>Order Date:</strong> {orderData.orderDate}</p>
                <p><strong>Estimated Delivery:</strong> {orderData.estimatedDelivery}</p>
              </div>
              <div className="order-status" style={{ color: ORDER_STATUS[orderData.status]?.color }}>
                {ORDER_STATUS[orderData.status]?.icon} {ORDER_STATUS[orderData.status]?.label}
              </div>
            </div>
            
            {/* Timeline */}
            <div className="tracking-timeline">
              {orderData.timeline.map((step, index) => {
                const status = ORDER_STATUS[step.status];
                return (
                  <div key={step.status} className={`timeline-step ${step.completed ? 'completed' : ''} ${index <= activeStep ? 'active' : ''}`}>
                    <div className="timeline-icon" style={{ 
                      background: step.completed ? status.color : '#ddd',
                      color: step.completed ? 'white' : '#666'
                    }}>
                      {status.icon}
                    </div>
                    <div className="timeline-content">
                      <p className="timeline-label">{status.label}</p>
                      <p className="timeline-date">{step.date}</p>
                    </div>
                    {index < orderData.timeline.length - 1 && (
                      <div className={`timeline-line ${step.completed ? 'completed' : ''}`} 
                           style={{ background: step.completed ? status.color : '#ddd' }} />
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Order Items */}
            <div className="order-items-section">
              <h3>📦 Order Items</h3>
              <div className="order-items">
                {orderData.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-qty">Qty: {item.qty}</p>
                      <p className="item-price">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="shipping-info">
              <h3>📬 Shipping Address</h3>
              <p><strong>{orderData.shipping.name}</strong></p>
              <p>{orderData.shipping.address}</p>
              <p>{orderData.shipping.phone}</p>
            </div>
            
            {/* Actions */}
            <div className="tracking-actions">
              <button className="btn-primary" onClick={() => navigate("/my-account")}>
                📋 View All Orders
              </button>
              <button className="btn-secondary" onClick={() => navigate("/")}>
                🏠 Continue Shopping
              </button>
            </div>
          </>
        )}
        
        {/* No Order Yet */}
        {!orderData && !loading && (
          <div className="no-order">
            <p>📦 Enter your Order ID to track delivery status</p>
            <p className="hint">Find Order ID in your confirmation email or SMS</p>
          </div>
        )}
      </div>
    </div>
  );
}