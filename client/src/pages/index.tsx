// src/pages/index.tsx
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <main style={{ textAlign: 'left', padding: '50px', backgroundColor: '#F0F2F0' }}>
        <section 
          style={{ 
            position: 'relative', 
            height: '100vh', 
            backgroundImage: 'url(/IMG_673.png)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        >
          <div style={{ color: '#F0F2F0', position: 'absolute', top: '30%', left: '10%', maxWidth: '400px' }}>
            <h1>Sustainability at its core</h1>
            <p>Turn Leftovers into Opportunities: Free Food, Zero Waste</p>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#7D8C6D',
              border: 'none',
              color: '#F0F2F0',
              cursor: 'pointer'
            }}>Find Events</button>
          </div>
        </section>

        {/* Additional sections can be added here */}
        <section style={{ padding: '50px', backgroundColor: '#C2D9BF' }}>Section 1</section>
        <section style={{ padding: '50px', backgroundColor: '#B2BF9F' }}>Section 2</section>
        <section style={{ padding: '50px', backgroundColor: '#7D8C6D' }}>Section 3</section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
