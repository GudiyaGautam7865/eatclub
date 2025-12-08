// Admin Menu Management Service
// Dummy data for now - replace with actual API calls later

export async function getAdminMenuItems() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Butter Chicken',
          category: 'Curries',
          price: 299,
          status: 'active',
          brand: 'box8',
        },
        {
          id: 2,
          name: 'Paneer Tikka Masala',
          category: 'Curries',
          price: 279,
          status: 'active',
          brand: 'box8',
        },
        {
          id: 3,
          name: 'Chicken Biryani',
          category: 'Rice',
          price: 349,
          status: 'active',
          brand: 'behrouz',
        },
        {
          id: 4,
          name: 'Dal Makhani',
          category: 'Curries',
          price: 229,
          status: 'inactive',
          brand: 'box8',
        },
      ]);
    }, 500);
  });
}

export async function createAdminMenuItem(item) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random(),
        ...item,
        createdAt: new Date().toISOString(),
      });
    }, 500);
  });
}

export async function updateAdminMenuItem(id, item) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        ...item,
        updatedAt: new Date().toISOString(),
      });
    }, 500);
  });
}

export async function deleteAdminMenuItem(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, id });
    }, 500);
  });
}
