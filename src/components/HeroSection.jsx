import { useState } from "react";
import "./Hero.css";

import hero1 from "../assets/hero/hero1.jpg";
import hero2 from "../assets/hero/hero2.jpg";
import hero3 from "../assets/hero/hero3.jpg";
import heroVideo from "../assets/hero/hero.mp4";

export default function HeroSection() {
  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <section className="hero">
      {!videoEnded ? (
        <video
          className="hero-video"
          src={heroVideo}
          autoPlay
          muted
          playsInline
          onEnded={() => setVideoEnded(true)}
        />
      ) : (
        <div className="hero-images">
          <div className="slide">
            <img src={hero1} alt="Mysore Silk Sarees" />
          </div>
          <div className="slide">
            <img src={hero2} alt="Royal Sarees" />
          </div>
          <div className="slide">
            <img src={hero3} alt="Traditional Silk" />
          </div>

          <div className="hero-text">
            <h1>Mysore Silk Sarees</h1>
            <p>A Legacy of Royalty</p>
            <button>Shop Now</button>
          </div>
        </div>
      )}
    </section>
  );
}