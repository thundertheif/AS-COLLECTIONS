// components/PromotionalBanner/PromotionalBanner.jsx
export default function PromotionalBanner() {
  return (
    <div className="promo-banner">
      <div className="banner-content">
        <h2>Get 25% Off</h2>
        <p>Up To ₹200 Off*</p>
      </div>
      <div className="coupon-code">
        <span>COUPON CODE</span>
        <strong>AS COLLECTIONS SAVE</strong>
      </div>
      <p className="terms">On Your First Order | T&C Apply</p>
    </div>
  );
}