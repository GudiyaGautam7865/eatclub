import React, { createContext, useContext, useState, useEffect } from 'react';
import { deliveryPartner, todayStats, orders, earnings } from '../mock/delivery/deliveryData';

const DeliveryContext = createContext();

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};

export const DeliveryProvider = ({ children }) => {
  const [partner, setPartner] = useState(deliveryPartner);
  const [stats, setStats] = useState(todayStats);
  const [ordersList, setOrdersList] = useState(orders);
  const [earningsData, setEarningsData] = useState(earnings);
  const [isOnline, setIsOnline] = useState(deliveryPartner.isOnline);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    setPartner(prev => ({ ...prev, isOnline: !isOnline }));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrdersList(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    // Update stats when order is completed
    if (newStatus === 'delivered') {
      setStats(prev => ({
        ...prev,
        completedDeliveries: prev.completedDeliveries + 1,
        pendingDeliveries: Math.max(0, prev.pendingDeliveries - 1)
      }));
    }
  };

  const acceptOrder = (orderId) => {
    updateOrderStatus(orderId, 'picked');
  };

  const rejectOrder = (orderId) => {
    setOrdersList(prev => prev.filter(order => order.id !== orderId));
    setStats(prev => ({
      ...prev,
      pendingDeliveries: Math.max(0, prev.pendingDeliveries - 1)
    }));
  };

  const value = {
    partner,
    stats,
    ordersList,
    earningsData,
    isOnline,
    toggleOnlineStatus,
    updateOrderStatus,
    acceptOrder,
    rejectOrder
  };

  return (
    <DeliveryContext.Provider value={value}>
      {children}
    </DeliveryContext.Provider>
  );
};