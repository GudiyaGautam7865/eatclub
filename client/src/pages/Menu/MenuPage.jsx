import React, { useEffect, useState, useRef } from 'react';
import { Sidebar } from '../../components/menu/Sidebar';
import { ProductCard } from '../../components/menu/ItemCard/ItemCard';
import { AIChat } from '../../components/menu/AIChat';
import { ProductSelector } from '../../components/menu/ProductSelector';
import { getProducts, getMenuData } from '../../services/menuService.js';
import { Search, ChefHat, Crown, ArrowUp } from 'lucide-react';
import './MenuPage.css';

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState('box8');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const mainContentRef = useRef(null);
  const productGridRef = useRef(null);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      const productsData = await getProducts();
      setProducts(productsData);
    };
    loadProducts();
  }, []);

  // Load menu data when product changes
  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);
      const data = await getMenuData(currentProduct);
      setCategories(data.categories);
      setItems(data.items);
      // Set first category as active
      if (data.categories.length > 0) {
        setActiveCategory(data.categories[0].id);
      }
      setLoading(false);
    };
    if (currentProduct) {
      loadMenu();
    }
  }, [currentProduct]);

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -50% 0px',
        threshold: [0.1, 0.3, 0.5]
      }
    );

    // Observe all category sections
    categories.forEach(category => {
      const element = document.getElementById(category.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [categories]);

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  // Enhanced category selection with smooth scroll to section
  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    
    // Smooth scroll to specific category section
    const categorySection = document.getElementById(categoryId);
    if (categorySection) {
      const offsetTop = categorySection.offsetTop - 100; // Account for navbar and padding
      window.scrollTo({ 
        top: offsetTop, 
        behavior: 'smooth' 
      });
    }
  };

  // Group items by category for continuous scroll
  const getFilteredItems = () => {
    return items.filter(item => {
      // Apply veg/non-veg filter
      if (vegOnly && !item.isVeg) return false;
      if (nonVegOnly && item.isVeg) return false;
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(query) || 
               (item.description && item.description.toLowerCase().includes(query));
      }
      
      return true;
    });
  };

  const filteredItems = getFilteredItems();

  const groupedItems = categories.map(category => ({
    category,
    items: filteredItems.filter(item => item.categoryId === category.id)
  }));

  const getCategoryDescription = (id) => {
    if (id === 'together-combos') {
      return "All other offers applicable on Together Combos. Get that party started!";
    }
    return `Wholesome & delicious, these hearty ${id.replace('-', ' ')} options are so satisfying.`;
  };

  return (
    <div className="menu-container">
      <div className="menu-wrapper">
        {/* Product Selector */}
        <div className="menu-mobile-selector">
          <ProductSelector 
            products={products}
            currentProduct={currentProduct}
            onProductChange={setCurrentProduct}
          />
        </div>

        {/* Sidebar Navigation */}
        <div className="menu-sidebar">
          {/* Desktop Product Selector */}
          <div id="mobile-selector">
            <ProductSelector 
              products={products}
              currentProduct={currentProduct}
              onProductChange={setCurrentProduct}
            />
          </div>
          
          <Sidebar 
            categories={categories} 
            activeCategory={activeCategory} 
            onSelectCategory={handleCategorySelect}
          />
        </div>
        
        {/* Main Content */}
        <main ref={mainContentRef} className="menu-main">
          
          {/* Top Controls: Filters & Search */}
          <div className="menu-filters">
            <div className="filter-group">
              <label className="filter-item">
                <input 
                  type="checkbox" 
                  checked={vegOnly}
                  onChange={(e) => {
                    setVegOnly(e.target.checked);
                    if (e.target.checked) setNonVegOnly(false);
                  }}
                  style={{display: 'none'}}
                />
                <div className="filter-checkbox-box green">
                   {vegOnly && <div className="filter-checkbox-indicator green"></div>}
                </div>
                <span>Veg</span>
              </label>

              <label className="filter-item">
                <input 
                  type="checkbox" 
                  checked={nonVegOnly}
                  onChange={(e) => {
                    setNonVegOnly(e.target.checked);
                    if (e.target.checked) setVegOnly(false);
                  }}
                  style={{display: 'none'}}
                />
                <div className="filter-checkbox-box red">
                   {nonVegOnly && <div className="filter-checkbox-indicator red"></div>}
                </div>
                <span>Non Veg</span>
              </label>

              <button className="filter-item">
                <Crown size={14} style={{color: '#eab308', fill: '#eab308'}} />
                Bestseller
              </button>
              
              <button className="filter-item">
                <ChefHat size={14} style={{color: '#3b82f6', fill: '#3b82f6'}} />
                Chef's Special
              </button>
            </div>

            <div className="search-wrapper">
              <input 
                type="text" 
                placeholder="Search" 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="search-icon" />
            </div>
          </div>

          {/* All Categories with Items */}
          {loading ? (
             <div className="menu-grid">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="loading-skeleton"></div>
               ))}
             </div>
          ) : (
             <div>
               {groupedItems.map((group, groupIndex) => (
                 <section key={group.category.id} id={group.category.id} className="scroll-mt-24">
                   {/* Category Header */}
                   <div className="category-section">
                     <h2 className="category-title">
                       {group.category.name}
                     </h2>
                     <p style={{color: '#666', fontSize: '14px'}}>
                       {getCategoryDescription(group.category.id)}
                     </p>
                   </div>

                   {/* Category Items Grid */}
                   <div className="menu-grid">
                       {group.items.length > 0 ? (
                         group.items.map((item, index) => (
                           <div 
                             key={item.id}
                             style={{ animationDelay: `${(groupIndex * 3 + index) * 50}ms` }}
                           >
                             <ProductCard item={item} />
                           </div>
                         ))
                       ) : (
                         // Show placeholder cards for empty sections
                         [1, 2, 3].map((i) => (
                           <div key={`placeholder-${group.category.id}-${i}`} className="item-card">
                             {/* Image Area */}
                             <div className="item-image-container">
                               <div style={{fontSize: '48px'}}>🍽️</div>
                             </div>

                             {/* Content */}
                             <div className="item-content">
                               {/* Title Row with Veg Icon */}
                               <div className="item-header">
                                 <div className="veg-indicator veg">
                                   <div className="veg-indicator-dot veg"></div>
                                 </div>
                                 <h3 className="item-name">Coming Soon - {group.category.name} #{i}</h3>
                               </div>

                               <p className="item-description">
                                 Delicious {group.category.name.toLowerCase()} will be available soon. Fresh ingredients and authentic flavors await!
                               </p>

                               <div className="item-action">
                                 {/* Price and Add Button Row */}
                                 <div className="item-footer">
                                   <span style={{fontSize: '14px', fontWeight: '600'}}>₹ ---</span>
                                   
                                   <button className="add-btn" disabled style={{opacity: 0.5, cursor: 'not-allowed'}}>
                                     SOON
                                   </button>
                                 </div>

                                 {/* Membership Price Banner */}
                                 <div className="price-tag">
                                   <span>₹ ---</span>
                                   <span>with</span>
                                   <div className="price-badge">
                                     <span style={{fontSize: '7px', fontWeight: 'bold'}}>EAT</span>
                                     <span style={{fontSize: '7px', fontWeight: 'bold'}}>CLUB</span>
                                   </div>
                                   <span>membership</span>
                                 </div>
                               </div>
                             </div>
                           </div>
                         ))
                       )}
                   </div>
                 </section>
               ))}
             </div>
          )}

        </main>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-btn visible"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <AIChat menuItems={items} /> 
    </div>
  );
};

export default MenuPage;