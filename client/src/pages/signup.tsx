// pages/signup.tsx
import React, { useState } from 'react';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [buid, setBuid] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successfulSignUp, setSuccessfulSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signing up with', email, buid, password, retypePassword);
    setSuccessfulSignUp(false);

    if (password !== retypePassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          buid,
          password,
        }),
      });

      if (response.ok) {
        console.log('Sign Up successful');
        setSuccessfulSignUp(true);
      } else {
        setError(`Sign Up failed: ${response.status === 400 ? "Invalid input." : "An error has occurred while signing up."}`);
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setError('An error occurred while trying to sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* "Create an Account" text inside the white box */}
        <h1 style={styles.title}>Create an Account</h1>
        <input
          type="email"
          placeholder="Enter BU email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Enter BUID"
          value={buid}
          onChange={(e) => setBuid(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Retype password"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up!'}
        </button>
        {error && <p style={styles.error}>{error}</p>}
        {successfulSignUp && <p style={styles.success}>Account created successfully!</p>}
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
    backgroundImage: 'url(client\src\assets\food squares.jpeg)', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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

export default SignUpPage;
