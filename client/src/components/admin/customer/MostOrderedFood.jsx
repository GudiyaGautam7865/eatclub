import React, { useState } from 'react';
import './MostOrderedFood.css';

export default function MostOrderedFood({ foods }) {
  const [activeTab, setActiveTab] = useState('Monthly');

  const tabs = ['Monthly', 'Weekly', 'Daily'];

  return (
    <div className="most-ordered-food">
      <div className="card-header">
        <h3 className="card-title">Most Ordered Food</h3>
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="food-list">
        {foods.map((food) => (
          <div key={food.id} className="food-item">
            <div className="food-image">
              {food.image ? (
                <img 
                  src={food.image} 
                  alt={food.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="food-image-fallback" style={{ display: food.image ? 'none' : 'flex' }}>
                🍽️
              </div>
            </div>
            
            <div className="food-info">
              <div className="food-name">{food.name}</div>
              <div className="food-price">${food.price}</div>
            </div>
            
            <button className="menu-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}