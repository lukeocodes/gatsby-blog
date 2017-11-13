import React from 'react';
import Link from 'gatsby-link';
import { Navbar } from 'react-bootstrap';

const Header = () => (
  <Navbar
    staticTop
    inverse
    fluid
    style={{
      marginBottom: 0
    }}
  >
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">blog</Link>
      </Navbar.Brand>
    </Navbar.Header>
  </Navbar>
);

export default Header;
