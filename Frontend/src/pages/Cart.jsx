import React from 'react';
import { useNavigate } from 'react-router-dom';

// Receive updateQuantity and removeFromCart props
const Cart = ({ cart, updateQuantity, removeFromCart }) => {
  const navigate = useNavigate();

  // Calculate Total (Price * Quantity)
  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={{fontSize: '4rem', marginBottom: '20px'}}>🛍️</div>
        <h2 style={{color: '#2d3436'}}>Your Cart is Empty</h2>
        <button onClick={() => navigate('/shop')} style={styles.continueBtn}>Start Shopping</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Shopping Bag</h2>

      <div style={styles.layout}>
        {/* --- LEFT: ITEMS --- */}
        <div style={styles.itemsList}>
          {cart.map((item, index) => (
            <div key={index} style={styles.itemRow}>
              
              {/* Image */}
              <div style={styles.imageWrapper}>
                <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} style={styles.itemImage} />
              </div>
              
              {/* Details */}
              <div style={styles.itemDetails}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemMeta}>Price: ${item.price}</p>
                
                {/* QUANTITY CONTROLS */}
                <div style={styles.qtyContainer}>
                    <button onClick={() => updateQuantity(item._id, -1)} style={styles.qtyBtn}>-</button>
                    <span style={{fontWeight: 'bold'}}>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item._id, 1)} style={styles.qtyBtn}>+</button>
                </div>

                <button onClick={() => removeFromCart(item._id)} style={styles.removeBtn}>Remove</button>
              </div>

              {/* Item Subtotal (Price * Qty) */}
              <div style={styles.itemPrice}>
                ${(item.price * (item.quantity || 1)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* --- RIGHT: SUMMARY --- */}
        <div style={styles.summaryCard}>
          <h3>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={{...styles.summaryRow, fontWeight: 'bold', fontSize: '1.2rem', marginTop: '15px', borderTop: '2px solid #333', paddingTop: '15px'}}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button onClick={handleProceedToCheckout} style={styles.checkoutBtn}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1100px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' },
  heading: { fontSize: '2rem', marginBottom: '30px' },
  emptyContainer: { textAlign: 'center', padding: '100px 20px', background: '#f9f9f9', borderRadius: '15px' },
  continueBtn: { marginTop: '20px', padding: '12px 30px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' },
  layout: { display: 'flex', gap: '40px', flexWrap: 'wrap' },
  itemsList: { flex: 2, minWidth: '350px' },
  itemRow: { display: 'flex', gap: '20px', borderBottom: '1px solid #eee', padding: '20px 0' },
  imageWrapper: { width: '100px', height: '100px', background: '#f0f0f0', borderRadius: '8px' },
  itemImage: { width: '100%', height: '100%', objectFit: 'cover' },
  itemDetails: { flex: 1 },
  itemName: { margin: '0 0 5px 0', fontSize: '1.1rem' },
  itemMeta: { color: '#888', fontSize: '0.9rem', marginBottom: '10px' },
  qtyContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
  qtyBtn: { width: '30px', height: '30px', cursor: 'pointer', background: '#eee', border: 'none', borderRadius: '4px' },
  removeBtn: { background: 'none', border: 'none', color: '#ff7675', cursor: 'pointer', textDecoration: 'underline' },
  itemPrice: { fontWeight: 'bold', fontSize: '1.2rem' },
  summaryCard: { flex: 1, minWidth: '300px', background: '#f9f9f9', padding: '30px', borderRadius: '10px', height: 'fit-content' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' },
  checkoutBtn: { width: '100%', padding: '15px', background: 'black', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold' }
};

export default Cart;