import React, { useState } from "react";
import "./MembershipPlans.css";

function MembershipPlans() {
  const [selectedPlan, setSelectedPlan] = useState("12months");

  const plans = [
    {
      id: "6months",
      duration: "6 months",
      price: "FREE",
      originalPrice: null,
      badge: "Already in cart",
    },
    {
      id: "12months",
      duration: "12 months",
      price: "₹9",
      originalPrice: "₹199",
      badge: "Recommended",
    },
  ];

  const benefits = [
    "No HIDDEN fees EVER",
    "Save 30% Everytime",
    "Handpicked brands ONLY",
  ];

  return (
    <section className="membership-plans-section">
      <div className="membership-container">
        <div className="membership-header">
          <p className="select-your-text">Select Your</p>
          <h2 className="eatclub-membership-title">EatClub Membership</h2>
        </div>

        <div className="benefits-box">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="benefit-item">
              <span className="benefit-checkmark">✓</span>
              <span className="benefit-text">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${selectedPlan === plan.id ? "selected" : ""}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}

              <div className="plan-radio-container">
                <div className="radio-circle">
                  <span className="radio-inner">✓</span>
                </div>
              </div>

              <div className="plan-content">
                <div className="plan-price-row">
                  <span className="plan-price">{plan.price}</span>
                  {plan.originalPrice && (
                    <span className="plan-original-price">{plan.originalPrice}</span>
                  )}
                </div>
                <div className="plan-duration">{plan.duration}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="membership-info">
          1M+ users are enjoying EatClub. It's your turn now!
        </p>

        <button className="apply-button">
          Apply EatClub Membership
        </button>
      </div>
    </section>
  );
}

export default MembershipPlans;