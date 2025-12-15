/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. REAL API CALL (Uncomment when backend is ready)
      // const res = await axios.post('http://localhost:5000/api/login', formData);
      // localStorage.setItem('token', res.data.token);
      // localStorage.setItem('user', JSON.stringify(res.data.user));

      // 2. MOCK LOGIN (For demo/testing without backend)
      // This simulates a successful login response so you can enter the dashboard
      const mockResponse = { 
        data: { 
            token: "abc-123-xyz-mock-token", 
            user: { 
                name: "Demo User", 
                email: formData.email, 
                profileImage: "" 
            } 
        } 
      };
      
      localStorage.setItem('token', mockResponse.data.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.data.user));
      
      // 3. Redirect to Dashboard
      navigate("/dashboard"); 
      
    } catch (err) {
      console.error(err);
      alert("Invalid Email or Password");
    }
  };

  return (
    <div style={authStyles.page}>
      <div style={authStyles.card}>
        <div style={authStyles.header}>
          <h2 style={authStyles.title}>Welcome Back</h2>
          <p style={authStyles.subtitle}>Sign in to access your AI Stylist</p>
        </div>

        <form onSubmit={handleSubmit} style={authStyles.form}>
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Email</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              style={authStyles.input} 
              required
            />
          </div>
          
          <div style={authStyles.inputGroup}>
            <label style={authStyles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              style={authStyles.input} 
              required
            />
            {/* --- FORGOT PASSWORD LINK --- */}
            <div style={{textAlign: 'right', marginTop: '8px'}}>
                <Link to="/forgot-password" style={{fontSize: '0.85rem', color: '#00b894', textDecoration: 'none', fontWeight: '600'}}>
                    Forgot Password?
                </Link>
            </div>
          </div>

          <button type="submit" style={authStyles.button}>Sign In</button>
        </form>

        <p style={authStyles.footer}>
          Don't have an account? <Link to="/register" style={authStyles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

// --- EXPORT STYLES FOR REUSE (Register.jsx & ForgotPassword.jsx use these) ---
export const authStyles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa', fontFamily: "'Segoe UI', sans-serif" },
  card: { width: '100%', maxWidth: '400px', background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '1.8rem', margin: '0 0 10px 0', color: '#2d3436' },
  subtitle: { color: '#636e72', margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.9rem', fontWeight: 'bold', color: '#333' },
  input: { padding: '12px 15px', borderRadius: '8px', border: '1px solid #dfe6e9', fontSize: '1rem', outline: 'none', transition: 'border 0.2s', width: '100%', boxSizing: 'border-box' },
  button: { padding: '14px', background: '#00b894', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', marginTop: '10px' },
  footer: { textAlign: 'center', marginTop: '20px', color: '#636e72', fontSize: '0.9rem' },
  link: { color: '#00b894', textDecoration: 'none', fontWeight: 'bold' }
};

export default Login;