// src/components/admin/forms/EditMenuItemModal.jsx
import React, { useEffect, useState } from "react";
import "./EditMenuItemForm.css"; // add modal styles similar to your add form

export default function EditMenuItemModal({
  isOpen,
  item: initialItem,
  onClose,        // function(shouldSave:Boolean, updatedItem:Object)
  brands = [],    // array of restaurants [{ _id, name, ... }]
  getCategories,  // async function(brandId) => categories[]  OR pass categories array below
  categories = [] // optional: categories array when parent already loaded
}) {
  const [item, setItem] = useState(null);
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
  if (!isOpen) {
    setItem(null);
    setLocalCategories([]);
    return;
  }

  if (initialItem) {
    setItem({ ...initialItem }); // Load item once when opening modal
  }

  // Load categories only once when modal opens
  const loadCats = async () => {
    if (initialItem?.brandId && typeof getCategories === "function") {
      try {
        setLoadingCategories(true);
        const cats = await getCategories(initialItem.brandId);
        setLocalCategories(cats || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setLocalCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
  };

  loadCats();

  // Only re-run when modal open state changes or new item is selected
}, [isOpen, initialItem?._id]);

  const loadCategories = async (brandId) => {
    if (!brandId) {
      setLocalCategories([]);
      return;
    }
    if (getCategories) {
      try {
        setLoadingCategories(true);
        const cats = await getCategories(brandId);
        setLocalCategories(cats || []);
      } catch (err) {
        console.error("Failed loading categories", err);
        setLocalCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
  };

  if (!isOpen || !item) return null;

  const handleChange = (patch) => setItem(prev => ({ ...prev, ...patch }));

  const handleBrandChange = async (brandId) => {
    const brand = brands.find(b => (b._id ?? b.id) === brandId);
    handleChange({ brandId, brandName: brand?.name ?? "" });
    await loadCategories(brandId);
    // clear selected category when brand changes
    handleChange({ categoryId: "", categoryName: "" });
  };

  const handleCategoryChange = (categoryId) => {
    const cat = localCategories.find(c => (c._id ?? c.id) === categoryId);
    handleChange({ categoryId, categoryName: cat?.name ?? "" });
  };

  const handleSubmit = () => {
    // Build payload matching Add form and backend
    const payload = {
      name: (item.name || "").trim(),
      description: item.description ?? "",
      brandId: item.brandId ?? "",
      brandName: item.brandName ?? "",
      categoryId: item.categoryId ?? "",
      categoryName: item.categoryName ?? "",
      price: Number(item.price) || 0,
      membershipPrice: item.membershipPrice ? Number(item.membershipPrice) : undefined,
      isVeg: !!item.isVeg,
      imageUrl: item.imageUrl ?? "",
      isAvailable: item.isAvailable ?? true
    };

    // call onClose with shouldSave true and payload (parent will call API)
    onClose(true, payload, item._id); // pass id separately for clarity
  };

  return (
 <div className="modal-overlay">
  <div className="modal-box animate-scale">
    <h2>Edit Menu Item</h2>

    <label>Name</label>
    <input
      value={item.name || ""}
      onChange={(e) => handleChange({ name: e.target.value })}
      placeholder="Enter item name"
    />

    <label>Description</label>
    <textarea
      value={item.description || ""}
      onChange={(e) => handleChange({ description: e.target.value })}
      placeholder="Write item description..."
    />

    <div className="row">
      <div className="col">
        <label>Restaurant</label>
        <select
          value={item.brandId || ""}
          onChange={(e) => handleBrandChange(e.target.value)}
        >
          <option value="">Select Restaurant</option>
          {brands.map(b => (
            <option key={b._id ?? b.id} value={b._id ?? b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col">
        <label>Category</label>
        <select
          value={item.categoryId || ""}
          onChange={(e) => handleCategoryChange(e.target.value)}
          disabled={!item.brandId || loadingCategories}
        >
          <option value="">
            {loadingCategories ? "Loading..." : "Select Category"}
          </option>
          {localCategories.map(c => (
            <option key={c._id ?? c.id} value={c._id ?? c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>

    <label>Price</label>
    <input
      type="number"
      value={item.price ?? ""}
      onChange={(e) => handleChange({ price: e.target.value })}
    />

    <label>Membership Price</label>
    <input
      type="number"
      value={item.membershipPrice ?? ""}
      onChange={(e) => handleChange({ membershipPrice: e.target.value })}
    />

    <div className="toggle-row">
      <div className="toggle">
        <input
          type="checkbox"
          checked={!!item.isVeg}
          onChange={(e) => handleChange({ isVeg: e.target.checked })}
        />
        <span>Vegetarian</span>
      </div>

      <div className="toggle">
        <input
          type="checkbox"
          checked={!!item.isAvailable}
          onChange={(e) => handleChange({ isAvailable: e.target.checked })}
        />
        <span>Available</span>
      </div>
    </div>

    <label>Image URL</label>
    <input
      value={item.imageUrl ?? ""}
      onChange={(e) => handleChange({ imageUrl: e.target.value })}
      placeholder="https://example.com/image.jpg"
    />

    <div className="modal-actions">
      <button className="cancel-btn" onClick={() => onClose(false)}>Cancel</button>
      <button className="save-btn" onClick={handleSubmit}>Save Changes</button>
    </div>
  </div>
</div>

  );
}
