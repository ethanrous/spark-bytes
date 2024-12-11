{/* 
  src/components/Brand.tsx

  Purpose: 
    Renders the Spark! Bytes logo and brand name as a clickable link to the homepage.
  */}
import Image from 'next/image';
import themeConfig from '../theme/themeConfig';
import Link from 'next/link';

const logoTextStyle = {
	fontSize: '20px',
	fontWeight: 'bold',
	marginLeft: '10px',
	color: themeConfig.colors.background,
	fontFamily: themeConfig.typography.fontFamily,
	lineHeight: '40px',
};

const Brand: React.FC = () => {
	return (
		<Link
			href="/"
			style={{
				textDecoration: 'none',
				backgroundColor: themeConfig.colors.primary,
				borderRadius: '5px',
				padding: '5px 10px',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<Image
					src="/assets/logo.png"
					alt="Spark! Bytes Logo"
					width={40}
					height={40}
					style={{ objectFit: 'contain' }}
				/>
				<span style={logoTextStyle}>Spark! Bytes</span>
			</div>
		</Link>
	);
};

export default Brand;
