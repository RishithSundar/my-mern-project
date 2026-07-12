import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

// Accept the searchQuery prop passed down from App.jsx
function Home({ searchQuery = '' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [sortOrder, setSortOrder] = useState('popular');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Fetch all products from your Node.js backend
    axios.get('http://localhost:8000/api/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Checkbox toggle helpers
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleGenderToggle = (gender) => {
    setSelectedGenders(prev => 
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  // --- THE FILTERING ENGINE ---
  let displayedProducts = [...products];

  // 1. Search Filter (from the Top Nav Bar)
  if (searchQuery) {
    displayedProducts = displayedProducts.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // 2. Category Sidebar Filter
  if (selectedCategories.length > 0) {
    displayedProducts = displayedProducts.filter(p => selectedCategories.includes(p.category));
  }
  
  // 3. Gender Sidebar Filter
  if (selectedGenders.length > 0) {
    displayedProducts = displayedProducts.filter(p => selectedGenders.includes(p.gender));
  }

  // 4. Sorting logic
  if (sortOrder === 'low-high') displayedProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === 'high-low') displayedProducts.sort((a, b) => b.price - a.price);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '30px' }}>
      
      {/* --- LEFT SIDEBAR (FILTERS) --- */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        <h2 style={{ color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Filters</h2>
        
        {/* Sort By Radios */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#555', marginBottom: '10px' }}>Sort By</h4>
          <label style={{ display: 'block', marginBottom: '8px', color: '#666', cursor: 'pointer' }}>
            <input type="radio" name="sort" checked={sortOrder === 'popular'} onChange={() => setSortOrder('popular')} /> Popular
          </label>
          <label style={{ display: 'block', marginBottom: '8px', color: '#666', cursor: 'pointer' }}>
            <input type="radio" name="sort" checked={sortOrder === 'low-high'} onChange={() => setSortOrder('low-high')} /> Price (low to high)
          </label>
          <label style={{ display: 'block', marginBottom: '8px', color: '#666', cursor: 'pointer' }}>
            <input type="radio" name="sort" checked={sortOrder === 'high-low'} onChange={() => setSortOrder('high-low')} /> Price (high to low)
          </label>
        </div>

        {/* Categories Checkboxes */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#555', marginBottom: '10px' }}>Categories</h4>
          {['Footwear', 'Clothing', 'Accessories', 'Electronics'].map(cat => (
            <label key={cat} style={{ display: 'block', marginBottom: '8px', color: '#666', cursor: 'pointer' }}>
              <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryToggle(cat)} /> {cat}
            </label>
          ))}
        </div>

        {/* Gender Checkboxes */}
        <div>
          <h4 style={{ color: '#555', marginBottom: '10px' }}>Gender</h4>
          {['Men', 'Women', 'Unisex'].map(gen => (
            <label key={gen} style={{ display: 'block', marginBottom: '8px', color: '#666', cursor: 'pointer' }}>
              <input type="checkbox" checked={selectedGenders.includes(gen)} onChange={() => handleGenderToggle(gen)} /> {gen}
            </label>
          ))}
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={{ flex: '1' }}>
        
        {/* Promotional Banner */}
        <div style={{ width: '100%', height: '250px', backgroundColor: '#ffd54f', borderRadius: '12px', marginBottom: '30px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <img 
              src="https://img.freepik.com/free-vector/flat-sale-banner-with-photo_23-2149026968.jpg?w=1380" 
              alt="Sale Banner" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
           />
        </div>

        <h2 style={{ color: '#333', marginBottom: '20px' }}>All Products</h2>
        
        {loading ? (
          <p>Loading products from database...</p>
        ) : displayedProducts.length === 0 ? (
          <p style={{ fontSize: '18px', color: '#888', marginTop: '20px' }}>No products match your filters or search. Try clearing them!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            
            {/* Map through the FILTERED products */}
            {displayedProducts.map((product) => (
              <div key={product._id} style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid #eee' }}>
                
                {/* Product Image */}
                <div style={{ height: '220px', width: '100%', backgroundColor: '#fff', padding: '10px' }}>
                  <img 
                    src={product.mainImg || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error' }}
                  />
                </div>

                {/* Product Details & Buttons */}
                <div style={{ padding: '15px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#333' }}>{product.title}</h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888' }}>{product.description.substring(0, 40)}...</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#333', margin: 0 }}>₹{product.price}</p>
                    <p style={{ textDecoration: 'line-through', color: '#aaa', fontSize: '14px', margin: 0 }}>₹{(product.price * 1.2).toFixed(0)}</p>
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link 
                      to={`/product/${product._id}`} 
                      state={{ product: product }} 
                      style={{ textAlign: 'center', backgroundColor: '#fff', color: '#5e35b1', border: '1px solid #5e35b1', padding: '8px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
                    >
                      View Details
                    </Link>
                    
                    <button 
                      onClick={() => addToCart(product)}
                      style={{ backgroundColor: '#5e35b1', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Home;