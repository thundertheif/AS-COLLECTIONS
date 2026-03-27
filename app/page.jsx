import PromotionalBanner from '../components/PromotionalBanner/PromotionalBanner';
import HeroCarousel from '../components/Home/HeroCarousel';

export default function HomePage() {
  return (
    <div>
      <Header />
      <PromotionalBanner />  {/* Top coupon banner */}
      <HeroCarousel />       {/* Scrolling images below */}
      <Categories />
      <Products />
      <Footer />
    </div>
  );
}