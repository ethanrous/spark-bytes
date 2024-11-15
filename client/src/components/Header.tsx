// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import themeConfig from '../theme/themeConfig'; // Import the theme configuration

const Header: React.FC = () => {
  const { colors, typography } = themeConfig;

  // Styles for header and elements
  const headerStyle = {
    position: 'sticky',
    top: 0,
    backgroundColor: colors.secondaryBackground,
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    zIndex: 1000,
    fontFamily: typography.fontFamily,
  };

  const logoTextStyle = {
    margin: 0,
    fontSize: '1.5rem',
    color: colors.textPrimary,
    paddingLeft: '10px',
    fontFamily: 'Lato, sans-serif', // Font for the title
  };

  const navStyle = {
    marginLeft: 'auto',
    display: 'flex',
    gap: '20px',
  };

  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image src="/logo.png" alt="Spark! Bytes Logo" width={40} height={40} />
        <h1 style={logoTextStyle}>Spark! Bytes</h1>
      </div>
      <nav style={navStyle}>
        <Link href="/about" style={{ color: colors.textPrimary }}>
          About
        </Link>
        <Link href="/view-events" style={{ color: colors.textPrimary }}>
          View Events
        </Link>
        <Link href="/create-events" style={{ color: colors.textPrimary }}>
          Create Events
        </Link>
        <Link href="/signup" style={{ color: colors.textPrimary }}>
          Sign Up
        </Link>
        <Link href="/login" style={{ color: colors.textPrimary }}>
          Log In
        </Link>
      </nav>
    </header>
  );
};

export default Header;
