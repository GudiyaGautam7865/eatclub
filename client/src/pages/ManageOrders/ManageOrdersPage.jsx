import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageOrdersPage.css";
import OrderCard from "../../components/orders/OrderCard";

const DUMMY_ORDERS = [
  {
    id: "EC123456",
    restaurantName: "BOX8 - Desi Meals",
    status: "DELIVERED",
    totalAmount: 349,
    itemSummary: "2 items · Paneer Tikka, Butter Naan",
    placedAt: "2025-12-03T18:23:00Z",
    deliveredAt: "2025-12-03T19:05:00Z",
    addressShort: "Pimple Saudagar, Pune"
  },
  {
    id: "EC123457",
    restaurantName: "Mojo Pizza",
    status: "OUT_FOR_DELIVERY",
    totalAmount: 599,
    itemSummary: "3 items · Margherita Pizza, Garlic Bread, Coke",
    placedAt: "2025-12-03T20:15:00Z",
    deliveredAt: null,
    addressShort: "Koregaon Park, Pune"
  },
  {
    id: "EC123458",
    restaurantName: "ZAZA Mughal Biryani",
    status: "PREPARING",
    totalAmount: 450,
    itemSummary: "1 item · Chicken Biryani",
    placedAt: "2025-12-03T19:45:00Z",
    deliveredAt: null,
    addressShort: "Baner, Pune"
  },
  {
    id: "EC123459",
    restaurantName: "NH1 Bowls",
    status: "DELIVERED",
    totalAmount: 280,
    itemSummary: "2 items · Rajma Bowl, Jeera Rice",
    placedAt: "2025-12-02T13:30:00Z",
    deliveredAt: "2025-12-02T14:15:00Z",
    addressShort: "Wakad, Pune"
  },
  {
    id: "EC123460",
    restaurantName: "Boom Sandwich",
    status: "CANCELLED",
    totalAmount: 180,
    itemSummary: "1 item · Grilled Sandwich",
    placedAt: "2025-12-01T16:20:00Z",
    deliveredAt: null,
    addressShort: "Hinjewadi, Pune"
  }
];

export default function ManageOrdersPage() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const ongoingStatuses = ["PLACED", "PREPARING", "OUT_FOR_DELIVERY"];
  const pastStatuses = ["DELIVERED", "CANCELLED"];

  const ongoingOrders = DUMMY_ORDERS.filter(order => ongoingStatuses.includes(order.status));
  const pastOrders = DUMMY_ORDERS.filter(order => pastStatuses.includes(order.status));

  const currentOrders = activeTab === "ongoing" ? ongoingOrders : pastOrders;

  const handleOrderNow = () => {
    navigate("/menu");
  };

  return (
    <main className="manage-orders-page">
      <div className="manage-orders-container">
        <header className="manage-orders-header">
          <h1 className="manage-orders-title">Manage Orders</h1>
          <p className="manage-orders-subtitle">Track your ongoing orders and reorder your favourites.</p>
          
          <div className="manage-orders-tabs">
            <button
              className={`tab-button ${activeTab === "ongoing" ? "active" : ""}`}
              onClick={() => setActiveTab("ongoing")}
            >
              Ongoing
            </button>
            <button
              className={`tab-button ${activeTab === "past" ? "active" : ""}`}
              onClick={() => setActiveTab("past")}
            >
              Past
            </button>
          </div>
        </header>

        <section className="manage-orders-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : currentOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">
                <div className="empty-circle">📦</div>
              </div>
              <h3 className="empty-title">
                {activeTab === "ongoing" ? "No ongoing orders" : "No past orders"}
              </h3>
              <p className="empty-subtitle">
                {activeTab === "ongoing" 
                  ? "You don't have any ongoing orders right now. Place your first order!"
                  : "You haven't placed any orders yet. Start exploring our delicious menu!"
                }
              </p>
              <button className="empty-cta" onClick={handleOrderNow}>
                Order Now
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {currentOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}