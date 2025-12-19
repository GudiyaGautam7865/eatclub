import React, { useState, useEffect } from 'react';
import DeliveryBoyCard from '../../../components/admin/deliveryboys/DeliveryBoyCard';
import DeliveryBoyListItem from '../../../components/admin/deliveryboys/DeliveryBoyListItem';
import AddDeliveryBoyModal from '../../../components/admin/deliveryboys/AddDeliveryBoyModal';
import { getAllDeliveryBoys, deleteDeliveryBoy } from '../../../services/deliveryBoyService.js';
import deliveryBoysData from '../../../mock/deliveryboys.json';
import './DeliveryBoyListPage.css';

export default function DeliveryBoyListPage() {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [filteredBoys, setFilteredBoys] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const statusTabs = [
    { key: 'all', label: 'All', count: deliveryBoys.length },
    { key: 'online', label: 'Online', count: deliveryBoys.filter(b => b.status === 'online').length },
    { key: 'offline', label: 'Offline', count: deliveryBoys.filter(b => b.status === 'offline').length },
    { key: 'busy', label: 'Busy', count: deliveryBoys.filter(b => b.status === 'busy').length },
    { key: 'free', label: 'Free', count: deliveryBoys.filter(b => b.status === 'online' && b.activeOrders.length === 0).length }
  ];

  useEffect(() => {
    loadDeliveryBoys();
  }, []);

  useEffect(() => {
    filterDeliveryBoys();
  }, [deliveryBoys, selectedStatus, searchTerm]);

  const loadDeliveryBoys = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from backend first
      try {
        const backendBoys = await getAllDeliveryBoys();
        if (backendBoys && backendBoys.length > 0) {
          // Map backend data to match expected format
          const mappedBoys = backendBoys.map(boy => ({
            id: boy._id || boy.id,
            name: boy.name,
            phone: boy.phone,
            email: boy.email,
            vehicleType: boy.vehicleType,
            vehicleNumber: boy.vehicleNumber || 'N/A',
            status: boy.deliveryStatus?.toLowerCase() || 'offline',
            totalDeliveries: boy.totalDeliveries || 0,
            todayDeliveries: 0,
            thisWeekDeliveries: 0,
            averageDeliveryTime: '0 min',
            rating: boy.rating || 0,
            joinDate: boy.createdAt ? new Date(boy.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            activeOrders: [],
            profileImage: boy.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(boy.name)}&background=random`,
          }));
          setDeliveryBoys(mappedBoys);
          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.warn('Failed to fetch from API, falling back to mock data:', apiError.message);
      }

      // Fallback to mock data
      const deletedDeliveryBoys = localStorage.getItem('deletedDeliveryBoys') || '[]';
      const deletedList = JSON.parse(deletedDeliveryBoys);
      const allDeliveryBoys = deliveryBoysData.deliveryBoys.filter(boy => !deletedList.includes(boy.id));
      
      setDeliveryBoys(allDeliveryBoys);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load delivery boys:', error);
      setLoading(false);
    }
  };

  const filterDeliveryBoys = () => {
    let filtered = deliveryBoys;

    // Filter by status
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'free') {
        filtered = filtered.filter(boy => boy.status === 'online' && boy.activeOrders.length === 0);
      } else {
        filtered = filtered.filter(boy => boy.status === selectedStatus);
      }
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(boy => 
        boy.name.toLowerCase().includes(term) ||
        boy.phone.includes(term)
      );
    }

    setFilteredBoys(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const handleAddDeliveryBoy = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleAddNewDeliveryBoy = (newDeliveryBoy) => {
    // Reload the list to get updated data from backend
    loadDeliveryBoys();
    console.log('New delivery boy added:', newDeliveryBoy);
  };

  const handleDeleteDeliveryBoy = async (deliveryBoyId) => {
    if (!window.confirm('Are you sure you want to delete this delivery boy?')) return;

    try {
      await deleteDeliveryBoy(deliveryBoyId);
      // Reload the list after deletion
      loadDeliveryBoys();
      console.log('Delivery boy deleted:', deliveryBoyId);
    } catch (error) {
      console.error('Failed to delete delivery boy:', error);
      alert('Failed to delete delivery boy. Please try again.');
    }
  };

  const getOnlineCount = () => {
    return deliveryBoys.filter(boy => boy.status === 'online').length;
  };

  const getTotalDeliveriesToday = () => {
    return deliveryBoys.reduce((sum, boy) => sum + boy.todayDeliveries, 0);
  };

  if (loading) {
    return (
      <div className="delivery-boys-loading">
        <div className="loading-spinner">Loading delivery boys...</div>
      </div>
    );
  }

  return (
    <div className="delivery-boys-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Delivery Boys</span>
          </div>
          <h1 className="page-title">Delivery Boys</h1>
          <p className="page-subtitle">
            Manage delivery personnel ({deliveryBoys.length} total riders)
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-value">{getOnlineCount()}</div>
            <div className="stat-label">Online Now</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{getTotalDeliveriesToday()}</div>
            <div className="stat-label">Today's Deliveries</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-and-controls">
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5 C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search by name or phone number..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="view-controls">
            <div className="view-toggle">
              <button 
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
              <button 
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
            </div>
            
            <button className="add-delivery-boy-btn" onClick={handleAddDeliveryBoy}>
              + Add Delivery Boy
            </button>
          </div>
        </div>

        <div className="status-tabs">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              className={`status-tab ${selectedStatus === tab.key ? 'active' : ''}`}
              onClick={() => handleStatusFilter(tab.key)}
            >
              {tab.label}
              <span className="tab-count">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Boys Grid */}
      <div className="delivery-boys-content">
        {filteredBoys.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏍️</div>
            <h3>No delivery boys found</h3>
            <p>
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No delivery boys available yet'
              }
            </p>
          </div>
        ) : (
          <div className={`delivery-boys-container ${viewMode}`}>
            {viewMode === 'grid' ? (
              <div className="delivery-boys-grid">
                {filteredBoys.map((deliveryBoy) => (
                  <DeliveryBoyCard
                    key={deliveryBoy.id}
                    deliveryBoy={deliveryBoy}
                    onDelete={handleDeleteDeliveryBoy}
                  />
                ))}
              </div>
            ) : (
              <div className="delivery-boys-list">
                <div className="list-header">
                  <div className="list-header-item">Delivery Boy</div>
                  <div className="list-header-item">Status</div>
                  <div className="list-header-item">Statistics</div>
                  <div className="list-header-item">Vehicle</div>
                  <div className="list-header-item">Actions</div>
                </div>
                {filteredBoys.map((deliveryBoy) => (
                  <DeliveryBoyListItem
                    key={deliveryBoy.id}
                    deliveryBoy={deliveryBoy}
                    onDelete={handleDeleteDeliveryBoy}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Delivery Boy Modal */}
      <AddDeliveryBoyModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onAdd={handleAddNewDeliveryBoy}
      />
    </div>
  );
}