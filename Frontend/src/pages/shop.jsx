/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getProducts, createProduct } from '../pages/api'; 
import { useNavigate, useLocation } from 'react-router-dom';
import pants from '../assets/clothes/pants.jpeg';// 1. Import useLocation
import redDressPic from '../assets/clothes/redDressPic.jpeg';
import DenimJacketpic from '../assets/clothes/Denimjacketpic.jpeg';
import whiteTeeImg from '../assets/clothes/whiteTeeImg.jpeg';
import floralDressImg from '../assets/clothes/floralDressImg.jpeg';


// --- DUMMY DATA ---
const DUMMY_PRODUCTS = [
  { 
    _id: 1, 
    name: "Casual Denim Jacket", 
    category: "Jacket", 
    material: "Denim", 
    price: 89, 
    image: DenimJacketpic // <--- No quotes! Use the variable.
  },
  { 
    _id: 2, 
    name: "White Cotton Tee", 
    category: "Shirt", 
    material: "Cotton", 
    price: 25, 
    image: whiteTeeImg 
  },
  { 
    _id: 3, 
    name: "Summer Floral Dress", 
    category: "Dress", 
    material: "Silk", 
    price: 65, 
    image: floralDressImg 
  },
  { 
      id: 4, 
      name: "Red Evening Dress", 
      type: "dress", 
      img: redDressPic // <--- Use variable here
    },
    { 
    _id: 5, 
    name: "Classic Blue Jeans", 
    category: "Pant", // Must match the category filter "Pant"
    material: "Denim", 
    price: 55, 
    image: pants
  },
  { 
    _id: 6, 
    name: "Classic Blue Jeans", 
    category: "All", // Must match the category filter "Pant"
    material: "Denim", 
    price: 55, 
    image: pants
  },
  // ... rest of your items
];

 

const DEFAULT_IMAGES = {
  Shirt: "https://placehold.co/400x500/3498db/ffffff?text=Shirt",
  Pant: "https://placehold.co/400x500/2c3e50/ffffff?text=Pant",
  Dress: "https://placehold.co/400x500/e84393/ffffff?text=Dress",
  Jacket: "https://placehold.co/400x500/e67e22/ffffff?text=Jacket",
  Default: "https://placehold.co/400x500/95a5a6/ffffff?text=All"
};

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "👕 Shirts", value: "Shirt" },
  { label: "👖 Pants", value: "Pant" },
  { label: "👗 Dresses", value: "Dress" },
  { label: "🧥 Jackets", value: "Jacket" }
];

const getFallbackImage = (category) => {
  if (!category) return DEFAULT_IMAGES.Default;
  const key = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  return DEFAULT_IMAGES[key] || DEFAULT_IMAGES.Default;
};

// --- SUB-COMPONENT: PRODUCT CARD ---
const ProductCard = ({ product, onAddToCart, onTryOn }) => {
  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = getFallbackImage(product.category);
  };

  const imageSrc = (product.image && product.image.trim() !== "") 
    ? product.image 
    : getFallbackImage(product.category);

  return (
    <div className="product-card">
      <div className="image-wrapper">
        <img src={imageSrc} alt={product.name} onError={handleImageError} />
        <span className={`badge ${product.category?.toLowerCase()}`}>
            {product.category || 'Item'}
        </span>
        <button className="try-on-trigger" onClick={() => onTryOn(product)}>✨ Try On</button>
      </div>
      <div className="details">
        <div className="info">
          <h3>{product.name}</h3>
          <p className="material">{product.material}</p>
        </div>
        <div className="action-row">
          <span className="price">${product.price}</span>
          <button onClick={() => onAddToCart(product)} className="cart-btn">Add +</button>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="product-card skeleton">
    <div className="image-wrapper shimmer"></div>
    <div className="details"><div className="shimmer-text short"></div><div className="shimmer-text long"></div></div>
  </div>
);

// --- MAIN COMPONENT ---
const Shop = ({ addToCart }) => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Init Location Hook
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', sort: '' });
  
  // New state to hold temporary AI items
  const [aiItems, setAiItems] = useState([]);

  const initialFormState = { name: '', category: 'Shirt', material: 'Cotton', price: '', image: '' };
  const [newItem, setNewItem] = useState(initialFormState);

  // --- 3. HANDLE INCOMING AI ITEM ---
  useEffect(() => {
    if (location.state && location.state.aiProduct) {
        const { aiProduct, aiSearch } = location.state;
        
        // Convert AI item format to Shop Item format
        const newShopItem = {
            _id: Date.now(), // Generate unique ID
            name: aiProduct.name,
            category: aiProduct.type, // Ensure AI sends 'Shirt', 'Pant' etc.
            material: "AI Recommended",
            price: parseFloat(aiProduct.price.replace('$', '')),
            image: aiProduct.img
        };

        // Add to temporary list
        setAiItems(prev => [newShopItem, ...prev]);
        
        // Auto-set the search filter
        setFilters(prev => ({ ...prev, search: aiSearch }));
        
        // Clean history
        window.history.replaceState({}, document.title);
        // eslint-disable-next-line react-hooks/immutability
        showToast("AI Selection Found!", "success");
    }
  }, [location]);

  // --- FETCH DATA ---
  useEffect(() => {
    let isMounted = true;
    
    const fetchAll = async () => {
      setLoading(true);
      let activeProducts = [];

      try {
        const data = await getProducts(filters);
        if (data && data.length > 0) activeProducts = data;
      } catch (e) {
        console.warn("Backend offline");
      }

      // If no backend data, use Dummy Data + AI Items
      if (activeProducts.length === 0) {
          // Combine standard dummy items with any new AI items
          const allItems = [...aiItems, ...DUMMY_PRODUCTS];
          
          activeProducts = allItems.filter(product => {
              const matchCat = filters.category ? product.category === filters.category : true;
              const matchSearch = filters.search ? product.name.toLowerCase().includes(filters.search.toLowerCase()) : true;
              return matchCat && matchSearch;
          });
      }

      if (isMounted) {
          setProducts(activeProducts);
          setLoading(false);
      }
    };
    
    const timer = setTimeout(fetchAll, 300); 
    return () => { clearTimeout(timer); isMounted = false; };
  }, [filters, aiItems]); // Re-run when AI items change

  // HANDLERS
  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleCategorySelect = (value) => setFilters({ ...filters, category: value });
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
      showToast(`Added ${product.name} to bag!`);
    }
  };

  const handleTryOn = (product) => {
    const itemToSend = {
        id: product._id || Date.now(),
        name: product.name,
        type: product.category === 'Dress' ? 'dress' : 'top', 
        img: product.image && product.image.trim() !== "" ? product.image : getFallbackImage(product.category)
    };
    navigate('/try-on', { state: { tryOnItem: itemToSend } });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const imageToUse = newItem.image.trim() !== "" ? newItem.image : getFallbackImage(newItem.category);
      const payload = { ...newItem, price: parseFloat(newItem.price), image: imageToUse };
      
      await createProduct(payload);
      showToast("Item listed successfully!");
      setProducts(prev => [payload, ...prev]); 
      setShowAddForm(false);
      setNewItem(initialFormState);
    } catch (error) {
      showToast("Server error (Check console)", "error");
    }
  };

  return (
    <div className="shop-container">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="shop-header">
        <div>
           <h1>New Arrivals</h1>
           <p>Explore the AI-curated fashion collection</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="sell-btn">+ Add Item</button>
      </div>

      <div className="controls-bar">
        <div className="search-box">
           <span>🔍</span>
           <input name="search" placeholder="Search products..." value={filters.search} onChange={handleFilterChange} />
        </div>
        <div className="sort-box">
           <select name="sort" value={filters.sort} onChange={handleFilterChange}>
              <option value="">Sort By: Default</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
           </select>
        </div>
      </div>

      <div className="category-scroll">
        {CATEGORIES.map((cat) => (
            <button key={cat.label} className={`cat-pill ${filters.category === cat.value ? 'active' : ''}`} onClick={() => handleCategorySelect(cat.value)}>
                {cat.label}
            </button>
        ))}
      </div>

      <div className="product-grid">
        {loading ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />) : 
         products.length === 0 ? <div className="no-results">No items found matching your filters.</div> : 
         products.map((p, index) => (
            <ProductCard key={p._id || index} product={p} onAddToCart={handleAddToCart} onTryOn={handleTryOn} />
         ))
        }
      </div>

      {showAddForm && (
        <div className="modal-backdrop" onClick={() => setShowAddForm(false)}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Add Product</h2>
              <form onSubmit={handleAddItem}>
                  <input className="input-field" placeholder="Product Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                  <div className="form-group-row">
                     <div className="half-width">
                         <select className="input-field category-select" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                            <option value="Shirt">Shirt</option>
                            <option value="Pant">Pant</option>
                            <option value="Dress">Dress</option>
                            <option value="Jacket">Jacket</option>
                         </select>
                     </div>
                     <div className="half-width">
                         <input className="input-field" type="number" placeholder="Price ($)" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
                     </div>
                  </div>
                  <input className="input-field" placeholder="Material (e.g. Cotton)" value={newItem.material} onChange={e => setNewItem({...newItem, material: e.target.value})} required />
                  <input className="input-field" placeholder="Image URL (http://...)" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
                  <button type="submit" className="submit-btn">Save Product</button>
              </form>
           </div>
        </div>
      )}

      <style>{`
        .shop-container { padding: 40px 5%; background: #082b4eff; min-height: 100vh; font-family: 'Segoe UI', sans-serif; color: white; }
        .shop-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
        .shop-header h1 { margin: 0; font-size: 2rem; color: #fff; }
        .shop-header p { margin: 5px 0 0 0; color: #a0aec0; }
        .sell-btn { background: #00b894; color: white; border: none; padding: 10px 25px; border-radius: 25px; cursor: pointer; font-weight: bold; transition: transform 0.2s; }
        .sell-btn:hover { transform: scale(1.05); }
        .controls-bar { display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
        .search-box { flex: 2; background: rgba(255,255,255,0.1); backdrop-filter: blur(5px); padding: 10px 20px; border-radius: 30px; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(255,255,255,0.2); }
        .search-box input { background: transparent; border: none; outline: none; width: 100%; color: white; font-size: 1rem; }
        .search-box input::placeholder { color: #cbd5e0; }
        .sort-box select { padding: 12px 20px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; cursor: pointer; outline: none; }
        .sort-box select option { background: #082b4eff; color: white; }
        .category-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 15px; margin-bottom: 20px; scrollbar-width: none; }
        .category-scroll::-webkit-scrollbar { display: none; }
        .cat-pill { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); color: #e2e8f0; padding: 10px 20px; border-radius: 50px; cursor: pointer; white-space: nowrap; transition: all 0.3s ease; }
        .cat-pill:hover { background: rgba(255, 255, 255, 0.15); }
        .cat-pill.active { background: #00b894; color: white; border-color: #00b894; font-weight: bold; transform: translateY(-2px); }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 30px; }
        .no-results { grid-column: 1 / -1; text-align: center; color: #a0aec0; padding: 40px; font-size: 1.2rem; }
        .product-card { background: white; border-radius: 20px; overflow: hidden; transition: 0.3s; position: relative; color: #333; display: flex; flex-direction: column; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        .image-wrapper { height: 280px; position: relative; background: #f0f0f0; overflow: hidden; }
        .image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .product-card:hover .image-wrapper img { transform: scale(1.05); }
        .badge { position: absolute; top: 15px; right: 15px; padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; color: white; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
        .badge.shirt { background: #3498db; } .badge.pant { background: #2c3e50; } .badge.dress { background: #e84393; } .badge.jacket { background: #e67e22; }
        .try-on-trigger { position: absolute; bottom: 15px; left: 50%; transform: translate(-50%, 20px); background: rgba(255,255,255,0.9); color: #082b4eff; border: none; padding: 8px 18px; border-radius: 20px; font-weight: bold; cursor: pointer; opacity: 0; transition: all 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .image-wrapper:hover .try-on-trigger { transform: translate(-50%, 0); opacity: 1; }
        .details { padding: 18px; display: flex; flex-direction: column; flex: 1; justify-content: space-between; }
        .details h3 { margin: 0 0 5px 0; font-size: 1.1rem; color: #1a202c; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .material { color: #718096; font-size: 0.85rem; margin: 0; }
        .action-row { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; }
        .price { font-size: 1.3rem; font-weight: 800; color: #082b4eff; }
        .cart-btn { background: #082b4eff; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: 0.2s; font-weight: 600; }
        .cart-btn:hover { background: #0a365f; }
        .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(4px); }
        .modal-content { background: white; padding: 30px; border-radius: 20px; width: 400px; color: #333; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .input-field { padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; width: 100%; box-sizing: border-box; margin-bottom: 12px; font-size: 1rem; }
        .form-group-row { display: flex; gap: 10px; }
        .half-width { flex: 1; }
        .submit-btn { width: 100%; padding: 14px; background: #00b894; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 1rem; margin-top: 10px; }
        .toast { position: fixed; bottom: 30px; right: 30px; background: #333; color: white; padding: 12px 25px; border-radius: 50px; z-index: 2000; box-shadow: 0 10px 20px rgba(0,0,0,0.2); animation: fadeIn 0.3s; }
        .toast.error { background: #e74c3c; }
        @keyframes fadeIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Shop;