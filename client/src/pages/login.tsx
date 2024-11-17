// pages/login.tsx
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successfulLogin, setSuccessfulLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with', email, password);
    setSuccessfulLogin(false);

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        console.log('Login successful');
        setSuccessfulLogin(true);
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
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* "Log In" text inside the white box */}
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={styles.error}>{error}</p>}
        {successfulLogin && <p style={styles.success}>Welcome {email}!</p>}
      </form>
    </div>
  );
};

// Explicitly type the styles object using React.CSSProperties
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: 'url(/assets/steak.jpeg)',
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
    color: '#333333',
    marginBottom: '20px',
  },
  input: {
    padding: '12px',
    margin: '10px 0',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '12px',
    backgroundColor: '#C74B33',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
    marginTop: '10px',
  },
  success: {
    color: 'green',
    fontSize: '0.9rem',
    marginTop: '10px',
  },
};

export default LoginPage;
