{/*
  TODO:
    -implement Brand component if you use the latter header, since its a navigation button
  */}

// src/components/Header.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import Brand from './Brand';
import themeConfig from '@/theme/themeConfig';


const Header: React.FC = () => {
  const router = useRouter();

  const getUser = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  };

  const user = getUser(); // Correctly define the `user` variable here
  
  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('user');
    router.push('/login'); // Redirect to login page
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '3px 10px',
    backgroundColor: themeConfig.colors.primary,
    color: themeConfig.colors.background,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: '20px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: themeConfig.colors.background,
    fontWeight: '500',
    fontFamily: themeConfig.typography.fontFamilySparkBytes,
    fontSize: '16px',
  };

  const activeLinkStyle = {
    ...linkStyle,
    color: themeConfig.colors.accent,
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
          Create Event
        </Link>
        {user && (
          <Link href="/my-events" style={router.pathname === '/my-events' ? activeLinkStyle : linkStyle}>
            My Events
          </Link>
        )}
        <Link href="/signup" style={router.pathname === '/signup' ? activeLinkStyle : linkStyle}>
          Sign Up
        </Link>
        {!user ? (
          <Link href="/login" style={router.pathname === '/login' ? activeLinkStyle : linkStyle}>
            Log In
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 'auto',
              padding: '10px 20px',
              cursor: 'pointer',
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontFamily: themeConfig.typography.fontFamily,
              fontWeight: 'bold',
            }}
          >
            Log Out
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;