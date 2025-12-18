import React, { useState, useEffect } from "react";
import "./BrandsOnBoard.css";
import { getProducts } from "../../services/menuService";

function BrandsOnBoard() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const products = await getProducts();
        const defaultColors = ["#FF7A3B", "#D4A574", "#CC0000", "#E8B4C4", "#C9A574", "#FFD700", "#3498DB", "#2EA670"];    
        const mapped = products.map((p, idx) => ({
          id: p.id,
          name: p.name,
          backgroundColor: defaultColors[idx % defaultColors.length],
          logo: p.image
        }));
        setBrands(mapped);
      } catch (error) {
        console.error("Error loading brands from API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return <div className="brands-section">Loading brands...</div>;
  }

  return (
    <section className="brands-section">
      <div className="brands-container">
        {/* Header */}
        <div className="brands-header">
          <h2 className="brands-title">Brands On Board</h2>
          <p className="brands-subtitle">
            Enjoy access to offers on these exclusive brands for the next month!
          </p>
        </div>

        {/* Brands Grid */}
        <div className="brands-grid">
          {brands.map((brand) => (
            <div key={brand.id} className="brand-badge">
              <div
                className="brand-circle"
                style={{ backgroundColor: brand.backgroundColor }}
              >
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="brand-logo-img"
                />
              </div>
              <p className="brand-name">{brand.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandsOnBoard;