import React from 'react';
import './PromotionalBanner.css';

const PromotionalBanner = () => {
  return (
    <div className="promo-banner">
      <div className="banner-container">
        <div className="banner-left">
          <h2 className="discount-title">
            Get <span className="highlight">25% Off</span>
          </h2>
          <p className="discount-subtitle">Up To ₹200 Off*</p>
        </div>
        
        <div className="banner-center">
          <div className="coupon-box">
            <span className="coupon-label">COUPON CODE</span>
            <span className="coupon-code">MYNTRASAVE</span>
          </div>
        </div>
        
        <div className="banner-right">
          <div className="percentage-icon">%</div>
        </div>
        
        <div className="banner-footer">
          <p>On Your First Order | T&C Apply</p>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;