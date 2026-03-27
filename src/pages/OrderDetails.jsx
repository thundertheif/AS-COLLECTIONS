import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/OrderDetails.css';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ REMOVED: const API = ... (use relative URLs with proxy)

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      // ✅ Use relative URL - Vite proxy forwards to backend
      const res = await fetch(`/api/orders/${orderId}`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Order not found`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        // ✅ FIX: Backend returns data.order, NOT data.data
        setOrder(data.order);
        setError(null);
      } else {
        throw new Error(data.message || "Order not found");
      }
    } catch (error) {
      console.error('❌ Error fetching order:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  
  if (error || !order) {
    return (
      <div className="error-container">
        <h2>⚠️ Order Not Found</h2>
        <p>{error || "The order you're looking for doesn't exist."}</p>
        <div className="error-actions">
          <button onClick={() => navigate('/my-orders')}>View My Orders</button>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="order-header">
        <h1>Order Details</h1>
        <button onClick={() => navigate('/my-orders')}>← Back to Orders</button>
      </div>

      <div className="order-success-banner">
        <h2>🎉 Order Confirmed</h2>
        <p>Your order has been placed successfully</p>
      </div>

      <div className="order-content">
        <div className="order-summary-card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Order ID:</span>
            <strong>{order.orderId}</strong>
          </div>
          <div className="summary-row">
            <span>Order Date:</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Payment Method:</span>
            <span>{order.payment.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
          </div>
          <div className="summary-row">
            <span>Order Status:</span>
            <span className={`status-badge status-${order.orderStatus}`}>
              {order.orderStatus.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="shipping-card">
          <h3>Shipping Address</h3>
          <div className="address">
            <p><strong>{order.shippingDetails.fullName}</strong></p>
            <p>{order.shippingDetails.address}</p>
            <p>{order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.pincode}</p>
            <p>Phone: {order.shippingDetails.phone}</p>
            <p>Email: {order.shippingDetails.email}</p>
          </div>
        </div>

        <div className="order-items-card">
          <h3>Order Items ({order.items.length})</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="order-item">
              {/* ✅ FIX: Use item.image directly - it already has /images/ prefix */}
              <img 
                src={item.image?.startsWith('http') ? item.image : item.image} 
                alt={item.name}
                onError={(e) => e.target.src = '/no-image.png'}
              />
              <div className="item-info">
                <h4>{item.name}</h4>
                {item.size && <p>Size: {item.size}</p>}
                {item.color && <p>Color: {item.color}</p>}
                <p className="item-price">₹{item.price} × {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-card">
          <h3>Price Details</h3>
          <div className="price-row">
            <span>Subtotal ({order.items.length} items)</span>
            <span>₹{order.pricing.subtotal}</span>
          </div>
          <div className="price-row">
            <span>Shipping</span>
            <span>{order.pricing.shipping === 0 ? 'FREE' : `₹${order.pricing.shipping}`}</span>
          </div>
          <div className="price-row">
            <span>Tax (18% GST)</span>
            <span>₹{order.pricing.tax}</span>
          </div>
          {order.pricing.discount > 0 && (
            <div className="price-row discount">
              <span>Discount</span>
              <span>-₹{order.pricing.discount}</span>
            </div>
          )}
          <div className="price-row total">
            <strong>Total Amount</strong>
            <strong>₹{order.pricing.total}</strong>
          </div>
        </div>

        <div className="order-actions">
          <button className="btn-primary" onClick={() => window.print()}>
            Download Invoice
          </button>
          <button className="btn-secondary" onClick={() => navigate('/tops')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}