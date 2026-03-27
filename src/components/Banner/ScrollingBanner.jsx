// components/Home/HeroCarousel.jsx
import { Carousel } from 'react-responsive-carousel'; // or use Swiper/Slick

export default function HeroCarousel() {
  const banners = [
    { id: 1, image: '/us-polo-banner.jpg', title: 'U.S. POLO ASSN.', discount: 'Up To 50% Off' },
    { id: 2, image: '/banner2.jpg', title: 'Brand 2', discount: 'Up To 60% Off' },
    // Add more banners
  ];

  return (
    <Carousel 
      autoPlay
      infiniteLoop
      showThumbs={false}
      interval={3000}
    >
      {banners.map(banner => (
        <div key={banner.id} className="banner-slide">
          <img src={banner.image} alt={banner.title} />
          <div className="banner-overlay">
            <h3>{banner.title}</h3>
            <p>{banner.discount}</p>
            <button>Explore</button>
          </div>
        </div>
      ))}
    </Carousel>
  );
}