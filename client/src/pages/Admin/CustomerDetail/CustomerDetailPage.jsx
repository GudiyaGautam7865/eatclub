import React, { useState, useEffect } from 'react';
import CustomerHeader from '../../../components/admin/customer/CustomerHeader';
import CustomerStats from '../../../components/admin/customer/CustomerStats';
import MostOrderedFood from '../../../components/admin/customer/MostOrderedFood';
import MostLikedFood from '../../../components/admin/customer/MostLikedFood';
import customerData from '../../../mock/customer.json';
import './CustomerDetailPage.css';

export default function CustomerDetailPage() {
  const [customer, setCustomer] = useState(null);
  const [mostOrderedFood, setMostOrderedFood] = useState([]);
  const [mostLikedFood, setMostLikedFood] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setCustomer(customerData.customer);
        setMostOrderedFood(customerData.mostOrderedFood);
        setMostLikedFood(customerData.mostLikedFood);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load customer data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-detail-loading">
        <div className="loading-spinner">Loading customer details...</div>
      </div>
    );
  }

  return (
    <div className="customer-detail-page">
      <CustomerHeader />
      
      <div className="customer-content">
        <div className="customer-main">
          <CustomerStats customer={customer} />
          <div className="customer-charts">
            <MostOrderedFood foods={mostOrderedFood} />
            <MostLikedFood data={mostLikedFood} />
          </div>
        </div>
      </div>
    </div>
  );
}