import React, { useState, useEffect } from 'react';
import './HeroCarousel.css';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      brand: 'U.S. POLO ASSN.',
      title: 'Premium Collection',
      discount: 'Up To 50% Off',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      cta: 'Explore',
      bgColor: '#f5f5dc'
    },
    {
      id: 2,
      brand: 'NIKE',
      title: 'Sports Collection',
      discount: 'Up To 60% Off',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200',
      cta: 'Shop Now',
      bgColor: '#ffe4e1'
    },
    {
      id: 3,
      brand: 'ADIDAS',
      title: 'New Arrivals',
      discount: 'Up To 40% Off',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200',
      cta: 'View More',
      bgColor: '#e6f3ff'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="hero-carousel">
      <div className="carousel-container">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundColor: banner.bgColor }}
          >
            <div className="slide-content">
              <div className="slide-text">
                <h3 className="brand-name">{banner.brand}</h3>
                <h2 className="slide-title">{banner.title}</h2>
                <p className="slide-discount">{banner.discount}</p>
                <button className="explore-btn">
                  {banner.cta} →
                </button>
              </div>
              <div className="slide-image">
                <img src={banner.image} alt={banner.brand} />
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button className="carousel-nav prev" onClick={prevSlide}>
          ‹
        </button>
        <button className="carousel-nav next" onClick={nextSlide}>
          ›
        </button>

        {/* Dots Indicator */}
        <div className="carousel-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;