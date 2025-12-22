import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#FF6B35', '#4ECDC4', '#FFD93D', '#6BCB77', '#9D84B7', '#FF6B9D', '#C780FA', '#26C6DA'];

export default function CategoryChart({ data = [] }) {
  const defaultData = [
    { name: 'PLACED', count: 45 },
    { name: 'PAID', count: 32 },
    { name: 'PREPARING', count: 28 },
    { name: 'READY_FOR_PICKUP', count: 52 },
    { name: 'DELIVERED', count: 189 },
    { name: 'CANCELLED', count: 12 },
  ];

  const chartData = data.length > 0 ? data.map(item => ({
    name: item._id || item.name,
    count: item.count || item.value
  })) : defaultData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={90}
          fill="#8884d8"
          dataKey="count"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} orders`} />
        <Legend wrapperStyle={{ fontSize: '13px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
