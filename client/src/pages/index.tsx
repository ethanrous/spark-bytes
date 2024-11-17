// src/pages/index.tsx
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const mainStyle: React.CSSProperties = {
    textAlign: 'left',
    fontFamily: '"Lato", sans-serif',
    margin: 0, 
    padding: 0, 
  };

  const heroSectionStyle: React.CSSProperties = {
    position: 'relative',
    height: '100vh', 
    width: '100%', 
    backgroundImage: `url('/assets/green_planet.jpeg')`,
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    color: '#FFFBE6',
    margin: 0, 
    padding: 0, 
  };

  const heroTextStyle: React.CSSProperties = {
    position: 'absolute',
    top: '30%',
    left: '10%',
    maxWidth: '400px',
    color: '#FFFBE6',
    fontFamily: '"Josefin Sans", sans-serif',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#FF9100',
    border: 'none',
    color: '#FFFBE6',
    fontFamily: '"Lato", sans-serif',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
  };

  const sectionStyle = (backgroundColor: string, marginBottom: string = '0'): React.CSSProperties => ({
    padding: '50px',
    backgroundColor,
    textAlign: 'center',
    fontFamily: '"Josefin Sans", sans-serif',
    color: '#264039',
    marginBottom,
  });

  return (
    <>
      <Header />
      <main style={mainStyle}>
        <section style={heroSectionStyle}>
          <div style={heroTextStyle}>
            <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>Sustainability at its core</h1>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>Turn Leftovers into Opportunities: Free Food, Zero Waste</p>
            <button style={buttonStyle}>Find Events</button>
          </div>
        </section>

        {/* Additional sections */}
        <section style={sectionStyle('#D5ED9F')}>
          <h2>Discover Events Near You</h2>
          <p>Join us in reducing food waste by finding events offering free food.</p>
        </section>
        <section style={sectionStyle('#FFFBE6')}>
          <h2>Get Involved</h2>
          <p>Create events and share your leftovers with the BU community.</p>
        </section>
        <section style={sectionStyle('#FF9100', '40px')}> 
          <h2>Why Spark! Bytes?</h2>
          <p>Making sustainability simple, accessible, and delicious.</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
