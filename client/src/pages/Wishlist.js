import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ImageCard from '../components/ImageCard';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('/api/wishlist');
      setWishlist(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleWishlistChange = (imageId) => {
    setWishlist(wishlist.filter(item => item.image._id !== imageId));
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="page-header">
          <h1>❤️ My Wishlist</h1>
          <p>Your favorite images saved for later</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💔</div>
            <h3>Your wishlist is empty</h3>
            <p>Start adding images you love to your wishlist</p>
            <button onClick={() => navigate('/')} className="btn btn-primary btn-lg">
              Browse Images
            </button>
          </div>
        ) : (
          <>
            <div className="wishlist-stats">
              <div className="stat">
                <span className="stat-icon">❤️</span>
                <div>
                  <div className="stat-value">{wishlist.length}</div>
                  <div className="stat-label">Saved Images</div>
                </div>
              </div>
            </div>

            <div className="images-grid">
              {wishlist.map(item => (
                <ImageCard 
                  key={item._id} 
                  image={item.image} 
                  onWishlistChange={handleWishlistChange}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
