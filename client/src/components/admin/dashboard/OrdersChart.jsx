import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function OrdersChart({ data = [] }) {
  const defaultData = [
    { date: 'Mon', orders: 45 },
    { date: 'Tue', orders: 52 },
    { date: 'Wed', orders: 48 },
    { date: 'Thu', orders: 61 },
    { date: 'Fri', orders: 55 },
    { date: 'Sat', orders: 67 },
    { date: 'Sun', orders: 58 },
  ];

  const chartData = data.length > 0 ? data.map(item => ({
    date: item.date,
    orders: item.orders
  })) : defaultData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
        <YAxis stroke="#666" style={{ fontSize: '12px' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
        />
        <Legend wrapperStyle={{ fontSize: '13px' }} />
        <Bar dataKey="orders" fill="#4CAF50" radius={[8, 8, 0, 0]} name="Orders" />
      </BarChart>
    </ResponsiveContainer>
  );
}
