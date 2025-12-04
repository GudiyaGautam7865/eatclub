import React from "react";
import "./OffersPage.css";

const OfferCard = ({ title, price, imageUrl, variant }) => {
  const cardClass = variant === "special-99" ? "offer-card special-99" : "offer-card";

  return (
    <div className={cardClass}>
      <div className="offer-card-image">
        <img className="offer-img" src={imageUrl} alt={title} />
      </div>
      <div className="offer-card-text">{title}</div>
      {price && <div className="offer-card-price">{price}</div>}
    </div>
  );
};

export default function OffersPage() {
  return (
    <div className="top-offers-section">
      <h2>Top offers today</h2>
      <div className="offers-strip">
        <OfferCard title="BIRYANI" price="₹99" imageUrl="/src/assets/images/biryani.png" />
        <OfferCard title="VALUE FUN PIZZAS" price="₹99" imageUrl="/src/assets/images/pizza.png" />
        <OfferCard title="PROTEIN MEALS" imageUrl="/src/assets/images/protein-meal.png" />
        <OfferCard title="99 MEALS" imageUrl="/src/assets/images/placeholder.png" variant="special-99" />
        <OfferCard title="WHAT'S NEW" imageUrl="/src/assets/images/whats-new.png" />
        <OfferCard title="HAPPY HOURS" price="4-6 PM" imageUrl="/src/assets/images/happy-hour.png" />
        <OfferCard title="BUY ONE GET ONE" price="WEDNESDAY" imageUrl="/src/assets/images/buy-one-get-one.png" />
      </div>
    </div>
  );
}
