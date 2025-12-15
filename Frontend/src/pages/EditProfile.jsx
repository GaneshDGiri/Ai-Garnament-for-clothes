import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Read-only usually
  const [imagePreview, setImagePreview] = useState(null);

  // Load current user data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setName(user.name || '');
      setEmail(user.email || '');
      setImagePreview(user.profileImage || null);
    } else {
      // If no user found, kick them out
      navigate('/login');
    }
  }, [navigate]);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Create a fake URL for immediate preview
      // setImagePreview(URL.createObjectURL(file));

      // 2. Convert to Base64 so we can save it to LocalStorage (Simulating a server)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // This result is the base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Get existing user data
    const savedUser = JSON.parse(localStorage.getItem('user'));

    // 2. Create updated object
    const updatedUser = {
      ...savedUser,
      name: name,
      profileImage: imagePreview // Save the new image data
    };

    // 3. Save back to LocalStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // 4. Feedback and Redirect
    alert("Profile Updated Successfully!");
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
      <h2>Edit Profile</h2>
      
      <form onSubmit={handleSubmit}>
        
        {/* IMAGE UPLOAD SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '100px', height: '100px', margin: '0 auto 10px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #ccc', background: '#f0f0f0' }}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ lineHeight: '100px', color: '#888' }}>No Img</span>
            )}
          </div>
          
          <label 
            htmlFor="fileInput" 
            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', fontSize: '14px' }}
          >
            Change Profile Photo
          </label>
          <input 
            id="fileInput"
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
          />
        </div>

        {/* INPUT FIELDS */}
        <div style={{ marginBottom: '15px' }}>
          <label>Full Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Email (Cannot change)</label>
          <input 
            type="email" 
            value={email} 
            disabled 
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #eee', background: '#f9f9f9', color: '#777' }}
          />
        </div>

        {/* BUTTONS */}
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
          Save Changes
        </button>
        
        <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            style={{ width: '100%', padding: '10px', marginTop: '10px', background: 'transparent', color: '#555', border: 'none', cursor: 'pointer' }}
        >
          Cancel
        </button>

      </form>
    </div>
  );
};

export default EditProfile;