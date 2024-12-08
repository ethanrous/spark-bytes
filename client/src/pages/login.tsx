// pages/login.tsx
import React, { useState } from 'react';
import Brand from "../components/Brand";
import { UserApi } from '@/api/userApi';
import themeConfig from '../theme/themeConfig';
import { useRouter } from 'next/navigation';
import { User, useSessionStore } from '@/state/session';

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successfulLogin, setSuccessfulLogin] = useState(false);
	const router = useRouter()
	const setUser = useSessionStore(state => state.setUser)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Logging in with', email, password);
		setSuccessfulLogin(false);

		setLoading(true);
		setError('');

		try {
			const response = await UserApi.loginUser({ email, password });
			if (response.status === 200) {
				console.log('Login successful');
				setSuccessfulLogin(true);
				setUser(new User(response.data));
				router.push('/');
			} else {
				setError(`Login failed: ${response.status === 401 ? "Incorrect email or password." : "An error has occurred while logging in."}`);
			}
		} catch (err) {
			console.error('Error logging in:', err);
			setError('An error occurred while trying to login.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={styles.container}>
			<Brand />
			<form onSubmit={(e) => { handleSubmit(e).catch((err) => console.error(err)) }} style={styles.form}>
				<h1 style={styles.title}>Log In</h1>
				<input
					type="email"
					placeholder="Email address"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					style={styles.input}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					style={styles.input}
					required
				/>
				<button type="submit" style={styles.button} disabled={loading}>
					{loading ? 'Logging in...' : 'Log in'}
				</button>
				{error && <p style={styles.error}>{error}</p>}
				{successfulLogin && <p style={styles.success}>Welcome {email}!</p>}
			</form>
		</div>
	);
};

const styles: { [key: string]: React.CSSProperties } = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
		backgroundImage: 'url(/assets/field.jpg)',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		position: 'relative',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		maxWidth: '400px',
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		padding: '20px',
		borderRadius: '8px',
		boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
		textAlign: 'center',
	},
	title: {
		fontSize: '2.5rem',
		fontWeight: 'bold',
		color: themeConfig.colors.textPrimary,
		marginBottom: '20px',
		fontFamily: themeConfig.typography.fontFamilySparkBytes,
	},
	input: {
		padding: '12px',
		margin: '10px 0',
		fontSize: '1rem',
		borderRadius: '5px',
		border: `1px solid ${themeConfig.colors.textPrimary}`,
		outline: 'none',
		fontFamily: themeConfig.typography.fontFamily,
	},
	button: {
		padding: '12px',
		backgroundColor: themeConfig.colors.accent,
		color: '#fff',
		fontSize: '1rem',
		fontWeight: 'bold',
		borderRadius: '5px',
		border: 'none',
		cursor: 'pointer',
		fontFamily: themeConfig.typography.fontFamily,
	},
	error: {
		color: 'red',
		fontSize: '0.9rem',
		marginTop: '10px',
		fontFamily: themeConfig.typography.fontFamily,
	},
	success: {
		color: 'green',
		fontSize: '0.9rem',
		marginTop: '10px',
		fontFamily: themeConfig.typography.fontFamily,
	},
};

export default LoginPage;
