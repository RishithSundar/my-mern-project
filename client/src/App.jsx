import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart'; 
import ProductDetails from './pages/ProductDetails'; 
import Admin from './pages/Admin'; 
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute'; 
import { CartProvider } from './context/CartContext'; 

function App() {
  const isLoggedIn = !!localStorage.getItem('token');
  
  // --- Read the user data from memory to check their role ---
  const userDataString = localStorage.getItem('user');
  const currentUser = userDataString ? JSON.parse(userDataString) : null;
  
  // FIXED: Added .toLowerCase() to safely handle "Admin" or "admin" from the database
  const isAdmin = currentUser?.usertype?.toLowerCase() === 'admin';

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <CartProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', color: '#333' }}>
        <BrowserRouter>
          
          <nav style={{ 
            padding: '15px 40px', 
            backgroundColor: '#5e35b1', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            
            <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>ShopEZ</Link>
            </div>

            <div style={{ flex: '1', maxWidth: '500px', margin: '0 20px' }}>
              <input 
                type="text" 
                placeholder="Search Electronics, Fashion, mobiles, etc." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 15px', borderRadius: '20px', border: 'none', outline: 'none', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '25px', alignItems: 'center', fontSize: '16px' }}>
              <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Cart 🛒</Link>
              
              {/* --- Only show the Admin link if the user is an admin! --- */}
              {isAdmin && (
                <Link to="/admin" style={{ color: '#ffd54f', textDecoration: 'none', fontWeight: 'bold' }}>Admin Panel</Link>
              )}
              
              {!isLoggedIn ? (
                <Link to="/login" style={{ backgroundColor: 'white', color: '#5e35b1', padding: '8px 20px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>
                  Login
                </Link>
              ) : (
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                  <span style={{ fontSize: '20px' }}>👤</span> Profile
                </Link>
              )}
            </div>
          </nav>

          <div style={{ padding: '20px' }}>
            <Routes>
              {/* --- PUBLIC ROUTES --- */}
              <Route path="/" element={<Home searchQuery={searchQuery} />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* --- SECURE ROUTES --- */}
              
              {/* Profile requires you to be logged in */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              /> 
              
              {/* Admin requires you to be logged in AND be an Admin */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>

        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;