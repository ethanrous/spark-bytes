// src/components/Footer.tsx
import { InstagramOutlined, FacebookOutlined, TwitterOutlined } from '@ant-design/icons';

const Footer: React.FC = () => {
  const logoStyle = {
    fontSize: '24px',
    margin: '0 10px',
    color: '#FFFBE6',
    cursor: 'pointer',
  };

  return (
    <footer
      style={{
        backgroundColor: '#00712D',
        color: '#FFFBE6',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          marginBottom: '20px',
        }}
      >
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <InstagramOutlined style={logoStyle} />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <FacebookOutlined style={logoStyle} />
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <TwitterOutlined style={logoStyle} />
        </a>
      </div>
      <p>© {new Date().getFullYear()} Spark! Bytes. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
