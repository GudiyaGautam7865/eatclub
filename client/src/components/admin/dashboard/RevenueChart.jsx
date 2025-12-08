import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', revenue: 45000, orders: 120 },
  { month: 'Feb', revenue: 52000, orders: 145 },
  { month: 'Mar', revenue: 48000, orders: 135 },
  { month: 'Apr', revenue: 61000, orders: 168 },
  { month: 'May', revenue: 55000, orders: 152 },
  { month: 'Jun', revenue: 67000, orders: 189 },
  { month: 'Jul', revenue: 72000, orders: 205 },
];

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#666" style={{ fontSize: '12px' }} />
        <YAxis stroke="#666" style={{ fontSize: '12px' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
          formatter={(value) => `₹${value.toLocaleString()}`}
        />
        <Legend wrapperStyle={{ fontSize: '13px' }} />
        <Line type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue (₹)" />
        <Line type="monotone" dataKey="orders" stroke="#4ECDC4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Orders" />
      </LineChart>
    </ResponsiveContainer>
  );
}
