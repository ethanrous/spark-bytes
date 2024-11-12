// components/Header.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="logo">
                <Image src="/logo.png" alt="Spark! Bytes Logo" width={40} height={40} />
                <h1>Spark! Bytes</h1>
            </div>
            <nav className="nav-links">
                <Link href="#">
                    <a className="search-button">
                        <Image src="/search-icon.png" alt="Search Icon" width={20} height={20} />
                        Find Events
                    </a>
                </Link>
                <Link href="#"><a>About</a></Link>
                <Link href="#"><a>Create Events</a></Link>
                <Link href="#"><a>Sign Up</a></Link>
                <Link href="#"><a>Log In</a></Link>
            </nav>
            <style jsx>{`
                .header {
                    background-color: #8bc34a;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 20px;
                }
                .logo {
                    display: flex;
                    align-items: center;
                }
                .logo h1 {
                    margin-left: 10px;
                    font-size: 24px;
                }
                .nav-links {
                    display: flex;
                    gap: 20px;
                    font-size: 18px;
                }
                .nav-links a {
                    text-decoration: none;
                    color: black;
                }
                .search-button {
                    display: flex;
                    align-items: center;
                    background-color: white;
                    border: 1px solid black;
                    border-radius: 15px;
                    padding: 5px 15px;
                    font-size: 18px;
                    cursor: pointer;
                }
            `}</style>
        </header>
    );
};

export default Header;