// pages/signup.tsx
import React, { useState } from 'react';
import { Divider } from "antd";
import Brand from "../components/Brand";

const SignUpPage: React.FC = () => {
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

      //seeing if account already exists
      const alreadySignedUp = await fetch(`http://localhost:5001/users/?email=${email}`)
      if (alreadySignedUp.ok) {
        {/*
          TODO:
          -make the 'Please log in.' or 'log in' part of the text a blue hyperlink to the login page
          */}
        setError("An account with that email already exists. Please log in.")
        return;
      } else if (password.length <= 7) {
        setError("Password must be at least 7 characters.")
        return;
      } else if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      } else {
      //adding user to db
        const response = await fetch('http://localhost:5001/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            first_name,
            last_name
          }),
        });

        if (response.ok) {
          console.log('Sign Up successful');
          setSuccessfulSignUp(true);
        } else {
          setError(`Sign Up failed: ${response.status === 400 ? "Please use BU email address." : "An error has occurred while signing up."}`);
        }
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
      <Brand/>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* "Create an Account" text inside the white box */}
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
        <Divider style={styles.divider}/>
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
        {successfulSignUp && <p style={styles.success}>Account created successfully! <br/> Please check your inbox for verification.</p>}
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
    backgroundImage: 'url(/assets/crowded.jpg)', 
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
  divider: {
    backgroundColor: "black",
    margin: "10px 0"
  },
  button: {
    padding: '12px',
    backgroundColor: '#FF9100',
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
