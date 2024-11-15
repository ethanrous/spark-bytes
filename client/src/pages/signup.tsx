import React, { useState } from 'react';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
    
        try {
            const alreadySignedUp = await fetch(`http://localhost:5001/users/?email=${email}`)
            if (alreadySignedUp.ok) {
                setMessage(`An account with email '${email}' already exists. Please log in.`)
            } else if (password.length <= 5){
                    setMessage("Please enter a password with a minimum of 5 characters.")
            } else {
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
                    setMessage(`Account successfully created! Check ${email} for verification to continue.`)
                    //send email verification
                } else {
                    setMessage(`Error creating account: ${response.status}`)
                    setLoading(false)
                }
            }
        } catch (error) {
            setMessage(`An error occurred while trying to sign up.`)
        }
        setLoading(false)
    }   

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Sign up</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email Address"
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
                    placeholder="First name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    placeholder="Last name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button} disabled={loading}>{loading ? "Creating account..." : "Sign up"}</button>
                {message}
            </form>
        </div>
    )
}

// same style as login buttons
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#3B1C57',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '400px',
        marginTop: '20px',
    },
    input: {
        padding: '10px',
        margin: '10px 0',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
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
    }
};

export default SignUpPage;