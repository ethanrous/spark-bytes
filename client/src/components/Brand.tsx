import Image from 'next/image';

const logoTextStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginLeft: '10px',
    color: '#FFFBE6',
    fontFamily: '"Josefin Sans", sans-serif',
  };

const Brand: React.FC = () => {
    {/*
    TODO
    -the text is not fully vertically aligned with the logo (i think)
    -i would like it to have an optional margin value, so the login/singup
      pages can have it above the form box and the header wont be affected
    -perhaps a size option too so it can be bigger on the login/signup pages
    */}
    return (
        <a href="/" style={{textDecoration: "none", backgroundColor: "#00712D", borderRadius: "5px"}}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/assets/spark_logo.png"
              alt="Spark! Bytes Logo"
              width={40}
              height={40}
            />
            <span style={logoTextStyle}>Spark! Bytes</span>
          </div>
      </a>
    );
}

export default Brand