// Admin Orders Management Service
// Dummy data for now - replace with actual API calls later

export async function getAdminSingleOrders() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'ORD-001',
          customerName: 'John Doe',
          items: 3,
          total: 849,
          status: 'pending',
          date: '2025-12-08',
        },
        {
          id: 'ORD-002',
          customerName: 'Jane Smith',
          items: 2,
          total: 599,
          status: 'processing',
          date: '2025-12-08',
        },
        {
          id: 'ORD-003',
          customerName: 'Mike Johnson',
          items: 4,
          total: 1199,
          status: 'completed',
          date: '2025-12-07',
        },
        {
          id: 'ORD-004',
          customerName: 'Sarah Williams',
          items: 2,
          total: 599,
          status: 'pending',
          date: '2025-12-08',
        },
      ]);
    }, 500);
  });
}

export async function getAdminBulkOrders() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'BULK-001',
          companyName: 'ABC Corp',
          items: 50,
          total: 12500,
          status: 'pending',
          date: '2025-12-08',
        },
        {
          id: 'BULK-002',
          companyName: 'XYZ Ltd',
          items: 100,
          total: 24900,
          status: 'processing',
          date: '2025-12-08',
        },
        {
          id: 'BULK-003',
          companyName: 'Tech Solutions Inc',
          items: 75,
          total: 18750,
          status: 'completed',
          date: '2025-12-07',
        },
      ]);
    }, 500);
  });
}

export async function updateOrderStatus(orderId, status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        orderId,
        status,
        updatedAt: new Date().toISOString(),
      });
    }, 500);
  });
}

export async function getSingleOrderDetails(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: orderId,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+91-9876543210',
        items: [
          { name: 'Butter Chicken', qty: 1, price: 299 },
          { name: 'Rice', qty: 1, price: 200 },
          { name: 'Naan', qty: 2, price: 100 },
        ],
        subtotal: 699,
        tax: 125,
        delivery: 50,
        total: 849,
        status: 'pending',
        createdAt: '2025-12-08T10:30:00Z',
      });
    }, 500);
  });
}
