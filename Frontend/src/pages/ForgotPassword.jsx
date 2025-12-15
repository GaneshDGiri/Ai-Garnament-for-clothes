import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStyles } from './Login'; // Reuse styles

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Security Q, 3: Reset
  const [data, setData] = useState({ email: '', color: '', newPassword: '' });

  // Handle Step 1: Submit Email
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Simulate checking backend if email exists
    console.log("Checking email:", data.email);
    setStep(2);
  };

  // Handle Step 2: Verify Security Question
  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    // Simulate verifying color with backend
    // In real app: axios.post('/api/verify-security', { email: data.email, answer: data.color })
    if (data.color.trim().length > 0) {
        setStep(3);
    } else {
        alert("Please enter your favorite color");
    }
  };

  // Handle Step 3: Reset Password
  const handleResetSubmit = (e) => {
    e.preventDefault();
    // Simulate password reset
    // axios.post('/api/reset-password', ... )
    alert("Password successfully reset! Please login.");
    navigate('/login');
  };

  return (
    <div style={authStyles.page}>
      <div style={authStyles.card}>
        <div style={authStyles.header}>
          <h2 style={authStyles.title}>Forgot Password?</h2>
          <p style={authStyles.subtitle}>
            {step === 1 && "Enter your email to locate your account"}
            {step === 2 && "Answer your security question"}
            {step === 3 && "Create a new password"}
          </p>
        </div>

        {/* STEP 1: EMAIL */}
        {step === 1 && (
            <form onSubmit={handleEmailSubmit} style={authStyles.form}>
                <div style={authStyles.inputGroup}>
                    <label style={authStyles.label}>Email Address</label>
                    <input 
                        type="email" required placeholder="name@example.com" style={authStyles.input}
                        onChange={(e) => setData({...data, email: e.target.value})}
                    />
                </div>
                <button type="submit" style={authStyles.button}>Next</button>
            </form>
        )}

        {/* STEP 2: SECURITY QUESTION */}
        {step === 2 && (
            <form onSubmit={handleSecuritySubmit} style={authStyles.form}>
                <div style={authStyles.inputGroup}>
                    <label style={authStyles.label}>Security Hint</label>
                    <p style={{margin: '0 0 10px', fontWeight: 'bold', color: '#00b894'}}>What is your favorite color?</p>
                    <input 
                        type="text" required placeholder="e.g. Red" style={authStyles.input}
                        onChange={(e) => setData({...data, color: e.target.value})}
                    />
                </div>
                <button type="submit" style={authStyles.button}>Verify</button>
            </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
            <form onSubmit={handleResetSubmit} style={authStyles.form}>
                <div style={authStyles.inputGroup}>
                    <label style={authStyles.label}>New Password</label>
                    <input 
                        type="password" required placeholder="••••••••" style={authStyles.input}
                        onChange={(e) => setData({...data, newPassword: e.target.value})}
                    />
                </div>
                <button type="submit" style={authStyles.button}>Reset Password</button>
            </form>
        )}

        <button 
            onClick={() => navigate('/login')} 
            style={{marginTop: '20px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline', width: '100%'}}
        >
            Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;