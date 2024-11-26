import type { AppProps } from 'next/app';
import themeConfig from '../theme/themeConfig';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      style={{
        fontFamily: themeConfig.typography.fontFamily,
        backgroundColor: themeConfig.colors.background,
        color: themeConfig.colors.textPrimary,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      {/* Reset styles */}
      <style global jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body,
        #__next {
          height: 100%;
          width: 100%;
          overflow: hidden; /* Prevent extra scrollbars */
        }
      `}</style>

      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

