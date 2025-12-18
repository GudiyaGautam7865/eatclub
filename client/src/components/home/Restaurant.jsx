import React, { useEffect, useState } from "react";
import "./Restaurant.css";
import { getProducts } from "../../services/menuService";

function RestaurantCard({ restaurant, onClick }) {
  const handleImageError = (e) => {
    e.target.src = "/src/assets/images/placeholder-restaurant.jpg";
  };

  return (
    <div 
      className="restaurant-card"
      onClick={() => onClick && onClick(restaurant)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(restaurant)}
    >
      <div className="restaurant-image-container">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="restaurant-image"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="delivery-time">
          <span className="delivery-icon">⚡</span>
          <span>{restaurant.deliveryTime}</span>
        </div>
        <div className="restaurant-logo">
          <img 
            src={restaurant.logo} 
            alt={`${restaurant.name} logo`}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      </div>
      
      <div className="restaurant-info">
        <h3 className="restaurant-name">{restaurant.name}</h3>
        <p className="restaurant-description">{restaurant.description}</p>
        <div className="restaurant-offer">
          <span className="offer-icon">💰</span>
          <span className="offer-text">{restaurant.offer}</span>
        </div>
      </div>
    </div>
  );
}

export default function Restaurant({ onRestaurantClick }) {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const load = async () => {
      const products = await getProducts();
      // normalize into card data structure
      const cards = products.map((p) => ({
        id: p.id, // productId used for routing
        name: p.name,
        description: p.tagline || "",
        deliveryTime: "15-25 mins",
        offer: "Specials available",
        image: p.image || "/src/assets/images/placeholder-restaurant.jpg",
        logo: p.image || "",
        rating: 4.2,
      }));
      setRestaurants(cards);
    };
    load();
  }, []);

  const handleRestaurantClick = (restaurant) => {
    if (onRestaurantClick) {
      onRestaurantClick(restaurant);
    }
  };

  return (
    <section className="restaurants-section">
      <div className="restaurants-header">
        <h2 className="restaurants-title">Restaurants</h2>
      </div>
      
      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <RestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant}
            onClick={handleRestaurantClick}
          />
        ))}
      </div>
    </section>
  );
}