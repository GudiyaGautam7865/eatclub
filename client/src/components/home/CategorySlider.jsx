import React, { useRef } from "react";
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
  { name: "Garlic Bread", img: "/src/assets/images/garlic-bread.png" },
  { name: "Khichdi", img: "/src/assets/images/khichdi.png" },
];

export default function CategorySlider() {
  const trackRef = useRef(null);

  const scroll = (direction = 1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = 300 * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

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

        <div className="cs-track" ref={trackRef}>
          {categories.map((cat) => (
            <div className="cs-item" key={cat.name}>
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
          ))}
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
