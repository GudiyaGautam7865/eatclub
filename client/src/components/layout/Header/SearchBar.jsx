import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { searchFoods } from "../../../services/foodSearchService";
import "./SearchBar.css";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  const handleSearch = useCallback(async (query) => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchFoods(query);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSuggestionClick = (food) => {
    navigate(`/food/${food.id}`, { state: { food } });
    setSearchQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <input
        type="text"
        className="search-bar-input"
        placeholder="Search food..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        aria-label="Search food items"
        aria-autocomplete="list"
        aria-expanded={isOpen}
      />

      {isLoading && <div className="search-loading">Loading...</div>}

      {isOpen && (
        <div className="search-suggestions-dropdown" role="listbox">
          {suggestions.length > 0 ? (
            suggestions.map((food, index) => (
              <div
                key={`${food.productId}-${food.id}`}
                className={`search-suggestion-item ${
                  index === highlightedIndex ? "highlighted" : ""
                }`}
                onClick={() => handleSuggestionClick(food)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                <div className="suggestion-image">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50?text=No+Image";
                    }}
                  />
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-name">{food.name}</div>
                  <div className="suggestion-brand">{food.productName}</div>
                  <div className="suggestion-price">₹{food.price}</div>
                </div>
                {food.isVeg && <span className="veg-badge">🥗</span>}
              </div>
            ))
          ) : (
            <div className="search-no-results">
              No food items found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
