import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import ImageDetail from './pages/ImageDetail';
import Checkout from './pages/Checkout';
import MyPurchases from './pages/MyPurchases';
import MyEarnings from './pages/MyEarnings';
import RequestPayout from './pages/RequestPayout';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import MyUploads from './pages/MyUploads';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Refund from './pages/legal/Refund';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/image/:id" element={<ImageDetail />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/my-purchases" element={<MyPurchases />} />
            <Route path="/my-earnings" element={<MyEarnings />} />
            <Route path="/my-uploads" element={<MyUploads />} />
            <Route path="/request-payout" element={<RequestPayout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund" element={<Refund />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
