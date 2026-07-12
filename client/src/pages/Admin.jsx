import { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [orders, setOrders] = useState([]);
  
  // States for adding a new product (Keeping your existing functionality!)
  const [newProduct, setNewProduct] = useState({
    title: '', description: '', price: '', category: 'Clothing', gender: 'Unisex', mainImg: '', sizes: ''
  });

  // Fetch orders when the component loads
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Handle changing the order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/orders/${orderId}`, { status: newStatus });
      alert(`Order status updated to: ${newStatus}`);
      fetchOrders(); // Refresh the list to show the new status
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // Handle product submission
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productToSave = {
        ...newProduct,
        price: Number(newProduct.price),
        sizes: newProduct.sizes.split(',').map(s => s.trim()) // Convert "S, M, L" to array
      };
      
      await axios.post('http://localhost:8000/api/products', productToSave);
      alert("Product added successfully! 🎉");
      setNewProduct({ title: '', description: '', price: '', category: 'Clothing', gender: 'Unisex', mainImg: '', sizes: '' });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Store Admin Panel</h1>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{ padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'orders' ? '#5e35b1' : '#ddd', color: activeTab === 'orders' ? 'white' : '#333' }}
        >
          Manage Orders
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          style={{ padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: activeTab === 'products' ? '#5e35b1' : '#ddd', color: activeTab === 'products' ? 'white' : '#333' }}
        >
          Add New Product
        </button>
      </div>

      {/* --- TAB 1: MANAGE ORDERS --- */}
      {activeTab === 'orders' && (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>Recent Customer Orders</h2>
          
          {orders.length === 0 ? (
            <p style={{ color: '#888' }}>No orders have been placed yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                  <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Order ID</th>
                  <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Customer Email</th>
                  <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Amount</th>
                  <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Current Status</th>
                  <th style={{ padding: '15px', borderBottom: '2px solid #ddd' }}>Update Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', color: '#555', fontSize: '14px' }}>{order._id.substring(0, 10).toUpperCase()}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#333' }}>{order.userEmail}</td>
                    <td style={{ padding: '15px', color: '#28a745', fontWeight: 'bold' }}>₹{order.totalAmount.toFixed(2)}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ 
                        padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase',
                        backgroundColor: order.status === 'Delivered' ? '#d4edda' : order.status === 'In-transit' ? '#fff3cd' : '#e2e3e5',
                        color: order.status === 'Delivered' ? '#155724' : order.status === 'In-transit' ? '#856404' : '#383d41'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
                      >
                        <option value="Order placed">Order placed</option>
                        <option value="In-transit">In-transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- TAB 2: ADD NEW PRODUCT --- */}
      {activeTab === 'products' && (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>Upload New Product</h2>
          <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Product Title" required value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <textarea placeholder="Description" required value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '80px' }} />
            <input type="number" placeholder="Price (₹)" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Image URL (http://...)" required value={newProduct.mainImg} onChange={(e) => setNewProduct({...newProduct, mainImg: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Sizes (e.g. 8, 9, 10 or S, M, L)" required value={newProduct.sizes} onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="Footwear">Footwear</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Electronics">Electronics</option>
              </select>
              <select value={newProduct.gender} onChange={(e) => setNewProduct({...newProduct, gender: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
            
            <button type="submit" style={{ padding: '12px', backgroundColor: '#ffd54f', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Upload Product</button>
          </form>
        </div>
      )}

    </div>
  );
}

export default Admin;