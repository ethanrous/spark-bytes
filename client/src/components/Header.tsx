{/*
  TODO:
  -decide which header/color scheme to use, and update colors in all other components accordingly
    -implement Brand component if you use the latter header, since its a navigation button
  */}

// src/components/Header.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import Brand from "./Brand";

const Header: React.FC = () => {
  const router = useRouter();

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

  const activeLinkStyle = {
    ...linkStyle,
    color: '#00A2FF', 
    fontWeight: 'bold', 
  };

  return (
    <header style={headerStyle}>
      <Brand />

      {/* Navigation Links */}
      <nav style={navStyle}>
        <Link href="/view-events" style={router.pathname === '/view-events' ? activeLinkStyle : linkStyle}>
          View Events
        </Link>
        <Link href="/create-event" style={router.pathname === '/create-event' ? activeLinkStyle : linkStyle}>
          Create Events
        </Link>
        <Link href="/signup" style={router.pathname === '/signup' ? activeLinkStyle : linkStyle}>
          Sign Up
        </Link>
        <Link href="/login" style={router.pathname === '/login' ? activeLinkStyle : linkStyle}>
          Log In
        </Link>
      </nav>
    </header>
  );
};

export default Header;
