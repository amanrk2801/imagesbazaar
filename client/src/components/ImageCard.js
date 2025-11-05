import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './ImageCard.css';

const ImageCard = ({ image, onWishlistChange }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(image.likes || 0);
  const [inWishlist, setInWishlist] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkLiked();
      checkWishlist();
    }
  }, [user, image._id]);

  const checkLiked = async () => {
    try {
      const res = await axios.get(`/api/images/${image._id}/liked`);
      setLiked(res.data.liked);
    } catch (err) {
      console.error(err);
    }
  };

  const checkWishlist = async () => {
    try {
      const res = await axios.get(`/api/wishlist/check/${image._id}`);
      setInWishlist(res.data.inWishlist);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(`/api/images/${image._id}/like`);
      setLiked(res.data.liked);
      setLikes(res.data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (inWishlist) {
        await axios.delete(`/api/wishlist/remove/${image._id}`);
        setInWishlist(false);
        if (onWishlistChange) onWishlistChange(image._id);
      } else {
        await axios.post(`/api/wishlist/add/${image._id}`);
        setInWishlist(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link to={`/image/${image._id}`} className="image-card">
      <div className="image-wrapper">
        <img src={`http://localhost:5000${image.imageUrl}`} alt={image.title} />
        {image.price > 0 ? (
          <div className="image-price">₹{image.price}</div>
        ) : (
          <div className="image-price image-free">FREE</div>
        )}
        <button 
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlist}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="image-info">
        <h3>{image.title}</h3>
        <p className="contributor">by {image.contributor?.name}</p>
        <div className="image-stats">
          <button 
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            {liked ? '❤️' : '🤍'} {likes}
          </button>
          <span>⬇️ {image.downloads || 0}</span>
        </div>
      </div>
    </Link>
  );
};

export default ImageCard;
