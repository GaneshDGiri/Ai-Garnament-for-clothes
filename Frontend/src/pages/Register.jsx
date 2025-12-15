/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authStyles } from './Login'; // Reuse styles

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    favColor: '' // <--- NEW FIELD
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send favColor to your backend
      await axios.post('http://localhost:5000/api/register', formData);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
    <div style={authStyles.page}>
      <div style={authStyles.card}>
        <div style={authStyles.header}>
          <h2 style={authStyles.title}>Create Account</h2>
          <p style={authStyles.subtitle}>Join us for a personalized style experience</p>
        </div>

        <form onSubmit={handleSubmit} style={authStyles.form}>
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Full Name</label>
            <input 
              type="text" required style={authStyles.input}
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Email</label>
            <input 
              type="email" required style={authStyles.input}
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Password</label>
            <input 
              type="password" required style={authStyles.input}
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          {/* --- NEW SECURITY QUESTION SECTION --- */}
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Security Question</label>
            <div style={{fontSize: '0.9rem', color: '#555', marginBottom: '5px'}}>
                What is your favorite color?
            </div>
            <input 
              type="text" 
              placeholder="e.g. Blue" 
              required 
              style={authStyles.input}
              onChange={(e) => setFormData({...formData, favColor: e.target.value})} 
            />
          </div>

          <button type="submit" style={authStyles.button}>Sign Up</button>
        </form>

        <p style={authStyles.footer}>
          Already have an account? <Link to="/login" style={authStyles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;