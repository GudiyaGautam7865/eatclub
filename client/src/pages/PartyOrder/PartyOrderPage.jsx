import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PartyOrderPage.css";
import { createBulkOrder } from "../../services/bulkOrdersService";

export default function PartyOrderPage() {
  const navigate = useNavigate();
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
      const eventDate = new Date(formData.eventDateTime);
      const scheduledDate = eventDate.toISOString().split('T')[0];
      const scheduledTime = eventDate.toTimeString().slice(0, 5);

      // Build items description (NO PRICE - admin will set it)
      const itemsDescription = [];
      if (formData.brandPreference) {
        itemsDescription.push(`Preferred Brand: ${formData.brandPreference}`);
      }
      if (formData.budgetPerHead) {
        itemsDescription.push(`Budget per person: ₹${formData.budgetPerHead}`);
      }
      
      const orderData = {
        eventName: `${formData.name}'s Event`,
        eventType: 'Party',
        peopleCount: parseInt(formData.peopleCount),
        scheduledDate,
        scheduledTime,
        items: [{
          name: itemsDescription.length > 0 ? itemsDescription.join(', ') : 'Bulk Order Items',
          qty: parseInt(formData.peopleCount),
          price: 0,  // Price will be set by admin
        }],
        address: {
          line1: formData.address,
          city: '',
          pincode: '',
        },
        specialInstructions: `Contact: ${formData.phone}${formData.email ? ', Email: ' + formData.email : ''}${formData.notes ? '. Notes: ' + formData.notes : ''}`,
      };

      await createBulkOrder(orderData);

      setSuccessMessage("Your bulk order request has been submitted successfully! Our team will review and confirm pricing within 24 hours.");

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

      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error("Error creating bulk order:", error);
      const errorMsg = error.message || "Failed to submit bulk order. Please try again.";
      setErrorMessage(errorMsg);
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
              <label htmlFor="peopleCount">No. of People</label>
              <input
                className="party-form-field"
                type="number"
                name="peopleCount"
                id="peopleCount"
                placeholder="Enter number of people"
                min="1"
                value={formData.peopleCount}
                onChange={handleInputChange}
                required
              />
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
              min="0"
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

