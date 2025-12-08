import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', completed: 45, pending: 12, cancelled: 3 },
  { day: 'Tue', completed: 52, pending: 8, cancelled: 2 },
  { day: 'Wed', completed: 48, pending: 15, cancelled: 5 },
  { day: 'Thu', completed: 61, pending: 10, cancelled: 4 },
  { day: 'Fri', completed: 55, pending: 18, cancelled: 6 },
  { day: 'Sat', completed: 67, pending: 22, cancelled: 8 },
  { day: 'Sun', completed: 58, pending: 14, cancelled: 3 },
];

export default function OrdersChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="day" stroke="#666" style={{ fontSize: '12px' }} />
        <YAxis stroke="#666" style={{ fontSize: '12px' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
        />
        <Legend wrapperStyle={{ fontSize: '13px' }} />
        <Bar dataKey="completed" fill="#4CAF50" radius={[8, 8, 0, 0]} name="Completed" />
        <Bar dataKey="pending" fill="#FFC107" radius={[8, 8, 0, 0]} name="Pending" />
        <Bar dataKey="cancelled" fill="#F44336" radius={[8, 8, 0, 0]} name="Cancelled" />
      </BarChart>
    </ResponsiveContainer>
  );
}
