import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const DeliverySearch = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      // Mock search results
      setResults([
        { id: 1, type: 'order', title: `Order #${Math.floor(Math.random() * 1000)}`, customer: 'John Doe', status: 'pending' },
        { id: 2, type: 'customer', title: 'Jane Smith', phone: '+1234567890', orders: 5 }
      ]);
    }
  }, [query]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Search Results for "{query}"</h2>
      {results.length > 0 ? (
        <div>
          {results.map(result => (
            <div key={result.id} style={{ padding: '15px', margin: '10px 0', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4>{result.title}</h4>
              <p>{result.customer || result.phone}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default DeliverySearch;