import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDriverOrders as apiGetDriverOrders, updateDeliveryStatus as apiUpdateDeliveryStatus, acceptOrder as apiAcceptOrder } from '../services/deliveryService';
import { deliveryPartner as mockPartner, todayStats as mockStats, earnings as mockEarnings } from '../mock/delivery/deliveryData';

const DeliveryContext = createContext();

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};

export const DeliveryProvider = ({ children }) => {
  const [partner, setPartner] = useState(mockPartner);
  const [stats, setStats] = useState(mockStats);
  const [ordersList, setOrdersList] = useState([]);
  const [earningsData, setEarningsData] = useState(mockEarnings);
  const [isOnline, setIsOnline] = useState(mockPartner.isOnline);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiGetDriverOrders();
        const data = res?.data || res || [];
        const mapped = Array.isArray(data)
          ? data.map((o) => {
              // For available orders (READY_FOR_PICKUP), show as 'available'
              // For assigned orders, use deliveryStatus
              let status = 'assigned';
              if (o.status === 'READY_FOR_PICKUP' && !o.driverId) {
                status = 'available';
              } else if (o.deliveryStatus) {
                status = o.deliveryStatus.toLowerCase();
              }
              
              const address = o.address || {};
              const restaurantName = o.restaurantName || 'Restaurant';
              const restaurantAddress = o.restaurantAddress || '';
              return {
                id: o._id || o.id,
                status,
                driverId: o.driverId,
                customerName: address.name || 'Customer',
                customerPhone: address.phone || '',
                restaurantName,
                restaurantAddress,
                deliveryAddress: [address.line1, address.city, address.pincode].filter(Boolean).join(', '),
                paymentMode: o.payment?.method || 'COD',
                orderValue: o.total || 0,
                deliveryFee: o.deliveryFee || 0,
                items: Array.isArray(o.items) ? o.items.map((i) => ({ name: i.name, quantity: i.qty || i.quantity || 1, price: i.price || 0 })) : [],
                coordinates: o.coordinates || { restaurant: {}, delivery: {} },
              };
            })
          : [];
        setOrdersList(mapped);
      } catch (err) {
        console.warn('Falling back to mock delivery orders');
        setOrdersList([]);
      }
    };

    fetchOrders();
    
    // Auto-refresh every 10 seconds to get new available orders
    const interval = setInterval(fetchOrders, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    setPartner(prev => ({ ...prev, isOnline: !isOnline }));
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const normalized = (newStatus || '').toUpperCase();
    await apiUpdateDeliveryStatus(orderId, normalized);
    setOrdersList(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: normalized.toLowerCase() } : order
      )
    );

    if (normalized === 'DELIVERED') {
      setStats(prev => ({
        ...prev,
        completedDeliveries: prev.completedDeliveries + 1,
        pendingDeliveries: Math.max(0, prev.pendingDeliveries - 1)
      }));
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      await apiAcceptOrder(orderId);
      // Refresh orders to get updated data
      const res = await apiGetDriverOrders();
      const data = res?.data || res || [];
      const mapped = Array.isArray(data)
        ? data.map((o) => {
            const status = (o.deliveryStatus || 'ASSIGNED').toLowerCase();
            const address = o.address || {};
            const restaurantName = o.restaurantName || 'Restaurant';
            const restaurantAddress = o.restaurantAddress || '';
            return {
              id: o._id || o.id,
              status,
              driverId: o.driverId,
              customerName: address.name || 'Customer',
              customerPhone: address.phone || '',
              restaurantName,
              restaurantAddress,
              deliveryAddress: [address.line1, address.city, address.pincode].filter(Boolean).join(', '),
              paymentMode: o.payment?.method || 'COD',
              orderValue: o.total || 0,
              deliveryFee: o.deliveryFee || 0,
              items: Array.isArray(o.items) ? o.items.map((i) => ({ name: i.name, quantity: i.qty || i.quantity || 1, price: i.price || 0 })) : [],
              coordinates: o.coordinates || { restaurant: {}, delivery: {} },
            };
          })
        : [];
      setOrdersList(mapped);
    } catch (err) {
      console.error('Failed to accept order:', err);
      throw err;
    }
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