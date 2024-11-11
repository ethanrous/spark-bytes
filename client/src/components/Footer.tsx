// components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="social-icons">
                <Link href="#"><a><Image src="/instagram-icon.png" alt="Instagram" width={20} height={20} /></a></Link>
                <Link href="#"><a><Image src="/x-icon.png" alt="X" width={20} height={20} /></a></Link>
                <Link href="#"><a><Image src="/facebook-icon.png" alt="Facebook" width={20} height={20} /></a></Link>
                <Link href="#"><a><Image src="/link-icon.png" alt="Website Link" width={20} height={20} /></a></Link>
            </div>
            <p>Copyright © 2024 *Spark!*, All rights reserved.</p>
            <p>Want to change how you receive these emails?<br />
                You can <Link href="#"><a>update your preferences</a></Link> or <Link href="#"><a>unsubscribe from this list</a></Link>.
            </p>
            <style jsx>{`
                .footer {
                    background-color: #e0f2f1;
                    text-align: center;
                    padding: 20px;
                    width: 100%;
                    position: fixed;
                    bottom: 0;
                }
                .social-icons {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                p {
                    color: #333;
                    font-size: 14px;
                }
                a {
                    color: black;
                    text-decoration: none;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
