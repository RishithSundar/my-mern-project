import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // <-- 1. Added Axios to talk to the backend!

function Cart() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // 1. State to control if the popup is visible
  const [showCheckout, setShowCheckout] = useState(false);
  
  // 2. State to hold the shipping details
  const [shippingData, setShippingData] = useState({
    name: '', mobile: '', email: '', address: '', pincode: '', paymentMethod: 'netbanking'
  });

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // 3. Handle typing in the checkout form
  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  // 4. REAL DATABASE SUBMISSION: Handle the final order submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault(); // Stop page from refreshing
    
    // Package up everything the backend needs
    const orderData = {
      userEmail: shippingData.email,
      items: cart,
      shippingData: shippingData,
      totalAmount: totalPrice
    };

    try {
      // Send it to your Node.js backend!
      await axios.post('http://localhost:8000/api/orders', orderData);
      
      alert(`Order Placed Successfully! 🎉\nShipping to: ${shippingData.name}, ${shippingData.address}`);
      
      clearCart();
      setShowCheckout(false); // Close the modal
      navigate('/'); // Send them back home

    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an issue placing your order. Please try again.");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '30px' }}>
      
      {/* LEFT SIDE: Cart Items */}
      <div style={{ flex: '2', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '30px' }}>
        <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', color: '#333', marginTop: 0 }}>Shopping Cart</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>Your cart is empty.</p>
            <Link to="/" style={{ color: '#5e35b1', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
              ← Continue Shopping
            </Link>
          </div>
        ) : (
          <div>
            {cart.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid #eee', padding: '20px 0' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#f4f4f4', borderRadius: '8px', overflow: 'hidden' }}>
                   <img src={item.mainImg || 'https://via.placeholder.com/80'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: '1' }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{item.title}</h3>
                  <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>
                    {item.category} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                  </p>
                  <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#555' }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontWeight: 'bold', fontSize: '20px', color: '#5e35b1', margin: 0 }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE: Price Details (Only show if cart has items) */}
      {cart.length > 0 && (
        <div style={{ flex: '1', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '30px', height: 'fit-content' }}>
          <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', color: '#333', marginTop: 0, fontSize: '20px' }}>Price Details</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#555' }}>
            <span>Total MRP:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#28a745' }}>
            <span>Discount:</span>
            <span>- ₹0</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#555', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
            <span>Delivery Charges:</span>
            <span>+ ₹0</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Final Price:</span>
            <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#5e35b1' }}>₹{totalPrice.toFixed(2)}</span>
          </div>

          <button 
            onClick={() => setShowCheckout(true)} // This opens the modal!
            style={{ width: '100%', background: '#5e35b1', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background 0.2s' }}
          >
            Place order
          </button>
        </div>
      )}

      {/* --- THE CHECKOUT MODAL OVERLAY --- */}
      {showCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          
          {/* The Modal Box */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', position: 'relative' }}>
            
            {/* Close Button ("X") */}
            <button 
              onClick={() => setShowCheckout(false)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}
            >
              ✖
            </button>
            
            <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>Checkout details</h2>

            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input name="name" placeholder="Full Name" required onChange={handleInputChange} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }} />
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <input name="mobile" placeholder="Mobile Number" required onChange={handleInputChange} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }} />
                <input name="email" type="email" placeholder="Email Address" required onChange={handleInputChange} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <input name="address" placeholder="Full Address" required onChange={handleInputChange} style={{ flex: 2, padding: '12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }} />
                <input name="pincode" placeholder="Pincode" required onChange={handleInputChange} style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Payment method</label>
                <select name="paymentMethod" onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}>
                  <option value="netbanking">Net Banking</option>
                  <option value="card">Card Payment</option>
                  <option value="upi">UPI</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCheckout(false)} style={{ padding: '10px 20px', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#555' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#5e35b1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Order</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Cart;