import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './MyEarnings.css';

const MyEarnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchEarnings();
  }, [user]);

  const fetchEarnings = async () => {
    try {
      const res = await axios.get('/api/payments/my-earnings');
      setEarnings(res.data.earnings);
      setTotalEarnings(res.data.totalEarnings);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  const totalSales = earnings.length;
  const platformFee = totalEarnings / 0.8 * 0.2; // Calculate platform fee
  const totalRevenue = totalEarnings / 0.8; // Total revenue before split

  return (
    <div className="my-earnings">
      <div className="container">
        <div className="page-header">
          <h1>💰 My Earnings</h1>
          <p>Track your sales and income from sold images</p>
        </div>

        <div className="earnings-summary">
          <div className="stat-card">
            <div className="stat-card-icon">💵</div>
            <h3>Total Earnings</h3>
            <div className="stat-card-value">₹{totalEarnings.toFixed(2)}</div>
            <div className="stat-card-label">Your 80% share</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon">📊</div>
            <h3>Total Sales</h3>
            <div className="stat-card-value">{totalSales}</div>
            <div className="stat-card-label">Images sold</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon">💳</div>
            <h3>Total Revenue</h3>
            <div className="stat-card-value">₹{totalRevenue.toFixed(2)}</div>
            <div className="stat-card-label">Before platform fee</div>
          </div>
        </div>

        <div className="payout-info">
          <h3>💡 How You Get Paid</h3>
          <div className="payout-info-grid">
            <div className="payout-info-item">
              <span>🎯</span>
              <div className="payout-info-text">
                <strong>Revenue Split</strong>
                <small>You get 80% of each sale</small>
              </div>
            </div>
            <div className="payout-info-item">
              <span>🏦</span>
              <div className="payout-info-text">
                <strong>Payout Method</strong>
                <small>Bank transfer or UPI</small>
              </div>
            </div>
            <div className="payout-info-item">
              <span>⏱️</span>
              <div className="payout-info-text">
                <strong>Processing Time</strong>
                <small>2-3 business days</small>
              </div>
            </div>
            <div className="payout-info-item">
              <span>💰</span>
              <div className="payout-info-text">
                <strong>Minimum Payout</strong>
                <small>₹500 for withdrawal</small>
              </div>
            </div>
          </div>
        </div>

        {totalEarnings >= 100 && (
          <div className="payout-cta">
            <div className="payout-cta-content">
              <div className="payout-cta-icon">💰</div>
              <div className="payout-cta-text">
                <h3>Ready to withdraw your earnings?</h3>
                <p>
                  {totalEarnings >= 500 
                    ? `You have ₹${totalEarnings.toFixed(2)} available for withdrawal`
                    : `You need ₹${(500 - totalEarnings).toFixed(2)} more to reach minimum payout of ₹500`
                  }
                </p>
              </div>
              <button 
                className="btn-request-payout-large" 
                onClick={() => navigate('/request-payout')}
                disabled={totalEarnings < 500}
              >
                {totalEarnings >= 500 ? '💳 Request Payout' : '🔒 Minimum ₹500 Required'}
              </button>
            </div>
          </div>
        )}

        <div className="section-header">
          <h2>📈 Sales History</h2>
        </div>

        {earnings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📸</div>
            <h3>No sales yet</h3>
            <p>Keep uploading great images and they'll start selling!</p>
          </div>
        ) : (
          <div className="earnings-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Buyer</th>
                  <th>Sale Price</th>
                  <th>Platform Fee (20%)</th>
                  <th>Your Earning (80%)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map(earning => (
                  <tr key={earning._id}>
                    <td><strong>{earning.image.title}</strong></td>
                    <td>{earning.buyer.name}</td>
                    <td className="sale-price">₹{earning.amount.toFixed(2)}</td>
                    <td>₹{earning.commission.toFixed(2)}</td>
                    <td className="earning-amount">₹{earning.contributorEarning.toFixed(2)}</td>
                    <td>{new Date(earning.purchasedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEarnings;
