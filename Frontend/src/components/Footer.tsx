import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/support">Support</Link>
        </div>
        <div className="footer-section">
          <h3>Products</h3>
          <Link to="/products">Games</Link>
          <Link to="/products">Accessories</Link>
          <Link to="/products">Merchandise</Link>
        </div>
        <div className="footer-section">
          <h3>Legal</h3>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/refund">Refund Policy</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Gaming Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 