// src/pages/CustomerDashboard.jsx
import { Link } from "react-router-dom";
import "./CustomerDashboard.css";

export default function CustomerDashboard() {
  return (
    <div className="customer-dashboard">

      {/* Hero Banner */}
      <div className="hero-banner">
        <h1>Welcome to AS COLLECTIONS</h1>
        <p>Exclusive Sarees, Kurtis & Designer Wear</p>
        <Link to="/sarees" className="shop-btn">Shop Now</Link>
      </div>

      {/* Categories */}
      <div className="category-section">
        <h2>Shop By Category</h2>
        <div className="categories">
          <Link to="/sarees" className="cat-card">Sarees</Link>
          <Link to="/kurtis" className="cat-card">Kurtis</Link>
          <Link to="/tops" className="cat-card">Tops</Link>
          <Link to="/designer" className="cat-card">Designer</Link>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h2>Trending Products</h2>

        <div className="product-grid">
          <div className="product-card">
            <img src="/images/saree1.jpg" alt="" />
            <h3>Silk Saree</h3>
            <p>₹1999</p>
            <button>Add to Cart</button>
          </div>

          <div className="product-card">
            <img src="/images/kurti1.jpg" alt="" />
            <h3>Designer Kurti</h3>
            <p>₹999</p>
            <button>Add to Cart</button>
          </div>

          <div className="product-card">
            <img src="/images/top1.jpg" alt="" />
            <h3>Stylish Top</h3>
            <p>₹699</p>
            <button>Add to Cart</button>
          </div>
        </div>
      </div>

    </div>
  );
}