// src/components/Header.tsx
import Link from 'next/link';
import Brand from "./Brand";
import Image from "next/image";
import React from "react";

const Header: React.FC = () => {
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#00712D',
    color: '#FFFBE6',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-evenly', 
    gap: '20px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#FFFBE6',
    fontWeight: '500',
    fontFamily: '"Lato", sans-serif',
    fontSize: '16px',
  };

  {/*
    TODO:
    -ensure everything is center vertical alligned
    -make it so that the page you are on is highlighted or smth similar in the header
      (ex- when youre at localhost:3000/view-events, the 'View Events' portion should be highlighted or underlined or smth)
  */}
  return (
    <header style={headerStyle}>
      <Brand/>

      {/* Navigation Links */}
      <nav style={navStyle}>
        <Link href="/events">
          <div className="search-button">
            <Image src="/search-icon.png" alt="Search Icon" width={20} height={20} />
            Find Events
          </div>
        </Link>
        <Link href="/view-events" style={linkStyle}>
          View Events
        </Link>
        <Link href="/create" style={linkStyle}>
          Create Events
        </Link>
        <Link href="/signup" style={linkStyle}>
          Sign Up
        </Link>
        <Link href="/login" style={linkStyle}>
          Log In
        </Link>
      </nav>
    </header>
  );
};

export default Header;
