import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">ImagesBazaar</Link>
        
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMobileMenu}>Home</Link>
          {user ? (
            <>
              <Link to="/upload" onClick={closeMobileMenu}>Upload</Link>
              <Link to="/wishlist" onClick={closeMobileMenu}>❤️ Wishlist</Link>
              <Link to="/my-purchases" onClick={closeMobileMenu}>My Purchases</Link>
              {user.role === 'contributor' && (
                <Link to="/my-earnings" onClick={closeMobileMenu}>Earnings</Link>
              )}
              <Link to="/profile" onClick={closeMobileMenu} className="user-info-link">
                <div className="user-info">
                  <div className="user-avatar">{getInitials(user.name)}</div>
                  <span className="user-name">{user.name}</span>
                </div>
              </Link>
              <button onClick={() => { logout(); closeMobileMenu(); }} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" onClick={closeMobileMenu}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
