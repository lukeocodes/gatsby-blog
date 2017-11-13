import React from 'react';
import Link from 'gatsby-link';

const Footer = () => (
  <footer
    style={{
      background: 'grey',
      marginBottom: '1.45rem'
    }}
  >
    <div className="footer-section">
      <p>
        <Link to="/">blog</Link>
      </p>
    </div>
  </footer>
);

export default Footer;
