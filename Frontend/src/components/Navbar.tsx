import React from 'react';
import { Link } from 'react-router-dom';
import '@styles/Navbar.scss';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Gaming Website</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/support">Support</Link>
        <Link to="/login" className="login-button">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar; 