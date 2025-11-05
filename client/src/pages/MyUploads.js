import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import './MyUploads.css';

const MyUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, imageId: null, imageTitle: '' });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUploads();
  }, [user]);

  const fetchUploads = async () => {
    try {
      const res = await axios.get('/api/images/my/uploads');
      setUploads(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDeleteClick = (imageId, imageTitle) => {
    setDeleteModal({ isOpen: true, imageId, imageTitle });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/images/${deleteModal.imageId}`);
      setDeleteModal({ isOpen: false, imageId: null, imageTitle: '' });
      setModal({
        isOpen: true,
        title: 'Image Deleted',
        message: 'Your image has been successfully deleted.',
        type: 'success'
      });
      fetchUploads(); // Refresh the list
    } catch (err) {
      setDeleteModal({ isOpen: false, imageId: null, imageTitle: '' });
      setModal({
        isOpen: true,
        title: 'Cannot Delete',
        message: err.response?.data?.message || 'Failed to delete image. It may have been purchased.',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="my-uploads">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your uploads...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-uploads">
      <div className="container">
        <div className="page-header">
          <h1>📸 My Uploads</h1>
          <p>Manage your uploaded images</p>
        </div>

        {uploads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🖼️</div>
            <h3>No uploads yet</h3>
            <p>Start sharing your amazing images with the world</p>
            <button onClick={() => navigate('/upload')} className="btn btn-primary btn-lg">
              Upload Image
            </button>
          </div>
        ) : (
          <>
            <div className="uploads-stats">
              <div className="stat-box">
                <span className="stat-icon">📊</span>
                <div>
                  <div className="stat-number">{uploads.length}</div>
                  <div className="stat-label">Total Uploads</div>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">❤️</span>
                <div>
                  <div className="stat-number">{uploads.reduce((sum, img) => sum + (img.likes || 0), 0)}</div>
                  <div className="stat-label">Total Likes</div>
                </div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">⬇️</span>
                <div>
                  <div className="stat-number">{uploads.reduce((sum, img) => sum + (img.downloads || 0), 0)}</div>
                  <div className="stat-label">Total Downloads</div>
                </div>
              </div>
            </div>

            <div className="uploads-grid">
              {uploads.map(image => (
                <div key={image._id} className="upload-card">
                  <div className="upload-image">
                    <img src={`http://localhost:5000${image.imageUrl}`} alt={image.title} />
                    {image.price > 0 ? (
                      <div className="image-price">₹{image.price}</div>
                    ) : (
                      <div className="image-price image-free">FREE</div>
                    )}
                  </div>
                  <div className="upload-info">
                    <h3>{image.title}</h3>
                    {image.description && <p className="description">{image.description}</p>}
                    
                    <div className="upload-stats">
                      <span>❤️ {image.likes || 0}</span>
                      <span>⬇️ {image.downloads || 0}</span>
                    </div>

                    <div className="upload-actions">
                      <Link to={`/image/${image._id}`} className="btn-view">
                        👁️ View
                      </Link>
                      <button 
                        onClick={() => handleDeleteClick(image._id, image.title)} 
                        className="btn-delete"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" onClick={() => setDeleteModal({ isOpen: false, imageId: null, imageTitle: '' })}>
          <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header modal-warning">
              <span className="modal-icon">⚠️</span>
              <h3>Delete Image?</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>"{deleteModal.imageTitle}"</strong>?</p>
              <p className="warning-text">This action cannot be undone. Images that have been purchased cannot be deleted.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline" 
                onClick={() => setDeleteModal({ isOpen: false, imageId: null, imageTitle: '' })}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
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

export default MyUploads;
