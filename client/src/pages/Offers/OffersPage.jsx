import React, { useState } from "react";
import "./OffersPage.css";

const OffersPage = () => {
  const [activeTab, setActiveTab] = useState("All Offers");
  const [copyMessage, setCopyMessage] = useState("");

  const offers = [
    {
      id: 1,
      category: "For New Users",
      title: "50% OFF on first 3 Orders + ZERO Extra Fees",
      code: "FIRST3",
      type: "flat"
    },
    {
      id: 2,
      category: "For All Users",
      title: "Get Free Delivery",
      code: "FREEDEL",
      type: "flat"
    },
    {
      id: 3,
      category: "For All Users",
      title: "Flat 50% OFF upto ₹100",
      code: "CC50",
      type: "flat"
    }
  ];

  const paymentPartners = [
    {
      id: 1,
      logo: "LAZYPAY",
      title: "Assured ₹20-150 Cashback",
      description: "Valid on top of all offers",
      validity: "VALIDITY: 31 DEC 2025"
    },
    {
      id: 2,
      logo: "PAYTM",
      title: "Flat ₹10 Cashback",
      description: "Valid once/user on top of all offers",
      validity: "VALIDITY: 31 DEC 2025"
    }
  ];

  const tabs = ["All Offers", "Flat OFF", "Payment Partners"];

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopyMessage(`${code} copied to clipboard!`);
    setTimeout(() => setCopyMessage(""), 2000);
  };

  return (
    <div className="offers-page">
      <div className="hero-section">
        <h1>Offers & Deals</h1>
      </div>
      
      <div className="offers-content">
        {copyMessage && <div className="copy-message">{copyMessage}</div>}
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "All Offers" || activeTab === "Flat OFF" ? (
          <div className="offers-section">
            <h2>Flat OFF</h2>
            <div className="offers-grid">
              {offers.map(offer => (
                <div key={offer.id} className="offer-card" onClick={() => copyCode(offer.code)}>
                  <div className="offer-icon">
                    <span>%</span>
                  </div>
                  <div className="offer-category">{offer.category}</div>
                  <div className="offer-title">{offer.title}</div>
                  <div className="offer-code">{offer.code}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "All Offers" || activeTab === "Payment Partners" ? (
          <div className="payment-section">
            <h2>Payment Partners</h2>
            <p className="payment-subtitle">Discount auto-applies upon payment</p>
            <div className="payment-grid">
              {paymentPartners.map(partner => (
                <div key={partner.id} className="payment-card">
                  <div className="payment-logo">{partner.logo}</div>
                  <div className="payment-content">
                    <h3>{partner.title}</h3>
                    <p>{partner.description}</p>
                    <span className="validity">{partner.validity}</span>
                  </div>
                  <div className="arrow">›</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OffersPage;