# Admin Dashboard Components

## Overview
Professional, industry-level dashboard components with interactive charts and tables using Recharts library.

## Components

### 📊 Charts
- **OrdersChart.jsx** - Bar chart showing weekly order status (Completed, Pending, Cancelled)
- **RevenueChart.jsx** - Line chart displaying revenue and order trends over months
- **SalesAreaChart.jsx** - Area chart showing today's sales activity by hour
- **CategoryChart.jsx** - Pie chart for order distribution by category

### 📈 Cards
- **StatCard.jsx** - Displays key metrics with icons and trend indicators
- **ChartCard.jsx** - Container for chart components with consistent styling
- **QuickStats.jsx** - Gradient cards showing quick performance metrics

### 📋 Tables
- **TopItemsTable.jsx** - Professional table showing top 5 performing menu items with rankings

## Features
✅ Responsive design for all screen sizes
✅ Interactive tooltips and legends
✅ Smooth animations and hover effects
✅ Modern gradient backgrounds
✅ Professional color schemes
✅ Real-time data visualization ready

## Tech Stack
- React 18
- Recharts 3.5.1
- CSS3 with gradients and animations

## Usage Example
```jsx
import ChartCard from './ChartCard';
import RevenueChart from './RevenueChart';

<ChartCard title="Revenue Trend">
  <RevenueChart />
</ChartCard>
```

## Color Palette
- Primary: #667eea → #764ba2 (Gradient)
- Success: #4CAF50
- Warning: #FFC107
- Error: #F44336
- Info: #4ECDC4
- Accent: #FF6B35
