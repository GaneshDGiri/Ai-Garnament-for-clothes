/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ orders, cancelOrder }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (savedUser && savedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.clear();
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!user) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Profile...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: 'auto' }}>
      
      {/* --- PROFILE HEADER --- */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <img 
            src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
            alt="Profile" 
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }}
        />
        <div style={{flex: 1}}>
            <h1 style={{margin: '0 0 5px 0', fontSize: '1.8rem'}}>Hello, {user.name || "User"}!</h1> 
            <p style={{margin: 0, color: '#666'}}>{user.email}</p>
        </div>
        <button onClick={handleLogout} style={{padding: '10px 20px', background: '#ffeaa7', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#d63031'}}>Logout</button>
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
        <button onClick={() => navigate('/edit-profile')} style={actionBtn}>✏️ Edit Profile</button>
        
        {/* NEW BUTTON: Change Password */}
        <button onClick={() => navigate('/change-password')} style={actionBtn}>🔒 Change Password</button>

        <button onClick={() => navigate('/shop')} style={actionBtn}>🛍️ Go Shopping</button>
        <button onClick={() => navigate('/try-on')} style={actionBtn}>👔 Try On</button>
        <button onClick={() => navigate('/ai-stylist')} style={actionBtn}>✨ AI Stylist</button>
      </div>

      {/* --- ORDER HISTORY SECTION --- */}
      <div style={{ marginTop: '50px' }}>
        <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>Order History</h2>

        {(!orders || orders.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '10px', color: '#888' }}>
            <p>No orders yet. Go buy something!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => (
              <div key={order.id} style={orderCardStyle}>
                
                <div style={orderHeaderStyle}>
                    <div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Order #{order.id}</span>
                        <br />
                        <span style={{ fontSize: '0.85rem', color: '#666' }}>{order.date}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                            padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                            background: order.status === 'Cancelled' ? '#ffebee' : '#e8f5e9',
                            color: order.status === 'Cancelled' ? '#c62828' : '#2e7d32'
                        }}>
                            {order.status}
                        </span>
                        <div style={{ marginTop: '5px', fontWeight: 'bold' }}>${order.totalAmount.toFixed(2)}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                    {order.items.map((item, idx) => (
                        <div key={idx} style={{ minWidth: '60px', textAlign: 'center' }}>
                            <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '5px', overflow: 'hidden', marginBottom: '5px' }}>
                                <img src={item.image || "https://via.placeholder.com/60"} alt="item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#555', display: 'block' }}>x{item.quantity || 1}</span>
                        </div>
                    ))}
                </div>

                <div style={{ paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#555' }}>Payment: {order.paymentMethod.toUpperCase()}</span>
                    {order.status === 'Processing' && (
                        <button onClick={() => cancelOrder(order.id)} style={cancelBtnStyle}>Cancel Order</button>
                    )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

const actionBtn = { padding: '15px', background: 'white', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', transition: '0.2s' };
const orderCardStyle = { background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' };
const orderHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px' };
const cancelBtnStyle = { padding: '8px 16px', background: 'white', border: '1px solid #ff7675', color: '#ff7675', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' };

export default Dashboard;