import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import './Checkout.css';

const Checkout = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchImage();
  }, [id, user]);

  const fetchImage = async () => {
    try {
      const res = await axios.get(`/api/images/${id}`);
      setImage(res.data);

      if (res.data.price === 0) {
        navigate(`/image/${id}`);
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error('Fetch image error:', err);
      setError('Failed to load image details');
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay SDK loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay SDK');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    console.log('Starting payment process...');
    console.log('Razorpay Key ID:', process.env.REACT_APP_RAZORPAY_KEY_ID);

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Failed to load payment gateway. Please check your internet connection and try again.');
      setProcessing(false);
      return;
    }

    try {
      console.log('Creating order for image:', id);
      
      // Create order
      const orderRes = await axios.post('/api/payments/create-order', { imageId: id });
      console.log('Order created:', orderRes.data);
      
      const { orderId, amount, currency } = orderRes.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'ImagesBazaar',
        description: `Purchase: ${image.title}`,
        image: 'http://localhost:5000' + image.imageUrl,
        order_id: orderId,
        handler: async (response) => {
          console.log('Payment successful:', response);
          setProcessing(true);
          
          try {
            console.log('Verifying payment...');
            const verifyRes = await axios.post('/api/payments/verify-payment', {
              imageId: id,
              orderId: orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });
            
            console.log('Payment verified:', verifyRes.data);
            
            // Show success message and redirect
            setModal({
              isOpen: true,
              title: 'Payment Successful!',
              message: 'Your image has been purchased and is now available in "My Purchases".',
              type: 'success'
            });
            
            // Redirect after modal closes
            setTimeout(() => {
              navigate('/my-purchases');
            }, 2000);
          } catch (err) {
            console.error('Verification error:', err);
            setError('Payment verification failed. Please contact support with payment ID: ' + response.razorpay_payment_id);
            setProcessing(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        notes: {
          imageId: id,
          userId: user.id
        },
        theme: {
          color: '#007bff'
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            setProcessing(false);
            setError('Payment cancelled. You can try again when ready.');
          },
          escape: true,
          backdropclose: false
        }
      };

      console.log('Opening Razorpay modal...');
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });

      razorpay.open();
      
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed';
      setError(errorMessage);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-box">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="checkout-container">
        <div className="checkout-box">
          <div className="error">Image not found</div>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        <h2>Complete Your Purchase</h2>
        
        {error && (
          <div className="error-message">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        <div className="purchase-summary">
          <div className="image-preview">
            <img src={`http://localhost:5000${image.imageUrl}`} alt={image.title} />
          </div>
          <h3>{image.title}</h3>
          <p className="contributor">by {image.contributor?.name}</p>
          <div className="price-details">
            <div className="price-row">
              <span>Image Price:</span>
              <span className="price">₹{image.price}</span>
            </div>
            <div className="price-row">
              <span>Platform Fee (20%):</span>
              <span>₹{(image.price * 0.2).toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Contributor Earns:</span>
              <span>₹{(image.price * 0.8).toFixed(2)}</span>
            </div>
            <hr />
            <div className="price-row total">
              <span>Total Amount:</span>
              <span className="price">₹{image.price}</span>
            </div>
          </div>
        </div>

        <div className="payment-info">
          <h4>What you'll get:</h4>
          <ul>
            <li>✓ Full resolution image download</li>
            <li>✓ Lifetime access in "My Purchases"</li>
            <li>✓ Commercial usage rights</li>
            <li>✓ Secure payment via Razorpay</li>
          </ul>
        </div>

        <button 
          onClick={handlePayment} 
          disabled={processing} 
          className="btn btn-primary btn-block btn-pay"
        >
          {processing ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            <>
              🔒 Pay ₹{image.price} Securely
            </>
          )}
        </button>

        <div className="payment-methods">
          <p>Accepted payment methods:</p>
          <div className="methods">
            <span>💳 Cards</span>
            <span>📱 UPI</span>
            <span>🏦 Netbanking</span>
            <span>💰 Wallets</span>
          </div>
        </div>

        <p className="payment-note">
          🔐 Secure payment powered by Razorpay<br />
          <small>Your payment information is encrypted and secure</small>
        </p>
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

export default Checkout;
