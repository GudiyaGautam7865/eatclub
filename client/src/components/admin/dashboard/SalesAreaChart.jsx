import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesAreaChart({ data = [] }) {
  const defaultData = [
    { date: 'Mon', orders: 12 },
    { date: 'Tue', orders: 19 },
    { date: 'Wed', order: 8 },
    { date: 'Thu', orders: 28 },
    { date: 'Fri', orders: 39 },
    { date: 'Sat', orders: 35 },
    { date: 'Sun', orders: 42 },
  ];

  const chartData = data.length > 0 ? data.map(item => ({
    date: item.date,
    orders: item.orders
  })) : defaultData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
        <YAxis stroke="#666" style={{ fontSize: '12px' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
          formatter={(value) => `${value} orders`}
        />
        <Area type="monotone" dataKey="orders" stroke="#FF6B35" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
