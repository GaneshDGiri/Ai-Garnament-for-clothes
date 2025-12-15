import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const AiSuggester = () => {
  const navigate = useNavigate(); // 2. Initialize hook
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  // --- MOCK DATABASE ---
  const STYLE_DATABASE = {
    casual: {
      vibe: "Relaxed & Comfortable",
      items: [
        { name: "Vintage Denim Jacket", type: "Jacket", price: "$85", img: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=300" },
        { name: "White Cotton Tee", type: "Shirt", price: "$25", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300" },
        { name: "Beige Chinos", type: "Pant", price: "$45", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300" }
      ]
    },
    formal: {
      vibe: "Sharp & Professional",
      items: [
        { name: "Navy Blue Suit", type: "Jacket", price: "$250", img: "https://images.unsplash.com/photo-1594938298603-c8148c472f81?w=300" },
        { name: "Oxford Button Down", type: "Shirt", price: "$55", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300" },
        { name: "Leather Loafers", type: "Shoes", price: "$120", img: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=300" }
      ]
    },
    winter: {
      vibe: "Cozy & Warm",
      items: [
        { name: "Wool Overcoat", type: "Jacket", price: "$180", img: "https://images.unsplash.com/photo-1551028919-ac7675714de8?w=300" },
        { name: "Knitted Turtle Neck", type: "Shirt", price: "$60", img: "https://images.unsplash.com/photo-1624456729579-245f7887e5b2?w=300" },
        { name: "Dark Jeans", type: "Pant", price: "$70", img: "https://images.unsplash.com/photo-1542272617-08f086320497?w=300" }
      ]
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setResults(null); 
    }
  };

  const handleAnalyze = () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      const styles = ['casual', 'formal', 'winter'];
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      
      setResults({
        bodyShape: "Rectangular / Athletic",
        season: randomStyle === 'winter' ? 'Winter' : 'Spring/Summer',
        recommendation: STYLE_DATABASE[randomStyle]
      });
      setAnalyzing(false);
    }, 2500);
  };

  // --- 3. HANDLE VIEW IN SHOP ---
  const handleViewInShop = (item) => {
    // Navigate to Shop and pass the item data
    navigate('/shop', { 
        state: { 
            aiSearch: item.name, // To filter the shop
            aiProduct: item      // To add it if missing
        } 
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI Personal Stylist</h1>
        <p style={{color: '#666'}}>Upload a photo. Let our AI curate your perfect look.</p>
      </div>

      <div style={styles.content}>
        <div style={styles.uploadCard}>
          <div style={styles.imagePreviewArea}>
             {analyzing && <div style={styles.scanLine}></div>}
             {image ? <img src={image} alt="User" style={styles.previewImage} /> : <div style={styles.placeholder}><span style={{fontSize: '3rem'}}>📁</span><p>Click below to upload</p></div>}
          </div>
          <div style={styles.controls}>
             <input type="file" accept="image/*" onChange={handleImageChange} id="fileInput" style={{display: 'none'}} />
             <label htmlFor="fileInput" style={styles.uploadBtn}>Choose Photo</label>
             <button onClick={handleAnalyze} disabled={analyzing || !image} style={analyzing ? styles.analyzeBtnDisabled : styles.analyzeBtn}>{analyzing ? "AI is Thinking..." : "Analyze Outfit"}</button>
          </div>
        </div>

        <div style={styles.resultsCard}>
          {!results && !analyzing && <div style={styles.emptyState}><h3>Waiting for Image...</h3><p>Upload a full-body photo for best results.</p></div>}
          {analyzing && <div style={styles.emptyState}><div style={styles.spinner}></div><h3>Analyzing Fabrics & Colors...</h3></div>}

          {results && !analyzing && (
            <div style={styles.resultContent}>
              <div style={styles.badgeContainer}>
                <span style={styles.badge}>Build: {results.bodyShape}</span>
                <span style={styles.badge}>Season: {results.season}</span>
              </div>
              <h2 style={{color: '#333'}}>Vibe: {results.recommendation.vibe}</h2>
              <p style={{color: '#666', marginBottom: '20px'}}>Based on your analysis, we recommend this complete look:</p>

              <div style={styles.grid}>
                {results.recommendation.items.map((item, index) => (
                  <div key={index} style={styles.itemCard}>
                    <img src={item.img} alt={item.name} style={styles.itemImg} />
                    <div style={{padding: '10px'}}>
                      <h4 style={{margin: '0 0 5px 0'}}>{item.name}</h4>
                      <p style={{margin: 0, color: '#00b894', fontWeight: 'bold'}}>{item.price}</p>
                      
                      {/* 4. CONNECTED BUTTON */}
                      <button 
                        style={styles.buyBtn}
                        onClick={() => handleViewInShop(item)}
                      >
                        View in Shop →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', background: '#f5f6fa', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px' },
  title: { fontSize: '2.5rem', color: '#2d3436', margin: '0 0 10px 0' },
  content: { display: 'flex', gap: '30px', maxWidth: '1200px', margin: 'auto', flexWrap: 'wrap' },
  uploadCard: { flex: 1, minWidth: '320px', background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' },
  imagePreviewArea: { position: 'relative', height: '400px', background: '#eee', borderRadius: '15px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  previewImage: { width: '100%', height: '100%', objectFit: 'contain' },
  placeholder: { textAlign: 'center', color: '#aaa' },
  scanLine: { position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: '#00b894', boxShadow: '0 0 10px #00b894', animation: 'scan 2s infinite linear' },
  controls: { marginTop: '20px', display: 'flex', gap: '10px', flexDirection: 'column' },
  uploadBtn: { display: 'block', textAlign: 'center', padding: '15px', border: '2px dashed #ccc', borderRadius: '10px', cursor: 'pointer', color: '#666', fontWeight: 'bold' },
  analyzeBtn: { padding: '15px', background: '#2d3436', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' },
  analyzeBtnDisabled: { padding: '15px', background: '#b2bec3', color: 'white', border: 'none', borderRadius: '10px', cursor: 'not-allowed' },
  resultsCard: { flex: 2, minWidth: '320px', background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' },
  emptyState: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#b2bec3', minHeight: '300px' },
  resultContent: { animation: 'fadeIn 0.5s ease-in' },
  badgeContainer: { display: 'flex', gap: '10px', marginBottom: '15px' },
  badge: { background: '#dfe6e9', color: '#2d3436', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  itemCard: { border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' },
  itemImg: { width: '100%', height: '200px', objectFit: 'cover' },
  buyBtn: { marginTop: '10px', width: '100%', padding: '8px', background: 'transparent', border: '1px solid #00b894', color: '#00b894', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' },
  spinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #00b894', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes scan { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(styleSheet);

export default AiSuggester;