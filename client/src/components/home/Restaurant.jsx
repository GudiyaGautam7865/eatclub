import React from "react";
import "./Restaurant.css";

const restaurants = [
  {
    id: 1,
    name: "BOX8 - Desi Meals",
    description: "India's Largest Desi Meals Brand",
    deliveryTime: "15 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/box8-logo.png",
    rating: 4.2
  },
  {
    id: 2,
    name: "LeanCrust Pizza",
    description: "The Thin Crust Experts",
    deliveryTime: "19 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/leancrust-logo.png",
    rating: 4.5
  },
  {
    id: 3,
    name: "ZAZA Mughal Biryani",
    description: "India's Most Flavourful Biryani",
    deliveryTime: "15 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/zaza-logo.png",
    rating: 4.3
  },
  {
    id: 4,
    name: "McDonald's",
    description: "Burgers, Fries & More",
    deliveryTime: "12 mins",
    offer: "25% Off + Free Delivery",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/mcdonalds-logo.png",
    rating: 4.1
  },
  {
    id: 5,
    name: "KFC",
    description: "Finger Lickin' Good",
    deliveryTime: "18 mins",
    offer: "40% Off + ZERO Extra Fees",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/kfc-logo.png",
    rating: 4.0
  },
  {
    id: 6,
    name: "Domino's Pizza",
    description: "Pizza Delivery Experts",
    deliveryTime: "20 mins",
    offer: "Buy 1 Get 1 Free",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/dominos-logo.png",
    rating: 4.2
  },
  {
    id: 7,
    name: "Subway",
    description: "Eat Fresh Sandwiches",
    deliveryTime: "14 mins",
    offer: "20% Off + Free Cookie",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/subway-logo.png",
    rating: 4.4
  },
  {
    id: 8,
    name: "Burger King",
    description: "Have It Your Way",
    deliveryTime: "16 mins",
    offer: "35% Off + ZERO Extra Fees",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/bk-logo.png",
    rating: 4.1
  },
  {
    id: 9,
    name: "Taco Bell",
    description: "Mexican Inspired Food",
    deliveryTime: "22 mins",
    offer: "30% Off + Free Nachos",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/taco-logo.png",
    rating: 4.3
  },
  {
    id: 10,
    name: "Pizza Hut",
    description: "No One OutPizzas The Hut",
    deliveryTime: "25 mins",
    offer: "50% Off + Free Garlic Bread",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/pizzahut-logo.png",
    rating: 4.0
  },
  {
    id: 11,
    name: "Starbucks",
    description: "Coffee & More",
    deliveryTime: "10 mins",
    offer: "Buy 2 Get 1 Free",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/starbucks-logo.png",
    rating: 4.6
  },
  {
    id: 12,
    name: "Haldiram's",
    description: "Traditional Indian Sweets",
    deliveryTime: "17 mins",
    offer: "25% Off + Free Delivery",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/haldirams-logo.png",
    rating: 4.4
  },
  {
    id: 13,
    name: "Wow! Momo",
    description: "Steamed & Fried Momos",
    deliveryTime: "13 mins",
    offer: "40% Off + ZERO Extra Fees",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/wow-logo.png",
    rating: 4.2
  },
  {
    id: 14,
    name: "Faasos",
    description: "Wraps & Rolls Specialist",
    deliveryTime: "21 mins",
    offer: "30% Off + Free Drink",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/faasos-logo.png",
    rating: 4.1
  },
  {
    id: 15,
    name: "Behrouz Biryani",
    description: "Royal Biryani Experience",
    deliveryTime: "24 mins",
    offer: "45% Off + ZERO Extra Fees",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop",
    logo: "/src/assets/images/behrouz-logo.png",
    rating: 4.5
  }
];

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

export default function Restaurant() {
  const handleRestaurantClick = (restaurant) => {
    console.log('Restaurant clicked:', restaurant);
    // Add navigation logic here
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