import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* HERO SECTION */}
      <section style={heroStyle}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>Gani Garment</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Smart Fashion. Intelligent Choices. Powered by AI.</p>
          <div>
            <Link to="/shop"><button style={primaryBtn}>Shop Collection</button></Link>
            <Link to="/try-on"><button style={secondaryBtn}>AI Virtual Try-On</button></Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Why Choose Us?</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginTop: '30px' }}>
          <div style={featureBox}>
            <h3>🤖 AI Stylist</h3>
            <p>Upload your photo and let our AI suggest the perfect outfit for you.</p>
          </div>
          <div style={featureBox}>
            <h3>⚡ Fast Delivery</h3>
            <p>Order today and get email updates instantly via our smart system.</p>
          </div>
          <div style={featureBox}>
            <h3>🔍 Smart Search</h3>
            <p>Find exactly what you need with our categorized visual search.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const heroStyle = {
  height: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
  backgroundSize: 'cover',
  color: 'white'
};

const primaryBtn = { padding: '15px 30px', fontSize: '18px', background: '#00b894', color: 'white', border: 'none', cursor: 'pointer', marginRight: '15px' };
const secondaryBtn = { padding: '15px 30px', fontSize: '18px', background: 'transparent', border: '2px solid white', color: 'white', cursor: 'pointer' };
const featureBox = { width: '300px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '8px' };

export default Home;