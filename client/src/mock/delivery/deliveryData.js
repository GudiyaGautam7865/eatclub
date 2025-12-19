// Mock data for delivery dashboard
export const deliveryPartner = {
  id: 'DP001',
  name: 'Rajesh Kumar',
  phone: '+91 9876543210',
  email: 'rajesh.kumar@delivery.com',
  vehicleType: 'Bike',
  vehicleNumber: 'MH12AB1234',
  profilePhoto: 'https://via.placeholder.com/100',
  isOnline: true,
  rating: 4.8,
  totalDeliveries: 1247,
  joinedDate: '2023-01-15'
};

export const todayStats = {
  totalDeliveries: 8,
  pendingDeliveries: 2,
  completedDeliveries: 6,
  earningsToday: 450,
  totalDistance: 45.2
};

export const orders = [
  {
    id: 'ORD001',
    customerId: 'CUST001',
    customerName: 'Priya Sharma',
    customerPhone: '+91 9876543211',
    restaurantName: 'Domino\'s Pizza',
    restaurantAddress: '123 MG Road, Pune, Maharashtra 411001',
    restaurantPhone: '+91 9876543212',
    deliveryAddress: '456 FC Road, Pune, Maharashtra 411004',
    paymentMode: 'Online',
    orderValue: 650,
    deliveryFee: 40,
    status: 'assigned',
    orderTime: '2024-01-15T14:30:00Z',
    estimatedDeliveryTime: '2024-01-15T15:15:00Z',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 350 },
      { name: 'Garlic Bread', quantity: 2, price: 150 }
    ],
    coordinates: {
      restaurant: { lat: 18.5204, lng: 73.8567 },
      delivery: { lat: 18.5074, lng: 73.8077 }
    }
  },
  {
    id: 'ORD002',
    customerId: 'CUST002',
    customerName: 'Amit Patel',
    customerPhone: '+91 9876543213',
    restaurantName: 'McDonald\'s',
    restaurantAddress: '789 Camp Road, Pune, Maharashtra 411001',
    restaurantPhone: '+91 9876543214',
    deliveryAddress: '321 Koregaon Park, Pune, Maharashtra 411001',
    paymentMode: 'COD',
    orderValue: 420,
    deliveryFee: 30,
    status: 'picked',
    orderTime: '2024-01-15T13:45:00Z',
    estimatedDeliveryTime: '2024-01-15T14:30:00Z',
    items: [
      { name: 'Big Mac Meal', quantity: 1, price: 280 },
      { name: 'McFlurry', quantity: 1, price: 140 }
    ],
    coordinates: {
      restaurant: { lat: 18.5314, lng: 73.8446 },
      delivery: { lat: 18.5362, lng: 73.8947 }
    }
  },
  {
    id: 'ORD003',
    customerId: 'CUST003',
    customerName: 'Sneha Joshi',
    customerPhone: '+91 9876543215',
    restaurantName: 'KFC',
    restaurantAddress: '555 Baner Road, Pune, Maharashtra 411045',
    restaurantPhone: '+91 9876543216',
    deliveryAddress: '777 Wakad, Pune, Maharashtra 411057',
    paymentMode: 'Online',
    orderValue: 580,
    deliveryFee: 45,
    status: 'on_the_way',
    orderTime: '2024-01-15T12:30:00Z',
    estimatedDeliveryTime: '2024-01-15T13:15:00Z',
    items: [
      { name: 'Zinger Burger Meal', quantity: 2, price: 580 }
    ],
    coordinates: {
      restaurant: { lat: 18.5679, lng: 73.7811 },
      delivery: { lat: 18.5975, lng: 73.7898 }
    }
  }
];

export const earnings = {
  today: {
    totalEarnings: 450,
    deliveryFees: 280,
    tips: 50,
    incentives: 120,
    completedOrders: 6
  },
  weekly: {
    totalEarnings: 3200,
    deliveryFees: 2100,
    tips: 400,
    incentives: 700,
    completedOrders: 42
  },
  monthly: {
    totalEarnings: 12800,
    deliveryFees: 8400,
    tips: 1600,
    incentives: 2800,
    completedOrders: 168
  }
};

export const orderStatuses = {
  assigned: { label: 'Assigned', color: '#ff9800', bgColor: '#fff3e0' },
  picked: { label: 'Picked Up', color: '#2196f3', bgColor: '#e3f2fd' },
  on_the_way: { label: 'On the Way', color: '#9c27b0', bgColor: '#f3e5f5' },
  delivered: { label: 'Delivered', color: '#4caf50', bgColor: '#e8f5e8' },
  cancelled: { label: 'Cancelled', color: '#f44336', bgColor: '#ffebee' }
};