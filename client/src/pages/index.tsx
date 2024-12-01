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
    backgroundImage: `url('/assets/food-table.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#FFFBE6',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const heroTextStyle: React.CSSProperties = {
    textAlign: 'center',
    maxWidth: '600px',
    color: '#FFFBE6',
    fontFamily: '"Josefin Sans", sans-serif',
    padding: '20px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    backgroundColor: '#FF9100',
    border: 'none',
    color: '#FFFBE6',
    fontFamily: '"Lato", sans-serif',
    fontSize: '18px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: '#FF7F00',
  };

  const sectionStyle = (backgroundColor: string, marginBottom: string = '0'): React.CSSProperties => ({
    padding: '50px 20px',
    backgroundColor,
    textAlign: 'center',
    fontFamily: '"Josefin Sans", sans-serif',
    color: '#264039',
    marginBottom,
  });

  const instagramLinkStyle: React.CSSProperties = {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: '10px',
    right: '10px',
  };

  const instagramImageStyle: React.CSSProperties = {
    width: '30px',
    height: 'auto',
    marginRight: '8px',
  };

  return (
    <>
      <Header />
      <main style={mainStyle}>
        <section style={heroSectionStyle}>
          <div style={heroTextStyle}>
            <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>Sustainability at Its Core</h1>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              Turn leftovers into opportunities. <br />
              Free food, zero waste.
            </p>
            <a href="/view-events">
              <button
                style={buttonStyle}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#FF7F00'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#FF9100'}
              >
                Find Events
              </button>
            </a>
          </div>
          <a href="https://www.instagram.com/bostonuniversitygms/?hl=en" target="_blank" style={instagramLinkStyle}>
            <img src="../assets/instagram.svg" style={instagramImageStyle} />
            <p style={{ color: 'white' }}>@bostonuniversitygms</p>
          </a>
        </section>

        <section style={sectionStyle('#D5ED9F')}>
          <h2>Discover Events Near You</h2>
          <p>Join us in reducing food waste by finding events offering free food.</p>
        </section>

        <section style={sectionStyle('#FFFBE6')}>
          <h2>Get Involved</h2>
          <p>Create events and share your leftovers with the BU community.</p>
        </section>

        <section style={sectionStyle('#FF9100', '40px')}>
          <h2>Why 'Spark! Bytes'?</h2>
          <p>Making sustainability simple, accessible, and delicious.</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
