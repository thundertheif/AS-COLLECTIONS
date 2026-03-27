import React from "react";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-hero">
        {/* About Us Hero Section */}
        <p>Your Trusted Partner in Premium Ethnic Wear</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            AS Collections was founded with a vision to bring premium quality
            ethnic wear to fashion lovers across the globe. Starting from a
            small boutique in Mumbai, we have grown into a trusted online
            destination for sarees, kurtis, tops, and designer materials.
          </p>
          <p>
            We believe in celebrating Indian craftsmanship while embracing
            contemporary fashion trends. Every piece in our collection is
            carefully curated to ensure the perfect blend of tradition and
            modernity.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <span className="mission-icon">🎯</span>
              <h3>Quality First</h3>
              <p>
                100% authentic products with premium fabrics and craftsmanship.
              </p>
            </div>

            <div className="mission-card">
              <span className="mission-icon">🌍</span>
              <h3>Global Reach</h3>
              <p>
                Shipping to 50+ countries with hassle-free international
                delivery.
              </p>
            </div>

            <div className="mission-card">
              <span className="mission-icon">💝</span>
              <h3>Customer Satisfaction</h3>
              <p>
                Easy returns, secure payments, and 24/7 customer support.
              </p>
            </div>

            <div className="mission-card">
              <span className="mission-icon">🌱</span>
              <h3>Sustainable Fashion</h3>
              <p>
                Supporting local artisans and eco-friendly practices.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Why Choose Us?</h2>
          <ul className="why-choose-list">
            <li>✓ 10,000+ Happy Customers Worldwide</li>
            <li>✓ 500+ Premium Designs</li>
            <li>✓ 7-Day Easy Return Policy</li>
            <li>✓ Free Shipping Above ₹999</li>
            <li>✓ Secure Payment Options</li>
            <li>✓ 24/7 Customer Support</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Authenticity</h3>
              <p>
                We guarantee genuine products with quality certificates.
              </p>
            </div>

            <div className="value-item">
              <h3>Transparency</h3>
              <p>
                Clear pricing, no hidden charges, honest product descriptions.
              </p>
            </div>

            <div className="value-item">
              <h3>Innovation</h3>
              <p>
                Continuously updating our collection with latest trends.
              </p>
            </div>

            <div className="value-item">
              <h3>Trust</h3>
              <p>
                Building long-term relationships with our customers.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}