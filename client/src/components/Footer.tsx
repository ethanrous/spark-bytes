// src/components/Footer.tsx
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#264039', color: '#F0F2F0', padding: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
        <Image src="/instagram-icon.png" alt="Instagram" width={30} height={30} />
        <Image src="/meta-icon.png" alt="Meta" width={30} height={30} />
        <Image src="/twitter-icon.png" alt="Twitter" width={30} height={30} />
      </div>
      <p></p>
      <p>© Spark! Bytes 2024</p>
    </footer>
  );
};

export default Footer;
