import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBulkOrder } from '../../services/bulkOrdersService';
import './BulkOrderRequest.css';

const BulkOrderRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Corporate',
    peopleCount: '',
    scheduledDate: '',
    scheduledTime: '',
    address: {
      line1: '',
      city: '',
      pincode: '',
    },
    specialInstructions: '',
  });

  const [items, setItems] = useState([
    { name: '', qty: '', price: '' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', qty: '', price: '' }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateEstimate = () => {
    return items.reduce((sum, item) => {
      const qty = parseInt(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + (qty * price);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validItems = items.filter(item => item.name && item.qty && item.price);
      
      if (validItems.length === 0) {
        alert('Please add at least one item');
        setLoading(false);
        return;
      }

      const orderData = {
        ...formData,
        peopleCount: parseInt(formData.peopleCount),
        items: validItems.map(item => ({
          name: item.name,
          qty: parseInt(item.qty),
          price: parseFloat(item.price),
        })),
      };

      await createBulkOrder(orderData);
      alert('Bulk order request submitted successfully! Admin will review and confirm pricing.');
      navigate('/orders');
    } catch (error) {
      console.error('Submit bulk order error:', error);
      alert('Failed to submit bulk order request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="bulk-order-request">
      <div className="bulk-order-header">
        <h1>🎉 Bulk Order Request</h1>
        <p>For parties, events, and corporate gatherings</p>
      </div>

      <form onSubmit={handleSubmit} className="bulk-order-form">
        <section className="form-section">
          <h2>Event Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Event Name *</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="e.g., Corporate Lunch"
                required
              />
            </div>

            <div className="form-group">
              <label>Event Type *</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                required
              >
                <option value="Corporate">Corporate</option>
                <option value="Birthday">Birthday</option>
                <option value="Wedding">Wedding</option>
                <option value="Party">Party</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Number of People *</label>
              <input
                type="number"
                name="peopleCount"
                value={formData.peopleCount}
                onChange={handleInputChange}
                placeholder="50"
                min="20"
                required
              />
            </div>

            <div className="form-group">
              <label>Scheduled Date * (Min 48 hours ahead)</label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                min={minDateStr}
                required
              />
            </div>

            <div className="form-group">
              <label>Scheduled Time *</label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Menu Selection</h2>
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <input
                type="text"
                placeholder="Item name"
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                min="1"
                required
              />
              <input
                type="number"
                placeholder="Price per item"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                min="0"
                step="0.01"
                required
              />
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)} className="btn-remove">
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItem} className="btn-add-item">
            + Add Item
          </button>
          <div className="estimate">
            <strong>Estimated Total: ₹{calculateEstimate().toFixed(2)}</strong>
            <p className="note">Final price will be confirmed by admin after review</p>
          </div>
        </section>

        <section className="form-section">
          <h2>Delivery Address</h2>
          <div className="form-group">
            <label>Address Line 1 *</label>
            <input
              type="text"
              name="address.line1"
              value={formData.address.line1}
              onChange={handleInputChange}
              placeholder="Building, Street"
              required
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                placeholder="City"
                required
              />
            </div>
            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleInputChange}
                placeholder="560001"
                required
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Special Instructions (Optional)</h2>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleInputChange}
            placeholder="Dietary restrictions, serving preferences, etc."
            rows="4"
          />
        </section>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Submitting...' : 'Submit Bulk Order Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkOrderRequest;
