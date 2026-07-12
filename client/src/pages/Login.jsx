import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    usertype: 'user' // Default starting value
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = isSignUp 
      ? 'http://localhost:8000/api/auth/register' 
      : 'http://localhost:8000/api/auth/login';

    try {
      const response = await axios.post(endpoint, formData);
      
      if (isSignUp) {
        alert('Account created successfully! 🎉 Please sign in.');
        setIsSignUp(false); 
      } else {
        // Save the token...
        localStorage.setItem('token', response.data.token);
        
        // Save the user data (including their role!)...
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
        
        alert('Welcome back!');
        window.location.href = '/'; 
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.response?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <h2 style={{ textAlign: 'center', color: '#5e35b1', marginBottom: '20px', marginTop: 0 }}>
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {isSignUp && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  required 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} 
                />
              </div>

              {/* --- NEW: The Role Selector Dropdown! --- */}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Account Role</label>
                <select 
                  name="usertype" 
                  value={formData.usertype} 
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', backgroundColor: '#f9f9f9' }}
                >
                  <option value="user">Normal Shopper</option>
                  <option value="admin">Store Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              onChange={handleInputChange} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: 'bold' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              onChange={handleInputChange} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ padding: '15px', backgroundColor: '#5e35b1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#666', margin: 0 }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: '#5e35b1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '5px' }}
          >
            {isSignUp ? 'Sign In instead' : 'Create one now'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;