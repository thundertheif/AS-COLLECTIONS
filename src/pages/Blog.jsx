import React from "react";
import { Link } from "react-router-dom";
import "./Blog.css";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "How to Style a Saree for Different Occasions",
      excerpt: "From casual outings to grand weddings, learn how to drape and style your saree perfectly for every event.",
      category: "Fashion Tips",
      date: "March 15, 2026",
      image: "https://via.placeholder.com/400x250/ff3f6c/ffffff?text=Saree+Styling"
    },
    {
      id: 2,
      title: "Top 10 Kurti Trends for 2026",
      excerpt: "Discover the latest kurti designs that are taking the fashion world by storm this season.",
      category: "Trends",
      date: "March 10, 2026",
      image: "https://via.placeholder.com/400x250/ff8a00/ffffff?text=Kurti+Trends"
    },
    {
      id: 3,
      title: "Fabric Guide: Choosing the Right Material",
      excerpt: "Understanding different fabrics helps you make informed choices for comfort and style.",
      category: "Guide",
      date: "March 5, 2026",
      image: "https://via.placeholder.com/400x250/9c27b0/ffffff?text=Fabric+Guide"
    },
    {
      id: 4,
      title: "Sustainable Fashion: Our Commitment",
      excerpt: "Learn about our eco-friendly initiatives and how we support local artisans.",
      category: "Sustainability",
      date: "February 28, 2026",
      image: "https://via.placeholder.com/400x250/4caf50/ffffff?text=Sustainable"
    }
  ];

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <h1>AS Collections Blog</h1>
        <p>Fashion Tips, Trends & Style Inspiration</p>
      </div>

      <div className="blog-container">
        <div className="blog-grid">
          {blogPosts.map(post => (
            <article key={post.id} className="blog-card">
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
                <span className="blog-category">{post.category}</span>
              </div>
              <div className="blog-content">
                <span className="blog-date">{post.date}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="read-more">Read More →</Link>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-sidebar">
          <div className="sidebar-widget">
            <h3>Categories</h3>
            <ul>
              <li><Link to="/blog?category=fashion">Fashion Tips (12)</Link></li>
              <li><Link to="/blog?category=trends">Trends (8)</Link></li>
              <li><Link to="/blog?category=guide">Guides (5)</Link></li>
              <li><Link to="/blog?category=sustainability">Sustainability (3)</Link></li>
            </ul>
          </div>
          <div className="sidebar-widget">
            <h3>Newsletter</h3>
            <p>Subscribe for latest updates!</p>
            <input type="email" placeholder="Your email" className="newsletter-input" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}