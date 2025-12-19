// Test script to verify admin status update flow
// Run with: node test-admin-status.js

const BASE_URL = 'http://localhost:5000/api';

async function testFlow() {
  console.log('🔵 Step 1: Admin Login');
  const loginRes = await fetch(`${BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@gmail.com',
      password: '1260'
    })
  });
  
  const loginData = await loginRes.json();
  console.log('Login Response:', loginData);
  
  if (!loginData.success) {
    console.error('❌ Admin login failed');
    return;
  }
  
  const adminToken = loginData.data.token;
  console.log('✅ Admin token:', adminToken.substring(0, 20) + '...');
  
  console.log('\n🔵 Step 2: Get All Orders');
  const ordersRes = await fetch(`${BASE_URL}/admin/orders/single`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  const ordersData = await ordersRes.json();
  console.log('Orders Response:', JSON.stringify(ordersData, null, 2));
  
  if (!ordersData.success || !ordersData.data || ordersData.data.length === 0) {
    console.error('❌ No orders found');
    return;
  }
  
  const firstOrder = ordersData.data[0];
  console.log('✅ First order:', firstOrder._id, 'Status:', firstOrder.status);
  
  console.log('\n🔵 Step 3: Update Order Status to PREPARING');
  const updateRes = await fetch(`${BASE_URL}/admin/orders/${firstOrder._id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'PREPARING' })
  });
  
  const updateData = await updateRes.json();
  console.log('Update Response:', JSON.stringify(updateData, null, 2));
  
  if (updateData.success) {
    console.log('✅ Status updated successfully!');
  } else {
    console.error('❌ Status update failed:', updateData.message);
  }
}

testFlow().catch(err => console.error('Test failed:', err));
