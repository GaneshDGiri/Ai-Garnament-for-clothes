import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px', maxWidth: '600px', margin: 'auto' }}>
      <div style={{ fontSize: '80px', color: '#28a745', marginBottom: '20px' }}>
        ✓
      </div>
      <h1 style={{ color: '#333' }}>Order Placed Successfully!</h1>
      <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.6' }}>
        Thank you for shopping with us. Your order details have been saved to your dashboard.
        You will receive a confirmation message on your mobile number shortly.
      </p>

      <div style={{ marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={btnStyleSecondary}
        >
          View Dashboard
        </button>
        <button 
          onClick={() => navigate('/shop')}
          style={btnStylePrimary}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

// Styles
const btnStylePrimary = {
  padding: '15px 30px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
};

const btnStyleSecondary = {
  padding: '15px 30px', background: 'transparent', color: '#555', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'
};

export default OrderSuccess;