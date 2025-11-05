import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './RequestPayout.css';

const RequestPayout = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount: '',
    method: 'bank',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBalance();
  }, [user]);

  const fetchBalance = async () => {
    try {
      const res = await axios.get('/api/payouts/balance');
      setBalance(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load balance');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payoutData = {
        amount: parseFloat(formData.amount),
        method: formData.method,
        bankDetails: formData.method === 'bank' ? {
          accountHolderName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName
        } : {
          upiId: formData.upiId
        }
      };

      await axios.post('/api/payouts/request', payoutData);
      setSuccess('Payout request submitted successfully!');
      setTimeout(() => {
        navigate('/my-earnings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit payout request');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="request-payout">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="request-payout">
      <div className="container">
        <div className="payout-header">
          <h1>💳 Request Payout</h1>
          <p>Withdraw your earnings to your bank account or UPI</p>
        </div>

        <div className="payout-content">
          <div className="balance-card">
            <h3>💰 Available Balance</h3>
            <div className="balance-amount">₹{balance.availableBalance.toFixed(2)}</div>
            <div className="balance-details">
              <div className="balance-item">
                <span>Total Earnings:</span>
                <strong>₹{balance.totalEarnings.toFixed(2)}</strong>
              </div>
              <div className="balance-item">
                <span>Already Withdrawn:</span>
                <strong>₹{balance.totalWithdrawn.toFixed(2)}</strong>
              </div>
              <div className="balance-item">
                <span>Pending Payouts:</span>
                <strong>₹{balance.pendingAmount.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="payout-form-card">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {balance.availableBalance < 500 ? (
              <div className="insufficient-balance">
                <div className="icon">⚠️</div>
                <h3>Insufficient Balance</h3>
                <p>Minimum payout amount is ₹500</p>
                <p>Your available balance: ₹{balance.availableBalance.toFixed(2)}</p>
                <button onClick={() => navigate('/my-earnings')} className="btn btn-primary">
                  View Earnings
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Payout Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount (min ₹500)"
                    min="500"
                    max={balance.availableBalance}
                    step="0.01"
                    required
                  />
                  <small>Maximum: ₹{balance.availableBalance.toFixed(2)}</small>
                </div>

                <div className="form-group">
                  <label>Payout Method *</label>
                  <div className="method-selector">
                    <label className={`method-option ${formData.method === 'bank' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="method"
                        value="bank"
                        checked={formData.method === 'bank'}
                        onChange={handleChange}
                      />
                      <div className="method-content">
                        <span className="method-icon">🏦</span>
                        <div>
                          <strong>Bank Transfer</strong>
                          <small>2-3 business days</small>
                        </div>
                      </div>
                    </label>

                    <label className={`method-option ${formData.method === 'upi' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="method"
                        value="upi"
                        checked={formData.method === 'upi'}
                        onChange={handleChange}
                      />
                      <div className="method-content">
                        <span className="method-icon">📱</span>
                        <div>
                          <strong>UPI Transfer</strong>
                          <small>Instant transfer</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.method === 'bank' ? (
                  <>
                    <div className="form-group">
                      <label>Account Holder Name *</label>
                      <input
                        type="text"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        placeholder="As per bank records"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Account Number *</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="Enter account number"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>IFSC Code *</label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        placeholder="e.g., SBIN0001234"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Bank Name *</label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="e.g., State Bank of India"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="form-group">
                    <label>UPI ID *</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="yourname@paytm"
                      required
                    />
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" onClick={() => navigate('/my-earnings')} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Submitting...' : `Request ₹${formData.amount || '0'} Payout`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPayout;
