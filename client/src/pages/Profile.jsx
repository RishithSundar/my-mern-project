import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all orders from the database
    axios.get('http://localhost:8000/api/orders')
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px' }}>
      
      {/* LEFT SIDEBAR: User Info */}
      <div style={{ width: '300px', flexShrink: 0 }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'sticky', top: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#5e35b1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
              👤
            </div>
            <div>
              <h2 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '20px' }}>My Profile</h2>
              <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Welcome back!</p>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginBottom: '20px' }}>
            <p style={{ margin: '0 0 10px 0', color: '#555' }}><strong>Total Orders:</strong> {orders.length}</p>
          </div>

          <button 
            onClick={handleLogout}
            style={{ width: '100%', background: '#ff4d4d', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: Order History */}
      <div style={{ flex: '1' }}>
        <h2 style={{ color: '#333', marginTop: 0, marginBottom: '20px' }}>My Orders</h2>
        
        {loading ? (
          <p>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '18px', color: '#666' }}>You haven't placed any orders yet.</p>
            <Link to="/" style={{ color: '#5e35b1', textDecoration: 'none', fontWeight: 'bold' }}>Start Shopping →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Map through all orders */}
            {orders.map((order) => (
              <div key={order._id} style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                
                {/* Order Header */}
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: '#888', fontSize: '12px' }}>ORDER ID: {order._id.substring(0, 10).toUpperCase()}</span>
                    <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#333' }}>Total: ₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                  
                  {/* Dynamic Status Badge */}
                  <div style={{ 
                    padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase',
                    backgroundColor: order.status === 'Delivered' ? '#d4edda' : order.status === 'In-transit' ? '#fff3cd' : '#e2e3e5',
                    color: order.status === 'Delivered' ? '#155724' : order.status === 'In-transit' ? '#856404' : '#383d41'
                  }}>
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ padding: '20px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: idx !== order.items.length - 1 ? '15px' : '0', borderBottom: idx !== order.items.length - 1 ? '1px solid #eee' : 'none', paddingBottom: idx !== order.items.length - 1 ? '15px' : '0' }}>
                      <div style={{ width: '80px', height: '80px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
                        <img src={item.mainImg || 'https://via.placeholder.com/80'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                      </div>
                      <div style={{ flex: '1' }}>
                        <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{item.title}</h4>
                        <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}</p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#aaa' }}>Shipping to: {order.shippingData.address}, {order.shippingData.pincode}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Profile;