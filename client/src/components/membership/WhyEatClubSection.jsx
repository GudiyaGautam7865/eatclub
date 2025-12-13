import React from "react";
import "./WhyEatClubSection.css";

function WhyEatClubSection() {
  const features = [
    {
      id: 1,
      icon: "💯",
      title: "Flat 30% OFF Everytime",
      description: "No ifs & buts. 30% OFF means 30% OFF. No max discount cap.",
    },
    {
      id: 2,
      icon: "🎁",
      title: "ZERO Delivery/Packaging Fees",
      description: "Just pay for what you eat. No Delivery, Packaging, or Surge Charges.",
    },
    {
      id: 3,
      icon: "🍴",
      title: "Handpicked Brands ONLY",
      description:
        "Select from our curated list. No more scrolling endlessly through restaurant listings.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="membership-hero">
        <div className="hero-content">
          <p className="hero-welcome">Welcome to</p>
          <div className="hero-logo">
            <span className="logo-text">EATCLUB</span>
          </div>
        </div>
      </section>

      {/* Why EatClub Section */}
      <section className="why-eatclub-section">
        <div className="why-eatclub-container">
          {/* Header Section */}
          <div className="why-eatclub-header">
            <h1 className="why-eatclub-title">Why EatClub?</h1>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                {/* Wrapped text in div for vertical alignment control */}
                <div className="feature-text-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default WhyEatClubSection;