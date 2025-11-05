import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import './Profile.css';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [stats, setStats] = useState({
    uploads: 0,
    purchases: 0,
    earnings: 0,
    sales: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchStats();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      setProfileData({
        name: res.data.name || '',
        email: res.data.email || '',
        bio: res.data.bio || '',
        location: res.data.location || '',
        website: res.data.website || '',
        phone: res.data.phone || ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/auth/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.put('/api/auth/profile', profileData);
      login(localStorage.getItem('token'), res.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>👤 My Profile</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-grid">
          {/* Left Column - Profile Info */}
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar-large">
                {getInitials(user?.name || 'U')}
              </div>
              <h2>{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-role">
                {user?.role === 'contributor' ? '🎨 Contributor' : '👤 User'}
              </div>
            </div>

            <div className="stats-card">
              <h3>📊 Your Stats</h3>
              <div className="stat-item">
                <span className="stat-icon">📸</span>
                <div>
                  <div className="stat-value">{stats.uploads}</div>
                  <div className="stat-label">Uploads</div>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🛍️</span>
                <div>
                  <div className="stat-value">{stats.purchases}</div>
                  <div className="stat-label">Purchases</div>
                </div>
              </div>
              {user?.role === 'contributor' && (
                <>
                  <div className="stat-item">
                    <span className="stat-icon">💰</span>
                    <div>
                      <div className="stat-value">₹{stats.earnings?.toFixed(2) || '0.00'}</div>
                      <div className="stat-label">Earnings</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📈</span>
                    <div>
                      <div className="stat-value">{stats.sales || 0}</div>
                      <div className="stat-label">Sales</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="quick-actions-card">
              <h3>⚡ Quick Actions</h3>
              <button onClick={() => navigate('/my-uploads')} className="action-btn">
                <span className="action-icon">📸</span>
                <div className="action-text">
                  <strong>My Uploads</strong>
                  <small>Manage your images</small>
                </div>
                <span className="action-arrow">→</span>
              </button>
              <button onClick={() => navigate('/my-purchases')} className="action-btn">
                <span className="action-icon">🛍️</span>
                <div className="action-text">
                  <strong>My Purchases</strong>
                  <small>View purchased images</small>
                </div>
                <span className="action-arrow">→</span>
              </button>
              <button onClick={() => navigate('/wishlist')} className="action-btn">
                <span className="action-icon">❤️</span>
                <div className="action-text">
                  <strong>Wishlist</strong>
                  <small>Saved favorites</small>
                </div>
                <span className="action-arrow">→</span>
              </button>
              {user?.role === 'contributor' && (
                <button onClick={() => navigate('/my-earnings')} className="action-btn">
                  <span className="action-icon">💰</span>
                  <div className="action-text">
                    <strong>Earnings</strong>
                    <small>Track your income</small>
                  </div>
                  <span className="action-arrow">→</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="profile-content">
            {/* Profile Information */}
            <div className="section-card">
              <div className="section-header">
                <h3>📝 Profile Information</h3>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="btn-edit">
                    ✏️ Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    disabled={!editing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={!editing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    disabled={!editing}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleProfileChange}
                      disabled={!editing}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!editing}
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={profileData.website}
                    onChange={handleProfileChange}
                    disabled={!editing}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {editing && (
                  <div className="form-actions">
                    <button type="button" onClick={() => setEditing(false)} className="btn btn-outline">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="btn btn-primary">
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password */}
            <div className="section-card">
              <div className="section-header">
                <h3>🔒 Change Password</h3>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label>Current Password *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    minLength="6"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    minLength="6"
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>

            {/* Account Actions */}
            <div className="section-card danger-zone">
              <div className="section-header">
                <h3>⚠️ Danger Zone</h3>
              </div>
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <button className="btn btn-danger" onClick={() => setModal({
                isOpen: true,
                title: 'Coming Soon',
                message: 'Account deletion feature will be available soon. Please contact support if you need immediate assistance.',
                type: 'info'
              })}>
                Delete Account
              </button>
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

export default Profile;
