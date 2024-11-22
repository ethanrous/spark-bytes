{/*
  TODO:
  -decide which header/color scheme to use, and update colors in all other components accordingly
    -implement Brand component if you use the latter header, since its a navigation button
  -decide which view events page to use (events.tsx or view-events.tsx) and delete the other (or combine them or smth else)
  -ensure everything is center vertical alligned
  -make it so that the page you are on is highlighted or smth similar in the header
    -ie when youre at localhost:3000/view-events, the 'View Events' portion should be highlighted or underlined or smth
  */}

// src/components/Header.tsx
import Link from 'next/link';
import Brand from "./Brand";

const Header: React.FC = () => {
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#00712D',
    color: '#FFFBE6',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-evenly', 
    gap: '20px',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#FFFBE6',
    fontWeight: '500',
    fontFamily: '"Lato", sans-serif',
    fontSize: '16px',
  };

  return (
    <header style={headerStyle}>
      <Brand/>

      {/* Navigation Links */}
      <nav style={navStyle}>
        <Link href="/view-events" style={linkStyle}>
          View Events
        </Link>
        {/* <Link href="/events" style={linkStyle}>
          View Events
        </Link> */}
        <Link href="/create-event" style={linkStyle}>
          Create Events
        </Link>
        <Link href="/signup" style={linkStyle}>
          Sign Up
        </Link>
        <Link href="/login" style={linkStyle}>
          Log In
        </Link>
      </nav>
    </header>
  );
};

export default Header;

// // Header.tsx
// import React from "react";
// import Link from "next/link";
// import Image from "next/image";

// const Header: React.FC = () => {
//   return (
//     <header className="header">
//       <div className="logo">
//         <Image src="/logo.png" alt="Spark! Bytes Logo" width={40} height={40} />
//         <h1>Spark! Bytes</h1>
//       </div>
//       <nav className="nav-links">
//         <Link href="/events">
//           <div className="search-button">
//             <Image src="/search-icon.png" alt="Search Icon" width={20} height={20} />
//             Find Events
//           </div>
//         </Link>
//         <Link href="/about">About</Link>
//         <Link href="/events">Events</Link>
//         <Link href="/create-event">Create Events</Link>
//         <Link href="/sign-up">Sign Up</Link>
//         <Link href="/login">Log In</Link>
//       </nav>
//       <style jsx>{`
//         .header {
//           background-color: #8bc34a;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 10px 20px;
//         }
//         .logo {
//           display: flex;
//           align-items: center;
//         }
//         .logo h1 {
//           margin-left: 10px;
//           font-size: 24px;
//         }
//         .nav-links {
//           display: flex;
//           gap: 20px;
//           font-size: 18px;
//         }
//         .nav-links a {
//           text-decoration: none;
//           color: black;
//           cursor: pointer;
//         }
//         .search-button {
//           display: flex;
//           align-items: center;
//           background-color: white;
//           border: 1px solid black;
//           border-radius: 15px;
//           padding: 5px 15px;
//           font-size: 18px;
//           cursor: pointer;
//         }
//       `}</style>
//     </header>
//   );
// };

// export default Header;