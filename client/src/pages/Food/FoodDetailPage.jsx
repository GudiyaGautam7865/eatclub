import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getFoodById } from "../../services/foodSearchService";
import { useCartContext } from "../../context/CartContext";
import { ArrowLeft } from "lucide-react";
import "./FoodDetailPage.css";

const FoodDetailPage = () => {
  const { foodId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = (() => {
    try {
      return useCartContext();
    } catch (e) {
      return { addItem: () => {} };
    }
  })();

  useEffect(() => {
    const loadFood = async () => {
      setLoading(true);
      try {
        let foodData = location.state?.food;

        if (!foodData || foodData.id !== foodId) {
          const urlParams = new URLSearchParams(window.location.search);
          const productId = urlParams.get("p");
          if (productId) {
            foodData = await getFoodById(foodId, productId);
          }
        }

        if (!foodData) {
          setFood(null);
        } else {
          setFood(foodData);
        }
      } catch (error) {
        console.error("Error loading food:", error);
        setFood(null);
      } finally {
        setLoading(false);
      }
    };

    loadFood();
  }, [foodId, location.state]);

  const handleAddToCart = () => {
    if (food) {
      addItem({
        id: `${food.productId}-${food.id}`,
        title: food.name,
        name: food.name,
        brand: food.productName,
        section: food.productName,
        price: food.price,
        oldPrice: food.membershipPrice,
        image: food.imageUrl,
        qty: quantity,
        isVeg: food.isVeg,
      });
      navigate("/cart");
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  if (loading) {
    return (
      <div className="food-detail-loading">
        <div className="spinner"></div>
        <p>Loading food details...</p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="food-detail-error">
        <div className="error-content">
          <h2>Food item not found</h2>
          <p>The food item you're looking for doesn't exist or was removed.</p>
          <button onClick={() => navigate("/")} className="error-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="food-detail-container">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
        title="Go back"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="food-detail-content">
        <div className="food-image-section">
          <img
            src={food.imageUrl}
            alt={food.name}
            className="food-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400?text=No+Image";
            }}
          />
          {food.isVeg && <span className="veg-badge-large">🥗 Vegetarian</span>}
        </div>

        <div className="food-info-section">
          <div className="food-header">
            <div>
              <h1 className="food-name">{food.name}</h1>
              <p className="food-restaurant">{food.productName}</p>
            </div>
          </div>

          {food.description && (
            <p className="food-description">{food.description}</p>
          )}

          <div className="food-pricing">
            <div className="price-row">
              <span className="price-label">Price</span>
              <div className="price-values">
                {food.membershipPrice && (
                  <span className="old-price">₹{food.membershipPrice}</span>
                )}
                <span className="current-price">₹{food.price}</span>
              </div>
            </div>

            {food.membershipPrice && food.membershipPrice < food.price && (
              <div className="discount-info">
                Save ₹{food.price - food.membershipPrice} with membership
              </div>
            )}
          </div>

          <div className="quantity-section">
            <label className="quantity-label">Quantity</label>
            <div className="quantity-controls">
              <button
                className="qty-button"
                onClick={() => handleQuantityChange(-1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="qty-display">{quantity}</span>
              <button
                className="qty-button"
                onClick={() => handleQuantityChange(1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
            >
              Add to Cart (₹{food.price * quantity})
            </button>
          </div>

          <div className="food-details-table">
            <div className="detail-row">
              <span className="detail-label">Category</span>
              <span className="detail-value">{food.categoryId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Type</span>
              <span className="detail-value">
                {food.isVeg ? "Vegetarian" : "Non-Vegetarian"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPage;
