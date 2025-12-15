import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic Validation
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (formData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    // 2. Simulate API Call
    // In a real app, you would use: await axios.post('/api/change-password', formData);
    console.log("Updating password...", formData);

    // Simulate Network Delay
    setTimeout(() => {
        alert("Password Changed Successfully! Please login again.");
        
        // 3. Clear Token and Redirect to Login
        localStorage.clear();
        navigate('/login');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '12px', background: 'white' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Change Password</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
            <label style={labelStyle}>Current Password</label>
            <input 
                type="password" 
                name="oldPassword" 
                required 
                style={inputStyle} 
                onChange={handleChange}
            />
        </div>

        <div>
            <label style={labelStyle}>New Password</label>
            <input 
                type="password" 
                name="newPassword" 
                required 
                style={inputStyle} 
                onChange={handleChange}
            />
        </div>

        <div>
            <label style={labelStyle}>Confirm New Password</label>
            <input 
                type="password" 
                name="confirmPassword" 
                required 
                style={inputStyle} 
                onChange={handleChange}
            />
        </div>

        <button type="submit" style={submitBtnStyle}>
          Update Password
        </button>

        <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            style={cancelBtnStyle}
        >
          Cancel
        </button>

      </form>
    </div>
  );
};

// Styles
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#555' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' };
const submitBtnStyle = { padding: '12px', background: '#00b894', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const cancelBtnStyle = { padding: '10px', background: 'transparent', color: '#555', border: 'none', cursor: 'pointer', textDecoration: 'underline' };

export default ChangePassword;