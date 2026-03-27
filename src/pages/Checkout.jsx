import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  const { cart, clearCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [orderId, setOrderId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
  // 🧪 SIMULATION MODE TOGGLE (Set true for testing without real payments)
  const [isSimulationMode, setIsSimulationMode] = useState(true);

  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const shippingCost = subtotal >= 5000 ? 0 : 150;
  const tax = Math.round(subtotal * 0.18);
  const finalTotal = subtotal + shippingCost + tax;

  // 🔹 LOAD RAZORPAY SCRIPT (FIXED: removed trailing spaces in URL)
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        // ✅ FIXED: Removed extra spaces in URL
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.warn("⚠️ Razorpay script failed to load");
          setRazorpayLoaded(false);
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  // 🔹 HANDLE INPUT
  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
    setError("");
  };

  // 🔹 VALIDATION
  const validateForm = () => {
    const { fullName, email, phone, address, city, state, pincode } = shipping;

    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      setError("⚠️ Please fill all required fields");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("⚠️ Invalid phone number (must be 10 digits)");
      return false;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setError("⚠️ Invalid pincode (must be 6 digits)");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("⚠️ Please enter a valid email address");
      return false;
    }

    setError("");
    return true;
  };

  // 🔹 CREATE ORDER IN DATABASE
  const createOrder = async (paymentData = {}) => {
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customer: {
            name: shipping.fullName,
            email: shipping.email,
            phone: shipping.phone,
          },
          shippingAddress: {
            street: shipping.address,
            city: shipping.city,
            state: shipping.state,
            zipCode: shipping.pincode,
          },
          paymentMethod: paymentMethod === "cod" ? "COD" : "ONLINE",
          paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
          totalAmount: finalTotal,
          razorpayDetails: paymentData,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Order creation failed: ${res.status}`);
      }

      const data = await res.json();
      return data.orderId;
    } catch (err) {
      console.error("Create order error:", err);
      throw err;
    }
  };

  // 🔹 SIMULATE ORDER CREATION (for testing)
  const simulateOrderCreation = async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return `ORD-SIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // 🔹 HANDLE PAYMENT (UPDATED WITH SIMULATION SUPPORT)
  const handlePayment = async () => {
    if (isProcessing) return;
    if (!validateForm()) return;
    if (!cart || cart.length === 0) {
      setError("⚠️ Your cart is empty");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // 🧾 CASH ON DELIVERY
      if (paymentMethod === "cod") {
        let orderId;
        
        if (isSimulationMode) {
          // 🧪 SIMULATION: Skip API, generate fake order ID
          console.log("🧪 [SIMULATION] COD Order - Skipping API call");
          orderId = await simulateOrderCreation();
        } else {
          // 🌐 REAL MODE: Call backend API
          orderId = await createOrder();
        }
        
        setOrderId(orderId);
        clearCart();
        return;
      }

      // 💳 ONLINE PAYMENT (Razorpay)
      else {
        // 🧪 SIMULATION MODE: Skip real Razorpay integration
        if (isSimulationMode) {
          console.log("🧪 [SIMULATION] Online Payment - Simulating success");
          
          // Show confirmation dialog for simulation
          const userConfirmed = window.confirm(
            `🧪 SIMULATION MODE\n\n` +
            `Simulating Razorpay Payment\n` +
            `Amount: ₹${finalTotal}\n\n` +
            `✅ Click OK to simulate SUCCESS\n` +
            `❌ Click Cancel to simulate FAILURE`
          );
          
          await new Promise((resolve) => setTimeout(resolve, 2000));
          
          if (userConfirmed) {
            // Simulate successful payment
            const simulatedResponse = {
              razorpay_payment_id: "pay_sim_" + Date.now(),
              razorpay_order_id: "order_sim_" + Date.now(),
              razorpay_signature: "simulated_signature"
            };
            
            let orderId;
            try {
              // Try to save to backend (optional in simulation)
              orderId = await createOrder(simulatedResponse);
            } catch (apiErr) {
              console.warn("⚠️ Backend unavailable in simulation, using local order ID");
              orderId = `ORD-SIM-${Date.now()}`;
            }
            
            setOrderId(orderId);
            clearCart();
          } else {
            // Simulate failed payment
            throw new Error("Payment cancelled by user (simulated)");
          }
          return;
        }
        
        // 🌐 REAL MODE: Actual Razorpay Integration
        // Check if Razorpay is loaded
        if (!window.Razorpay) {
          setError("❌ Payment gateway not loaded. Please refresh the page.");
          setIsProcessing(false);
          return;
        }

        // Create payment order on backend
        let paymentOrder;
        try {
          const res = await fetch(`${API}/api/payment/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              amount: finalTotal,
              currency: "INR"
            }),
          });

          if (!res.ok) {
            throw new Error(`Payment API error: ${res.status}`);
          }

          paymentOrder = await res.json();
        } catch (apiError) {
          console.error("Payment order creation failed:", apiError);
          // Fallback to simulation if API fails
          console.warn("⚠️ Falling back to simulation mode due to API error");
          setError("❌ Backend unavailable. Enable simulation mode or check server.");
          setIsProcessing(false);
          return;
        }

        // Configure Razorpay options
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_xxxxx",
          amount: paymentOrder.amount || finalTotal * 100, // Amount in paise
          currency: "INR",
          name: "AS Collections",
          description: "Order Payment",
          order_id: paymentOrder.id,
          handler: async (response) => {
            try {
              const id = await createOrder(response);
              setOrderId(id);
              clearCart();
            } catch (err) {
              console.error("Order creation after payment failed:", err);
              setError("❌ Payment successful but order creation failed. Please contact support.");
              setIsProcessing(false);
            }
          },
          prefill: {
            name: shipping.fullName,
            email: shipping.email,
            contact: shipping.phone,
          },
          theme: {
            color: "#e91e63",
          },
          modal: {
            ondismiss: () => {
              setError("⚠️ Payment cancelled by user");
              setIsProcessing(false);
            }
          },
          // Optional: Handle payment failure
          events: {
            onpaymentfailed: function (response) {
              setError(`❌ Payment failed: ${response.error?.description || "Unknown error"}`);
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        
        rzp.on("payment.failed", (response) => {
          console.error("Razorpay payment failed:", response);
          setError(`❌ Payment failed: ${response.error?.description || "Transaction declined"}`);
          setIsProcessing(false);
        });

        rzp.open();
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(`❌ ${err.message || "Something went wrong. Please try again."}`);
      setIsProcessing(false);
    }
  };

  // ✅ SUCCESS UI
  if (orderId) {
    return (
      <div className="checkout-success">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h2>Order Confirmed!</h2>
          <p className="order-id">Order ID: <strong>{orderId}</strong></p>
          {isSimulationMode && (
            <p style={{ color: "#ff9800", fontSize: "0.9rem" }}>
              🧪 This is a simulated order (Simulation Mode enabled)
            </p>
          )}
          <p className="success-message">
            Thank you for your purchase! We'll send you a confirmation email shortly.
          </p>
          <div className="success-actions">
            <button onClick={() => navigate("/")} className="home-btn">
              Go Home
            </button>
            <button onClick={() => navigate("/orders")} className="orders-btn">
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {/* LEFT - SHIPPING FORM */}
      <div className="checkout-left">
        <h2>Shipping Details</h2>

        {/* 🧪 SIMULATION MODE TOGGLE */}
        <div className="simulation-banner" style={{ 
          padding: "12px", 
          background: isSimulationMode ? "#fff3cd" : "#e8f5e9", 
          borderRadius: "8px", 
          marginBottom: "15px",
          border: `1px solid ${isSimulationMode ? "#ffc107" : "#4caf50"}`,
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", flex: 1 }}>
            <input
              type="checkbox"
              checked={isSimulationMode}
              onChange={(e) => setIsSimulationMode(e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            <span style={{ fontWeight: "500" }}>
              {isSimulationMode ? "🧪 Simulation Mode ON" : "🌐 Live Mode"}
            </span>
          </label>
          <span style={{ fontSize: "0.85rem", color: "#666" }}>
            {isSimulationMode ? "No real payments" : "Real transactions"}
          </span>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <span>{error}</span>
            {paymentMethod === "razorpay" && !razorpayLoaded && !isSimulationMode && (
              <div className="error-suggestion">
                💡 Try refreshing the page or use Cash on Delivery
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name *"
            value={shipping.fullName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={shipping.email}
            onChange={handleChange}
          />
        </div>

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number *"
          value={shipping.phone}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Full Address (House No, Street, Area) *"
          value={shipping.address}
          onChange={handleChange}
          rows="3"
        />

        <div className="form-group">
          <input
            type="text"
            name="city"
            placeholder="City *"
            value={shipping.city}
            onChange={handleChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State *"
            value={shipping.state}
            onChange={handleChange}
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode *"
            value={shipping.pincode}
            onChange={handleChange}
            maxLength="6"
          />
        </div>

        <div className="payment-section">
          <h3>Payment Method</h3>
          
          <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}>
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <div className="payment-info">
              <strong>Cash on Delivery</strong>
              <span>Pay when you receive your order</span>
            </div>
          </label>

          <label className={`payment-option ${paymentMethod === "razorpay" ? "selected" : ""}`}>
            <input
              type="radio"
              name="payment"
              value="razorpay"
              checked={paymentMethod === "razorpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={!razorpayLoaded && !isSimulationMode}
            />
            <div className="payment-info">
              <strong>Online Payment</strong>
              <span>Credit/Debit Card, UPI, Net Banking</span>
              {!razorpayLoaded && !isSimulationMode && (
                <span className="loading-text">Loading...</span>
              )}
              {isSimulationMode && (
                <span style={{ color: "#ff9800", fontSize: "0.85rem" }}>🧪 Simulated</span>
              )}
            </div>
          </label>
        </div>

        <button
          className="checkout-btn"
          disabled={isProcessing || !cart || cart.length === 0}
          onClick={handlePayment}
        >
          {isProcessing ? (
            <span className="processing">
              <span className="spinner"></span>
              Processing...
            </span>
          ) : (
            `Pay ₹${finalTotal.toLocaleString()}`
          )}
        </button>

        <button
          className="back-to-cart-btn"
          onClick={() => navigate("/cart")}
        >
          ← Back to Cart
        </button>
      </div>

      {/* RIGHT - ORDER SUMMARY */}
      <div className="checkout-right">
        <h3>Order Summary</h3>

        {/* Cart Items List */}
        <div className="order-items">
          {cart && cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="order-item">
                <div className="item-image">
                  <img
                    src={item.image || "/no-image.png"}
                    alt={item.name}
                    onError={(e) => (e.target.src = "/no-image.png")}
                  />
                </div>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="item-variant">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && item.color && <span> | </span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </p>
                  <p className="item-qty">Qty: {item.qty || 1}</p>
                </div>
                <div className="item-price">
                  ₹{(item.price * (item.qty || 1)).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p className="no-items">No items in cart</p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="summary-box">
          <div className="summary-row">
            <span>Subtotal ({totalItems || cart?.length || 0} items)</span>
            <span>₹{subtotal?.toLocaleString() || 0}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span className={shippingCost === 0 ? "free" : ""}>
              {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
            </span>
          </div>

          <div className="summary-row">
            <span>Tax (GST 18%)</span>
            <span>₹{tax.toLocaleString()}</span>
          </div>

          {shippingCost > 0 && (
            <p className="shipping-note">
              🎁 Free shipping on orders above ₹5,000
            </p>
          )}

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{finalTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Secure Checkout Badge */}
        <div className="secure-badge">
          <span>🔒 Secure Checkout</span>
          <p>Your information is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}