import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import './ImageDetail.css';

const ImageDetail = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchImage();
    if (user) checkOwnership();
  }, [id, user]);

  const fetchImage = async () => {
    try {
      const res = await axios.get(`/api/images/${id}`);
      setImage(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const checkOwnership = async () => {
    try {
      const res = await axios.get(`/api/payments/check-ownership/${id}`);
      setOwned(res.data.owned);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      setModal({
        isOpen: true,
        title: 'Login Required',
        message: 'Please login to purchase this image.',
        type: 'warning'
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    navigate(`/checkout/${id}`);
  };

  const handleDownload = async () => {
    if (!user) {
      setModal({
        isOpen: true,
        title: 'Login Required',
        message: 'Please login to download this image.',
        type: 'warning'
      });
      return;
    }
    
    if (image.price > 0 && !owned) {
      setModal({
        isOpen: true,
        title: 'Purchase Required',
        message: 'Please purchase this image first to download it.',
        type: 'info'
      });
      return;
    }

    try {
      await axios.post(`/api/images/${id}/download`);
      window.open(`http://localhost:5000${image.imageUrl}`, '_blank');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!image) return <div className="container">Image not found</div>;

  return (
    <div className="image-detail">
      <div className="container">
        <div className="detail-grid">
          <div className="image-section">
            <img src={`http://localhost:5000${image.imageUrl}`} alt={image.title} />
          </div>
          <div className="info-section">
            <h1>{image.title}</h1>
            <p className="contributor">by {image.contributor?.name}</p>
            {image.description && <p className="description">{image.description}</p>}
            <div className="stats">
              <span>❤️ {image.likes || 0} likes</span>
              <span>⬇️ {image.downloads || 0} downloads</span>
            </div>
            {image.category && <div className="category">📁 {image.category.name}</div>}
            {image.tags && image.tags.length > 0 && (
              <div className="tags">
                {image.tags.map((tag, idx) => (
                  <span key={idx} className="tag">#{tag}</span>
                ))}
              </div>
            )}
            {image.price > 0 && <div className="price">₹{image.price}</div>}
            <div className="actions">
              {image.price > 0 ? (
                owned ? (
                  <button onClick={handleDownload} className="btn btn-success">
                    ✓ Download (Owned)
                  </button>
                ) : (
                  <button onClick={handlePurchase} className="btn btn-primary">
                    💳 Purchase - ₹{image.price}
                  </button>
                )
              ) : (
                <button onClick={handleDownload} className="btn btn-success">
                  ⬇️ Download Free
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default ImageDetail;
