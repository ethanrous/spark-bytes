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
  };

  const heroTextStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10%',
    left: '7%',
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
    // marginBottom,
  });

  return (
    <>
      <Header />
      <main style={mainStyle}>
        <section style={heroSectionStyle}>
        {/* 
        TODO: 
        -fix so placement of everything is consistent with all window sizes  
        -make button hoverable
        */}
          <div style={heroTextStyle}>
            <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>Sustainability at Its Core</h1>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>Turn leftovers into opportunities. <br/> Free food, zero waste.</p>
            <a href="/view-events">
              <button style={buttonStyle} id="find-events">Find Events</button>
            </a>
          </div>
          {/* 
          TODO: 
          -place in all photos, ensure correct scaling
          -placement in bottom right or smth similar
          -same thing with location consistency accross window sizes
          -consider making this a component
          */}
          {/* SCALING AND LOCATION ARE TEMPORARY */}
          <a href="https://www.instagram.com/bostonuniversitygms/?hl=en" target="_blank" style={{textDecoration: "none", display: "flex", alignItems: "center", position: "relative", top: "95%", left: "86%"}}>
            <img src="../assets/instagram.svg" style={{width: "2.5%", height: "auto", paddingRight: 8}} />
            <p style={{color: "white"}}>@bostonuniversitygms</p>
          </a>
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
          <h2>Why 'Spark! Bytes'?</h2>
          <p>Making sustainability simple, accessible, and delicious.</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
