import React from "react";
import "./PartyOrderPage.css";

export default function PartyOrderPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main className="party-order-page">
      <section className="party-hero">
        <div className="party-left">
          <h1 className="party-heading">BRING IN THE PARTY!</h1>
          <h2 className="party-subheading">Get 25% OFF on BULK ORDERS</h2>
        </div>
        <div className="party-form-card">
          <h3>BULK ORDER REQUEST</h3>
          <p>Once you submit your request, our team will reach out to you via WhatsApp or call within 60 mins.</p>
          <form onSubmit={handleSubmit}>
            <input className="party-form-field" type="text" placeholder="Name" required />
            <input className="party-form-field" type="tel" placeholder="Mobile" required />
            <input className="party-form-field" type="email" placeholder="Email" required />
            <div className="party-radio-group">
              <label>No. of People</label>
              <div>
                <label><input type="radio" name="people" value="20-40" /> 20–40</label>
                <label><input type="radio" name="people" value="40-60" /> 40–60</label>
                <label><input type="radio" name="people" value="60+" /> 60+</label>
              </div>
            </div>
            <button type="submit" className="party-submit-btn">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  );
}
