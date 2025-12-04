import React from 'react';
import { ChevronDown } from 'lucide-react';

export const ProductSelector = ({ products, currentProduct, onProductChange }) => {
  const current = products.find(p => p.id === currentProduct);

  return (
    <div className="relative">
      <select 
        value={currentProduct}
        onChange={(e) => onProductChange(e.target.value)}
        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:border-gray-400 cursor-pointer"
      >
        {products.map(product => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
};