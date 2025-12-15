import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount }) => {
  const navigate = useNavigate();
  
  // Check if user is logged in (Simple Token Check)
  // Note: In a larger app, you would use React Context for this.
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert("Logged out successfully");
    navigate('/login');
    window.location.reload(); // Refresh to update UI
  };

  return (
    <nav style={styles.nav}>
      {/* LOGO SECTION */}
      <div style={styles.logoContainer}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1 style={styles.logoText}>Gani Garment</h1>
        </Link>
      </div>

      {/* LINKS SECTION */}
      <div style={styles.linksContainer}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/shop" style={styles.link}>Shop</Link>
        
        {/* Dropdown-ish look for AI Tools */}
        <span style={styles.aiGroup}>
           <Link to="/ai-stylist" style={{...styles.link, color: '#00d2d3'}}>AI Stylist</Link>
           <Link to="/try-on" style={{...styles.link, color: '#00d2d3'}}>Try-On</Link>
        </span>

        <Link to="/cart" style={styles.link}>
          Cart <span style={styles.badge}>{cartCount}</span>
        </Link>

        {/* DYNAMIC AUTH LINKS */}
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.loginBtn}>Login</Link>
        )}
      </div>
    </nav>
  );
};

// --- STYLES (Internal CSS for simplicity) ---
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#2d3436',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  logoText: {
    margin: 0,
    fontSize: '1.5rem',
    fontFamily: "'Courier New', Courier, monospace", // Styled font for "Gani Garment"
    border: '2px solid white',
    padding: '5px 10px'
  },
  linksContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s'
  },
  aiGroup: {
    borderLeft: '1px solid #555',
    borderRight: '1px solid #555',
    padding: '0 15px',
    display: 'flex',
    gap: '15px'
  },
  badge: {
    backgroundColor: '#e17055',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 8px',
    fontSize: '0.8rem',
    marginLeft: '5px'
  },
  loginBtn: {
    backgroundColor: '#00b894',
    padding: '8px 20px',
    borderRadius: '5px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  logoutBtn: {
    backgroundColor: '#d63031',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem'
  }
};

export default Navbar;