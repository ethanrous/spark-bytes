{/* 
  client\src\pages\signup.tsx

  Purpose: 
    To create a sign-up page where users can register an account on the platform. 
	The page collects user details such as first name, last name, BU email address, 
	and password, then validates the inputs before sending the data to the backend API for user creation.
  */}
import React, { useState } from 'react';
import Brand from "../components/Brand";
import { UserApi } from '@/api/userApi';
import themeConfig from '../theme/themeConfig';
import { useRouter } from 'next/router';

const SignUpPage: React.FC = () => {
	const router = useRouter();

	const [first_name, setFirstName] = useState('');
	const [last_name, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [successfulSignUp, setSuccessfulSignUp] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Signing up with: ', first_name, last_name, email, password, confirmPassword);
		setSuccessfulSignUp(false);
		setLoading(true);
		setError('');

		try {
			if (!first_name || !last_name || !email || !password || !confirmPassword) {
				console.log('Missing fields');
				setError('Please fill out all fields.');
			} else if (!email.includes('@bu.edu')) {
				console.log('Invalid email');
				setError('Please use an @bu.edu email address.');
			} else if (password != confirmPassword) {
				console.log('Password fields do not match');
				setError('Passwords do not match.')
			} else if (password.length <= 6) {
				console.log('Password too short');
				setError('Password must be at least 7 characters.')
			} else {
				const res = await UserApi.createUser({ first_name, last_name, email, password })
				if (res.status === 201) {
					console.log('Sign Up successful');
					setSuccessfulSignUp(true);
					// setTimeout(() => {
					// 	router.push('/view-events')
					// }, 2000);
				} else {
					setError(`Sign Up failed: ${res.status === 400 ? "Please use BU email address." : "An error has occurred while signing up."}`);
				}
			}
		} catch (err) {
			console.error('Error signing up:', err);
			setError('An error occurred while trying to sign up.');
		} finally {
			setLoading(false);
		}
	};

	if (successfulSignUp) {
		return (
			<div style={styles.container}>
				<Brand />
				<form style={styles.form}>
					<h2 style={styles.success}>Account created successfully!</h2>
					<p style={{ paddingTop: '1rem' }}>Please check your email for a verification link</p>
				</form>
			</div>
		)
	}

	return (
		<div style={styles.container}>
			<Brand />
			<form onSubmit={handleSubmit} style={styles.form}>
				<h1 style={styles.title}>Create an Account</h1>
				<input
					type="text"
					placeholder="First name"
					value={first_name}
					onChange={(e) => setFirstName(e.target.value)}
					style={styles.input}
					required
				/>
				<input
					type="text"
					placeholder="Last name"
					value={last_name}
					onChange={(e) => setLastName(e.target.value)}
					style={styles.input}
					required
				/>
				<input
					type="email"
					placeholder="BU email address"
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
				<input
					type="password"
					placeholder="Confirm password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					style={styles.input}
					required
				/>
				<button type="submit" style={styles.button} disabled={loading}>
					{loading ? 'Signing up...' : 'Sign Up!'}
				</button>
				{error && <p style={styles.error}>{error}</p>}
				{successfulSignUp && <p style={styles.success}>Account created successfully! <br /> Redirecting you to events page...</p>}
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
		backgroundImage: 'url(/assets/colorful-food.jpeg)',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		position: 'relative',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		maxWidth: '400px',
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
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

export default SignUpPage;
