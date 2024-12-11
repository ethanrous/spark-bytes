import Link from 'next/link';
import { useRouter } from 'next/router';
import Brand from './Brand';
import themeConfig from '@/theme/themeConfig';
import { User, useSessionStore } from '@/state/session';
import { UserApi } from '@/api/userApi';


const Header: React.FC = () => {
	const router = useRouter();
	const user = useSessionStore(state => state.user)
	const setUser = useSessionStore(state => state.setUser)

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
		cursor: 'pointer',
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
				<Link href="/my-events" style={router.pathname === '/my-events' ? activeLinkStyle : linkStyle}>
					My Events
				</Link>
				{!user?.loggedIn && (
					<>
						<Link href="/signup" style={router.pathname === '/signup' ? activeLinkStyle : linkStyle}>
							Sign Up
						</Link>
						<Link href="/login" style={router.pathname === '/login' ? activeLinkStyle : linkStyle}>
							Log In
						</Link>
					</>
				)}
				{user?.loggedIn && (
					<div onClick={() => { UserApi.logoutUser().then(() => setUser(new User())) }} style={linkStyle}>
						Log Out
					</div>
				)}
			</nav>
		</header>
	);
};

export default Header;
