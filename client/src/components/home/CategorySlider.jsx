import React, { useRef, useEffect, useState } from "react";
import "./CategorySlider.css";

const categories = [
  { name: "Pizza", img: "/src/assets/images/pizza.png" },
  { name: "Biryani", img: "/src/assets/images/Biryani.png" },
  { name: "Rolls", img: "/src/assets/images/rolls.png" },
  { name: "Bowl", img: "/src/assets/images/foodbowl.png" },
  { name: "Thali", img: "/src/assets/images/thali.png" },
  { name: "ThinCrust", img: "/src/assets/images/thincrust.png" },
  { name: "Chicken Wings", img: "/src/assets/images/chickenwings.png" },
  { name: "Sandwich", img: "/src/assets/images/sandwitch.png" },
  { name: "Garlic Bread", img: "/src/assets/images/Garlicbread.png" },
  { name: "Khichdi", img: "https://img.freepik.com/premium-photo/dal-khichdi-khichadi-tasty-indian-recipe-served-bowl-rustic-wooden-background-food-made-dal-rice-combined-with-whole-spices-onions-garlic-tomatoes-etc-selective-focus_726363-1219.jpg?w=1800" },
];

export default function CategorySlider() {
  const trackRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction = 1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = 300 * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Auto-rotate through each image infinitely
  useEffect(() => {
    // Start immediately
    const startTimer = setTimeout(() => {
      setCurrentIndex(1);
    }, 100);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 1200); // Change every 1.2 seconds

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, []);



  return (
    <section className="category-slider">
      <h3 className="cs-heading">What’s on your mind?</h3>

      <div className="cs-wrapper">
        <button
          className="cs-arrow cs-left"
          aria-label="Scroll left"
          onClick={() => scroll(-1)}
        >
          ‹
        </button>

        <div className="category-marquee">
          <div className="cs-track" ref={trackRef}>
            {[...categories, ...categories, ...categories].map((cat, index) => {
              const adjustedIndex = index % categories.length;
              const position = index - currentIndex;
              const isVisible = position >= -3 && position <= categories.length + 3;
              
              return isVisible ? (
                <div 
                  className={`cs-item ${adjustedIndex === (currentIndex % categories.length) ? 'active' : ''}`} 
                  key={`${cat.name}-${Math.floor(index / categories.length)}-${adjustedIndex}`}
                  style={{
                    transform: `translateX(${position * 138}px)`,
                    transition: currentIndex === 0 ? 'none' : 'transform 0.4s ease-in-out'
                  }}
                >
                  <div className="cs-img">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/src/assets/images/placeholder.png";
                      }}
                    />
                  </div>
                  <div className="cs-label">{cat.name}</div>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <button
          className="cs-arrow cs-right"
          aria-label="Scroll right"
          onClick={() => scroll(1)}
        >
          ›
        </button>
      </div>
    </section>
  );
}
