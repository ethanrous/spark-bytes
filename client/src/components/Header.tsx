// src/components/Header.tsx
import Link from 'next/link';

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

  const logoTextStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginLeft: '10px',
    color: '#FFFBE6',
    fontFamily: '"Josefin Sans", sans-serif',
  };

  const navStyle = {
    display: 'flex',
    gap: '15px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#FFFBE6',
    fontWeight: '500',
    fontFamily: '"Lato", sans-serif',
    fontSize: '16px',
  };

  return (
    <header style={headerStyle}>
      {/* Logo and Text */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/client/src/assets/spark_logo.png"
          alt="Spark! Bytes Logo"
          width={40}
          height={40}
        />
        <span style={logoTextStyle}>Spark! Bytes</span>
      </div>

      {/* Navigation Links */}
      <nav style={navStyle}>
        <Link href="/view-events" style={linkStyle}>
          View Events
        </Link>
        <Link href="/create-events" style={linkStyle}>
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
