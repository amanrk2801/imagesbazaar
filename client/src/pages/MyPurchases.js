import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './MyPurchases.css';

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPurchases();
  }, [user]);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('/api/payments/my-purchases');
      setPurchases(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl) => {
    window.open(`http://localhost:5000${imageUrl}`, '_blank');
  };

  if (loading) {
    return (
      <div className="my-purchases">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your purchases...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalImages = purchases.length;

  return (
    <div className="my-purchases">
      <div className="container">
        <div className="page-header">
          <h1>🛍️ My Purchases</h1>
          <p>Your collection of purchased images</p>
        </div>

        {purchases.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🖼️</div>
            <h3>No purchases yet</h3>
            <p>Start building your collection by purchasing amazing images</p>
            <button onClick={() => navigate('/')} className="btn btn-primary btn-lg">
              Browse Images
            </button>
          </div>
        ) : (
          <>
            <div className="stats-summary">
              <div className="stat-item">
                <div className="stat-icon">📊</div>
                <div className="stat-value">{totalImages}</div>
                <div className="stat-label">Total Purchases</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">💰</div>
                <div className="stat-value">₹{totalSpent.toFixed(2)}</div>
                <div className="stat-label">Total Spent</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⬇️</div>
                <div className="stat-value">Unlimited</div>
                <div className="stat-label">Downloads</div>
              </div>
            </div>

            <div className="purchases-grid">
              {purchases.map(purchase => (
                <div key={purchase._id} className="purchase-card">
                  <div className="purchase-image">
                    <img src={`http://localhost:5000${purchase.image.imageUrl}`} alt={purchase.image.title} />
                    <div className="owned-badge">
                      <span>✓</span> Owned
                    </div>
                  </div>
                  <div className="purchase-info">
                    <h3>{purchase.image.title}</h3>
                    <p className="contributor">by {purchase.contributor.name}</p>
                    
                    <div className="purchase-details">
                      <div className="detail-row">
                        <span className="detail-label">Purchase Price:</span>
                        <span className="detail-value amount">₹{purchase.amount.toFixed(2)}</span>
                      </div>
                    </div>

                    <p className="date">{new Date(purchase.purchasedAt).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>

                    <div className="actions">
                      <button onClick={() => handleDownload(purchase.image.imageUrl)} className="btn-download">
                        ⬇️ Download
                      </button>
                      <Link to={`/image/${purchase.image._id}`} className="btn-view">
                        👁️ View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPurchases;
