import React from "react";
import "./Restaurant.css";

const restaurants = [
  {
    id: 1,
    name: "BOX8 - Desi Meals",
    description: "India's Largest Desi Meals Brand",
    deliveryTime: "15 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/1_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/1",
    rating: 4.2
  },
  {
    id: 2,
    name: "LeanCrust Pizza",
    description: "The Thin Crust Experts",
    deliveryTime: "19 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/20_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/20",
    rating: 4.5
  },
  {
    id: 3,
    name: "ZAZA Mughal Biryani",
    description: "India's Most Flavourful Biryani",
    deliveryTime: "15 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/22_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/22",
    rating: 4.3
  },
  {
    id: 4,
    name: "WeFit - Protein Meals",
    description: "Upto 74 gm Protein in Bowls,Salads & Sandwiches",
    deliveryTime: "12 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/25_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/25",
    rating: 4.1
  },
  {
    id: 5,
    name: "MOJO Pizza- 2X Toppings",
    description: "India’s Highest Rated Pizza Delivery Chain",
    deliveryTime: "18 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/13_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/13",
    rating: 4.0
  },
  {
    id: 6,
    name: "NH1 Bowls",
    description: "Highway to North! Real North-Undian Taste.",
    deliveryTime: "20 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/16_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/16",
    rating: 4.2
  },
  {
    id: 7,
    name: "Daily Kitchen-Homely Meals",
    description: "Mom-Style Homely Meals That You Can Have Daily",
    deliveryTime: "14 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/31_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/31",
    rating: 4.4
  },
  {
    id: 8,
    name: "The Ghee Khichdi Project",
    description: "Comforting, Wholesome & Made with 100% Pure Ghee",
    deliveryTime: "16 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/37_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/37",
    rating: 4.1
  }, 
  {
    id: 10,
    name: "Mealful Rolls",
    description: "India's Biggest Rolls",
    deliveryTime: "25 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/26_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/15",
    rating: 4.0
  },
  {
    id: 9,
    name: "BOOM Sandwich",
    description: "Sub Style Sandwiches,Freshly Made",
    deliveryTime: "22 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/15_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/26",
    rating: 4.3
  },
 
  {
    id: 10,
    name: "Bhatti Chicken",
    description: "Grilled in a Bhatti,Not Fried",
    deliveryTime: "25 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/26_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/24",
    rating: 4.0
  },
  {
    id: 11,
    name: "Itiminaan Matka Biriyani",
    description: "Slow,Cooked & Served in an Earthen Matka",
    deliveryTime: "10 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/24_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/14",
    rating: 4.6
  },
  {
    id: 12,
    name: "Globo Ice Creams",
    description: "Ice Creams of the World.Taste That Teleports You.",
    deliveryTime: "17 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/14_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/21",
    rating: 4.4
  },
  {
    id: 13,
    name: "Hola Pasta",
    description: "Fresh Gourmet Pasta.",
    deliveryTime: "13 mins",
    offer: "30% Off + ZERO Extra Fees",
    image: "https://assets.box8.co.in/rectangle-19x10/xhdpi/brand/21_disabled",
    logo: "https://assets.box8.co.in/icon/web/brand/27",
    rating: 4.2
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

export default function Restaurant({ onRestaurantClick }) {
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