import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Checkout = ({ cart, placeOrder }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Redirect to Shop if Cart is Empty
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/shop');
    }
  }, [cart, navigate]);

  // 2. Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '', 
    mobile: '',
    address: '',
    city: '',
    zip: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '', expiry: '', cvc: '', upiId: ''
  });

  // 3. Handle Text Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Calculate Total
  const totalAmount = cart 
    ? cart.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0) 
    : 0;

  // 5. Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // A. Validation
    if (!formData.email) {
      alert("Please enter a valid email address.");
      return;
    }
    if (paymentMethod === 'upi' && !paymentDetails.upiId) {
        alert("Please enter UPI ID"); return;
    }
    if (paymentMethod === 'card' && !paymentDetails.cardNumber) {
        alert("Please enter Card Details"); return;
    }

    setIsProcessing(true);

    // B. EmailJS Configuration
    const SERVICE_ID = "service_tlb3374";
    const TEMPLATE_ID = "template_04g8xdh";
    const PUBLIC_KEY = "PdefnyXgNvy50dffB";

    // C. Prepare Data
    // We send the email under multiple keys to ensure it catches whatever variable you used in the dashboard
    const templateParams = {
      to_name: formData.fullName,
      to_email: formData.email,      // Standard variable
      user_email: formData.email,    // Backup variable
      reply_to: formData.email,      // Backup variable
      message: cart.map(item => `${item.name} (x${item.quantity || 1})`).join(', '),
      total_price: totalAmount.toFixed(2),
      address: `${formData.address}, ${formData.city} - ${formData.zip}`,
    };

    console.log("Attempting to send email with data:", templateParams);

    // D. Send Email
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        console.log('EMAIL SUCCESS!', response.status, response.text);
        placeOrder(formData, paymentMethod);
        navigate('/order-complete');
      })
      .catch((err) => {
        console.error('EMAIL FAILED...', err);
        
        // Specific Error Handling for "Recipient Empty"
        if (err.text && err.text.includes("recipients address is empty")) {
            alert(
                "Order Successful! \n\n" +
                "Note: The confirmation email failed because the 'To Email' field in your EmailJS Dashboard is blank. \n" +
                "Fix: Go to EmailJS -> Email Templates -> Edit -> Set 'To Email' to {{to_email}}"
            );
        } else {
            alert(`Order Placed, but Email Failed: ${err.text}`);
        }
        
        // Still complete the order logic so the user isn't stuck
        placeOrder(formData, paymentMethod);
        navigate('/order-complete');
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      
      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center' }}>
        <h3 style={{ margin: 0, color: '#333' }}>Total To Pay: ${totalAmount.toFixed(2)}</h3>
      </div>

      <form onSubmit={handleSubmit}>
        
        <h4 style={sectionHeaderStyle}>Contact & Shipping</h4>
        
        <input 
            type="text" name="fullName" placeholder="Full Name" required 
            style={inputStyle} onChange={handleInputChange} 
        />
        
        {/* EMAIL INPUT - This is the Critical Field */}
        <input 
            type="email" 
            name="email" 
            placeholder="Email Address (Required)" 
            required 
            style={inputStyle} 
            onChange={handleInputChange} 
        />
        
        <input 
            type="tel" name="mobile" placeholder="Mobile Number" required 
            style={inputStyle} onChange={handleInputChange} 
        />
        <textarea 
            name="address" placeholder="Shipping Address" required 
            style={{...inputStyle, height: '70px', resize: 'none'}} onChange={handleInputChange} 
        />
        <div style={{display:'flex', gap:'10px'}}>
            <input type="text" name="city" placeholder="City" required style={inputStyle} onChange={handleInputChange} />
            <input type="text" name="zip" placeholder="Zip Code" required style={inputStyle} onChange={handleInputChange} />
        </div>

        <h4 style={{ ...sectionHeaderStyle, marginTop: '20px' }}>Payment Method</h4>
        <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={inputStyle}
        >
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
            <option value="card">Credit / Debit Card</option>
            <option value="emi">EMI</option>
        </select>

        <div style={{ background: '#f1f3f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            {paymentMethod === 'cod' && (
                <p style={{ margin: 0, color: 'green', fontSize: '0.9rem' }}>✓ Pay securely when your order arrives.</p>
            )}
            {paymentMethod === 'upi' && (
                <input type="text" name="upiId" placeholder="Enter UPI ID (e.g. name@oksbi)" style={{...inputStyle, marginBottom: 0}} onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})} />
            )}
            {paymentMethod === 'card' && (
                <div>
                    <input type="text" placeholder="Card Number" style={inputStyle} onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})} />
                    <div style={{display:'flex', gap:'10px'}}>
                        <input type="text" placeholder="MM/YY" style={{...inputStyle, marginBottom: 0}} />
                        <input type="text" placeholder="CVC" style={{...inputStyle, marginBottom: 0}} />
                    </div>
                </div>
            )}
             {paymentMethod === 'emi' && (
                <select style={{...inputStyle, marginBottom: 0}}>
                    <option>3 Months - 12% p.a</option>
                    <option>6 Months - 14% p.a</option>
                    <option>12 Months - 15% p.a</option>
                </select>
            )}
        </div>

        <button 
            type="submit" 
            disabled={isProcessing}
            style={isProcessing ? disabledBtnStyle : submitBtnStyle}
        >
          {isProcessing ? "Processing Order..." : `Confirm & Pay $${totalAmount.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' };
const sectionHeaderStyle = { marginBottom: '10px', color: '#444', borderBottom: '2px solid #eee', paddingBottom: '5px' };
const submitBtnStyle = { width: '100%', padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const disabledBtnStyle = { width: '100%', padding: '15px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'not-allowed', marginTop: '10px' };

export default Checkout;