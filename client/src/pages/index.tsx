{/*
  TODO:
    -implement Brand component if you use the latter header, since its a navigation button
  */}

// src/pages/index.tsx
import Header from '../components/Header';
import Footer from '../components/Footer';
import themeConfig from '../theme/themeConfig';

const Home: React.FC = () => {
  const mainStyle: React.CSSProperties = {
    textAlign: 'left',
    fontFamily: themeConfig.typography.fontFamilySparkBytes,
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
    color: themeConfig.colors.background,
    margin: 0,
    padding: 0,
  };

  const heroTextStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10%',
    left: '7%',
    maxWidth: '400px',
    color: themeConfig.colors.background,
    fontFamily: themeConfig.typography.fontFamily,
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: themeConfig.colors.accent,
    border: 'none',
    color: themeConfig.colors.textSecondary,
    fontFamily: themeConfig.typography.fontFamily,
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  };

  const sectionStyle = (backgroundColor: string): React.CSSProperties => ({
    padding: '50px',
    backgroundColor,
    textAlign: 'center',
    fontFamily: themeConfig.typography.fontFamily,
    color: themeConfig.colors.textPrimary,
  });

  const discoverSectionStyle: React.CSSProperties = {
    padding: '50px',
    backgroundColor: '#FFFBE6',
    textAlign: 'center',
    fontFamily: themeConfig.typography.fontFamily,
    color: themeConfig.colors.textPrimary,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const whySectionStyle: React.CSSProperties = {
    padding: '50px',
    backgroundColor: '#D5ED9F',
    textAlign: 'center',
    fontFamily: themeConfig.typography.fontFamily,
    color: themeConfig.colors.textPrimary,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const whatIsSparkBytesSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '100px',
    gap: '20px',
  };

  const textStyle: React.CSSProperties = {
    flex: 1,
    fontFamily: themeConfig.typography.fontFamily,
    color: themeConfig.colors.textPrimary,
    fontSize: '18px',
    lineHeight: '1.5',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: themeConfig.colors.textPrimary,
  };

  const imageStyle: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
  };

  const signUpSectionStyle: React.CSSProperties = {
    padding: '80px',
    backgroundColor: themeConfig.colors.primary,
    textAlign: 'center',
  };

  const signUpTitleStyle: React.CSSProperties = {
    fontSize: '22px',
    color: themeConfig.colors.background,
    fontFamily: themeConfig.typography.fontFamily,
    marginBottom: '20px',
    fontWeight: 'bold',
  };

  const signUpButtonStyle: React.CSSProperties = {
    padding: '40px 80px',
    backgroundColor: '#FF6347',
    border: 'none',
    color: themeConfig.colors.textSecondary,
    fontFamily: themeConfig.typography.fontFamily,
    fontSize: '26px',
    cursor: 'pointer',
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    
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
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = themeConfig.colors.accent}
              >
                Find Events
              </button>
            </a>
          </div>
        </section>

        <section style={whatIsSparkBytesSectionStyle}>
          <div style={textStyle}>
            <h2 style={titleStyle}>What is Spark! Bytes?</h2>
            <p>
              Imagine a world where leftover event catering doesn't end up in the trash—instead, it finds its way to hungry students. Welcome to Spark! Bytes, Boston University's revolutionary platform that transforms excess food from campus events into delicious opportunities.
              <br /><br />
              No more missed meals or wasted resources. With Spark! Bytes, you'll receive real-time notifications about free food available across campus, tailored to your dietary preferences and location. Whether you're a vegan, have specific dietary needs, or simply love a free snack, we've got you covered.
              <br /><br />
              Our mission is simple: connect hungry students with surplus food, reduce campus food waste, and create a more sustainable, community-driven dining experience. Every notification is a chance to enjoy a meal, meet fellow students, and contribute to a greener campus.
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <img src="/assets/pizza.jpg" alt="pizza" style={imageStyle} />
          </div>
        </section>

        <section style={signUpSectionStyle}>
          <h2 style={signUpTitleStyle}>
            Sign up for Spark Bytes notifications and turn campus leftovers into your next meal.
          </h2>
          <a href="/signup">
            <button
              style={signUpButtonStyle}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#FF7F00'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#FF6347'}
            >
              Sign Up!
            </button>
          </a>
        </section>

        <section style={whySectionStyle}>
          <h2>Why 'Spark! Bytes'?</h2>
          <p>
            Making sustainability simple, accessible, and delicious.
          </p>
        </section>

        <section style={discoverSectionStyle}>
          <h2>Discover Events Near You</h2>
          <p>Join us in reducing food waste by finding events offering free food.</p>
          <a href="/view-events">
            <button
              style={buttonStyle}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#FF7F00'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = themeConfig.colors.accent}
            >
              View Events
            </button>
          </a>
        </section>

        <section style={sectionStyle('#D5ED9F')}>
          <h2>Get Involved</h2>
          <p>Create events and share your leftovers with the BU community.</p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
