import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactUs.css";  // ✅ Correct CSS import

// ❌ WRONG: export default function AboutUs()
// ✅ CORRECT:
export default function ContactUs() {  // ← Change this!
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: ""
  });
  const [toast, setToast] = useState({ message: "", type: "success" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({ message: "Message sent successfully! We'll contact you soon.", type: "success" });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page">  {/* ✅ Correct className */}
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p className="contact-subtitle">We'd love to hear from you!</p>

        <div className="contact-grid">
          <div className="contact-form-section">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your Name" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <select name="subject" value={formData.subject} onChange={handleChange} required>
                  <option value="">Select Subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="return">Returns & Refunds</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" placeholder="Your message..." />
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>

          <div className="contact-info-section">
            <div className="contact-card">
              <h3>📍 Visit Us</h3>
              <p>AS Collections<br/>123 Fashion Street, Mumbai<br/>Maharashtra 400001, India</p>
            </div>
            <div className="contact-card">
              <h3>📞 Call Us</h3>
              <p>+91 98765 43210<br/>Mon-Sat: 10AM - 8PM</p>
            </div>
            <div className="contact-card">
              <h3>✉️ Email Us</h3>
              <p>support@ascollections.com<br/>sales@ascollections.com</p>
            </div>
          </div>
        </div>
      </div>
      {toast.message && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
    </div>
  );
}