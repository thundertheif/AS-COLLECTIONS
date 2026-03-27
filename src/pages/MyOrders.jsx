import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyOrders.css';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // ✅ REMOVED: const API = ... (use relative URLs with proxy)

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Get email from localStorage (set during checkout)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const email = localStorage.getItem('customerEmail') || 
                   user.email || 
                   'guest@example.com';

      // ✅ Use relative URL - Vite proxy forwards to backend
      const res = await fetch(`/api/orders/user/${encodeURIComponent(email)}`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch orders`);
      }
      
      const data = await res.json();

      if (data.success) {
        setOrders(data.data || []);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to load orders");
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: '#ff9800',
      confirmed: '#2196f3',
      processing: '#9c27b0',
      shipped: '#00bcd4',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#757575';
  };

  if (loading) return <div className="loading-orders">Loading your orders...</div>;

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Could Not Load Orders</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here</p>
          <button onClick={() => navigate('/tops')}>Start Shopping</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id || order.orderId} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderId}</h3>
                  <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div 
                  className="order-status"
                  style={{ color: getStatusColor(order.orderStatus) }}
                >
                  {order.orderStatus.toUpperCase()}
                </div>
              </div>

              <div className="order-items">
                {order.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="order-item">
                    {/* ✅ FIX: Use item.image directly */}
                    <img 
                      src={item.image?.startsWith('http') ? item.image : item.image} 
                      alt={item.name}
                      onError={(e) => e.target.src = '/no-image.png'}
                    />
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-qty">Qty: {item.quantity}</p>
                      <p className="item-price">₹{item.price}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="more-items">+{order.items.length - 2} more items</p>
                )}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: ₹{order.pricing.total}</strong>
                </div>
                <button 
                  className="view-details-btn"
                  onClick={() => navigate(`/order/${order.orderId}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}