import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MostLikedFood.css';

export default function MostLikedFood({ data }) {
  if (!data || !data.weekly) {
    return (
      <div className="most-liked-food">
        <div className="card-header">
          <h3 className="card-title">Most Liked Food</h3>
        </div>
        <div className="no-data">No data available</div>
      </div>
    );
  }

  return (
    <div className="most-liked-food">
      <div className="card-header">
        <h3 className="card-title">Most Liked Food</h3>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.weekly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#718096' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#718096' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="Spaghetti" fill="#667eea" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Pizza" fill="#48bb78" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Burger" fill="#ed8936" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Salad" fill="#38b2ac" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}