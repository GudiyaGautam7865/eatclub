import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MenuDetailCard from '../../components/admin/orders/MenuDetailCard';
import './styles/MenuDetailPage.css';

export default function MenuDetailPage() {
  const { menuItemId } = useParams();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);

  useEffect(() => {
    const mockMenuItem = {
      id: menuItemId,
      name: 'Margherita Pizza',
      description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
      price: 299,
      membershipPrice: 209,
      isVeg: true,
      imageUrl: 'https://via.placeholder.com/400x300?text=Pizza',
      isAvailable: true,
      category: 'Pizza',
      restaurant: 'Pizza Palace'
    };
    setMenuItem(mockMenuItem);
  }, [menuItemId]);

  if (!menuItem) {
    return <div className="menu-detail-loading">Loading...</div>;
  }

  return (
    <div className="menu-detail-page">
      <button className="back-button" onClick={() => navigate('/admin/menu/list')}>
        ← Back to Menu
      </button>

      <MenuDetailCard menuItem={menuItem} onUpdate={setMenuItem} />
    </div>
  );
}
