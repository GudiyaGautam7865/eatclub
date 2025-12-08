import React, { useState } from "react";
import "./PartyOrderPage.css";
import { createBulkOrder } from "../../services/bulkOrdersService";

export default function PartyOrderPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    peopleCount: "",
    eventDateTime: "",
    address: "",
    brandPreference: "",
    budgetPerHead: "",
    notes: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Basic validation
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your phone number");
      return;
    }
    if (!formData.peopleCount) {
      setErrorMessage("Please select number of people");
      return;
    }
    if (!formData.eventDateTime) {
      setErrorMessage("Please select event date and time");
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage("Please enter delivery address");
      return;
    }

    try {
      // Create bulk order
      const orderData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        peopleCount: formData.peopleCount,
        eventDateTime: formData.eventDateTime,
        address: formData.address,
        brandPreference: formData.brandPreference,
        budgetPerHead: formData.budgetPerHead,
        notes: formData.notes,
      };

      await createBulkOrder(orderData);

      // Show success message
      setSuccessMessage("Your bulk order request has been submitted successfully! Our team will reach out to you shortly.");

      // Clear form
      setFormData({
        name: "",
        phone: "",
        email: "",
        peopleCount: "",
        eventDateTime: "",
        address: "",
        brandPreference: "",
        budgetPerHead: "",
        notes: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error creating bulk order:", error);
      setErrorMessage("Failed to submit bulk order. Please try again.");
    }
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

          {successMessage && <div className="party-message success">{successMessage}</div>}
          {errorMessage && <div className="party-message error">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            <input
              className="party-form-field"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              className="party-form-field"
              type="tel"
              name="phone"
              placeholder="Mobile"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <input
              className="party-form-field"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />

            <div className="party-radio-group">
              <label>No. of People</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="peopleCount"
                    value="20-40"
                    checked={formData.peopleCount === "20-40"}
                    onChange={handleInputChange}
                  />{" "}
                  20–40
                </label>
                <label>
                  <input
                    type="radio"
                    name="peopleCount"
                    value="40-60"
                    checked={formData.peopleCount === "40-60"}
                    onChange={handleInputChange}
                  />{" "}
                  40–60
                </label>
                <label>
                  <input
                    type="radio"
                    name="peopleCount"
                    value="60+"
                    checked={formData.peopleCount === "60+"}
                    onChange={handleInputChange}
                  />{" "}
                  60+
                </label>
              </div>
            </div>

            <input
              className="party-form-field"
              type="datetime-local"
              name="eventDateTime"
              placeholder="Event Date & Time"
              value={formData.eventDateTime}
              onChange={handleInputChange}
              required
            />

            <input
              className="party-form-field"
              type="text"
              name="address"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />

            <input
              className="party-form-field"
              type="text"
              name="brandPreference"
              placeholder="Brand Preference (Optional)"
              value={formData.brandPreference}
              onChange={handleInputChange}
            />

            <input
              className="party-form-field"
              type="number"
              name="budgetPerHead"
              placeholder="Budget Per Head (₹)"
              value={formData.budgetPerHead}
              onChange={handleInputChange}
            />

            <textarea
              className="party-form-field"
              name="notes"
              placeholder="Additional Notes (Optional)"
              rows="3"
              value={formData.notes}
              onChange={handleInputChange}
            />

            <button type="submit" className="party-submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

