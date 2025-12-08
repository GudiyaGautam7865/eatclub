import React from 'react';
import { 
  UtensilsCrossed, 
  Gift, 
  Soup, 
  LayoutGrid, 
  Utensils, 
  Package, 
  Coffee,
  Sandwich,
  ShoppingBag,
  CookingPot,
  Scroll,
  CupSoda,
  IceCream
} from 'lucide-react';
import './Sidebar.css';
import './Sidebar.css';
import './Sidebar.css';

const getIcon = (id) => {
  switch (id) {
    case 'together-combos': return <ShoppingBag size={20} />; // Closest to the "bag/combo" icon
    case 'daily-biryani': return <UtensilsCrossed size={20} />;
    case 'bogo': return <Gift size={20} />;
    case 'comfort': return <Soup size={20} />;
    case 'all-in-1': return <LayoutGrid size={20} />;
    case 'mini': return <Utensils size={20} />; // Actually looks like a bowl in screenshot
    case 'desi-box': return <Package size={20} />;
    case 'biryani-thali': return <CookingPot size={20} />;
    case 'main-course': return <UtensilsCrossed size={20} />;
    case 'paratha-rolls': return <Scroll size={20} />;
    case 'desi-sandwiches': return <Sandwich size={20} />;
    case 'beverages': return <CupSoda size={20} />;
    case 'desserts': return <IceCream size={20} />;
    default: return <Coffee size={20} />;
  }
};

export const Sidebar = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Menu</h2>
      </div>
      
      <ul className="sidebar-list">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <li key={category.id} className="sidebar-item">
              <button
                onClick={() => onSelectCategory(category.id)}
                className={`sidebar-button ${isActive ? 'active' : ''}`}
              >
                {/* Active Border Line */}
                {isActive && (
                  <div className="sidebar-active-border"></div>
                )}
                
                <span className={`sidebar-icon ${isActive ? 'active' : ''}`}>
                  {getIcon(category.id)}
                </span>
                
                <span className={`sidebar-text ${isActive ? 'active' : ''}`}>
                  {category.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};