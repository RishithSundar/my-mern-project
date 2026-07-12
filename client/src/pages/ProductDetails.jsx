import { useContext, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function ProductDetails() {
  const location = useLocation();
  const product = location.state?.product; 

  const { addToCart } = useContext(CartContext);
  
  // States for user selections
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Safety check if accessed directly without clicking a product
  if (!product) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Product not found!</h2>
        <Link to="/" style={{ color: '#5e35b1', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Go back to the store
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '40px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      
      {/* The Real Product Image */}
      <div style={{ flex: '1', height: '500px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src={product.mainImg || 'https://via.placeholder.com/500x500?text=No+Image'} 
          alt={product.title}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500?text=Image+Error' }}
        />
      </div>

      {/* Product Information Area */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Link to="/" style={{ color: '#888', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>← Back to Store</Link>
        
        <h1 style={{ margin: '0 0 10px 0', lineHeight: '1.2', color: '#333' }}>{product.title}</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <span style={{ background: '#eee', color: '#555', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            {product.category} | {product.gender}
          </span>
        </div>
        
        <h2 style={{ color: '#5e35b1', fontSize: '32px', margin: '0 0 20px 0' }}>₹{product.price}</h2>
        
        <p style={{ lineHeight: '1.6', color: '#666', marginBottom: '30px' }}>{product.description}</p>

        {/* Dynamic Size Selector */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>Select Size:</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {product.sizes.map(size => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{ 
                  padding: '10px 20px', 
                  border: selectedSize === size ? '2px solid #5e35b1' : '1px solid #ccc',
                  background: selectedSize === size ? '#f3e5f5' : 'white',
                  color: selectedSize === size ? '#5e35b1' : '#333',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selector */}
        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <p style={{ fontWeight: 'bold', margin: 0, color: '#333' }}>Quantity:</p>
          <select 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', outline: 'none' }}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Add to Cart button */}
        <button 
          onClick={() => {
            if (!selectedSize) {
              alert("Please select a size first! 📏");
              return;
            }
            addToCart({ ...product, selectedSize, quantity });
          }}
          style={{ background: '#5e35b1', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', width: '100%', transition: 'background 0.2s' }}
        >
          Add to Cart 🛒
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;