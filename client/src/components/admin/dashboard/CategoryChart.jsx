import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Main Course', value: 385, color: '#FF6B35' },
  { name: 'Appetizers', value: 245, color: '#4ECDC4' },
  { name: 'Desserts', value: 180, color: '#FFD93D' },
  { name: 'Beverages', value: 165, color: '#6BCB77' },
  { name: 'Salads', value: 125, color: '#9D84B7' },
];

export default function CategoryChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} orders`} />
        <Legend wrapperStyle={{ fontSize: '13px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
