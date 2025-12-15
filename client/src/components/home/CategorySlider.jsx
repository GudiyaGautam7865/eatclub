// import React, { useRef } from "react";
// import "./CategorySlider.css";

// const categories = [
//   { name: "Biryani", img: "../../assets/images/Biryani.png" },
//   { name: "Burger", img: "../../assets/images/box8-desi.jpg" },
//   { name: "Chinese", img: "../../assets/images/chickenwings.png" },
//   { name: "Pizza", img: "../../assets/images/foodbowl.png" },
//   { name: "Rolls", img: "../../assets/images/Garlicbread.png" },
//   { name: "North Indian", img: "../../assets/images/pizza.png" },
//   { name: "Cake", img: "../../assets/images/protein-meal.png" },

//   { name: "Shawarma", img: "../../assets/images/rolls.png" },
//   { name: "Pav Bhaji", img: "../../assets/images/scan.png" },
//   { name: "Noodles", img: "../../assets/images/thali.png" },
//   { name: "Pasta", img: "../../assets/images/" },
//   { name: "South Indian", img: "/images/south-indian.png" },
//   { name: "Shake", img: "/images/shake.png" },
//   { name: "Salad", img: "/images/salad.png" },
// ];

// export default function CategorySection() {
//   const scrollRef = useRef(null);

//   const scroll = (dir) => {
//     scrollRef.current.scrollBy({
//       left: dir * 420,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <section className="swiggy-cat-section">
//       <div className="swiggy-header">
//         <h2>Order our best food options</h2>

//         <div className="swiggy-arrows">
//           <button onClick={() => scroll(-1)}>‹</button>
//           <button onClick={() => scroll(1)}>›</button>
//         </div>
//       </div>

//       <div className="swiggy-scroll" ref={scrollRef}>
//         <div className="swiggy-grid">
//           {categories.map((item, i) => (
//             <div className="swiggy-item" key={i}>
//               <img src={item.img} alt={item.name} />
//               <p>{item.name}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }



import React, { useRef, useEffect } from "react";
import "./CategorySlider.css";

const categories = [
  { name: "Pizza", img: "/src/assets/images/CategorySlider/Salad.avif" },
  { name: "Biryani", img: "/src/assets/images/CategorySlider/Pav Bhaji.avif" },
  { name: "Rolls", img: "/src/assets/images/CategorySlider/Pasta.avif" },
  { name: "Bowl", img: "/src/assets/images/CategorySlider/Paratha.avif" },
  { name: "Thali", img: "/src/assets/images/CategorySlider/North Indian.avif" },
  { name: "ThinCrust", img: "/src/assets/images/CategorySlider/Dosa.avif" },
  { name: "Chicken Wings", img: "/src/assets/images/CategorySlider/Cake.avif" },
  { name: "Sandwich", img: "/src/assets/images/CategorySlider/Burger.avif" },
  { name: "Garlic Bread", img: "/src/assets/images/CategorySlider/Biryani.avif" },
  { name: "Khichdi", img: "/src/assets/images/Khichdi.avif" },
];

export default function CategorySlider() {
  const trackRef = useRef(null);
  const translateX = useRef(0);
  const animationId = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.4; // ⭐ smooth speed

    const animate = () => {
      translateX.current -= speed;

      // infinite reset (half width because duplicated)
      if (Math.abs(translateX.current) >= track.scrollWidth / 2) {
        translateX.current = 0;
      }

      track.style.transform = `translateX(${translateX.current}px)`;
      animationId.current = requestAnimationFrame(animate);
    };

    animationId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId.current);
  }, []);

  const scroll = (dir) => {
    translateX.current += dir * 140;
  };

  return (
    <section className="category-slider">
      <h3 className="cs-heading">What’s on your mind?</h3>

      <div className="cs-wrapper">
        {/* <button className="cs-arrow cs-left" onClick={() => scroll(-1)}>‹</button> */}

        <div className="category-marquee">
          <div className="cs-track marquee-track" ref={trackRef}>
            {[...categories, ...categories].map((cat, i) => (
              <div className="cs-item" key={i}>
                <div className="cs-img">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    onError={(e) => {
                      e.currentTarget.src = "/src/assets/images/placeholder.png";
                    }}
                  />
                </div>
                <div className="cs-label">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* <button className="cs-arrow cs-right" onClick={() => scroll(1)}>›</button> */}
      </div>
    </section>
  );
}
