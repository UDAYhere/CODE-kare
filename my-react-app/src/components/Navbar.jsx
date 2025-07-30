import React from 'react';
import '../App.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">MyWebsite</div>
      <ul className="navbar-nav">
        <li className="nav-item"><a href="#home" className="nav-link">Home</a></li>
        <li className="nav-item"><a href="#about" className="nav-link">About</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;