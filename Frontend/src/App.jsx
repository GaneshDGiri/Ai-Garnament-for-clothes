import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Component Imports
import Navbar from './components/Navbar';

// Page Imports
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import AiTryOn from './pages/AiTryOn';
import AiSuggester from './pages/AiSuggester';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import ChangePassword from './pages/ChangePassword'; // <--- Ensure this file exists
import ForgotPassword from './pages/ForgotPassword'; // <--- Ensure this file exists

function App() {
  // --- 1. Cart State ---
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // --- 2. Orders State ---
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to LocalStorage effects
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);

  // --- ACTIONS ---

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, amount) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item._id === productId) {
          const newQuantity = (item.quantity || 1) + amount;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item._id !== productId));
  };

  const handlePlaceOrder = (deliveryDetails, paymentMethod) => {
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: cart,
      totalAmount: cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0),
      details: deliveryDetails,
      paymentMethod: paymentMethod,
      status: 'Processing'
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

  const handleCancelOrder = (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (confirmCancel) {
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      ));
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar cartCount={cart.reduce((acc, item) => acc + (item.quantity || 1), 0)} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} />} />
          <Route path="/try-on" element={<AiTryOn />} />
          <Route path="/ai-stylist" element={<AiSuggester />} />
          
          <Route 
            path="/cart" 
            element={
              <Cart 
                cart={cart} 
                updateQuantity={updateQuantity} 
                removeFromCart={removeFromCart} 
              />
            } 
          />
          
          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* <--- THIS WAS MISSING */}
          
          {/* DASHBOARD ROUTES */}
          <Route 
            path="/dashboard" 
            element={<Dashboard orders={orders} cancelOrder={handleCancelOrder} />} 
          />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* CHECKOUT ROUTES */}
          <Route 
            path="/checkout" 
            element={<Checkout cart={cart} placeOrder={handlePlaceOrder} />} 
          />
          <Route path="/order-complete" element={<OrderSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;