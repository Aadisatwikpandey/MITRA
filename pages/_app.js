// _app.js
import { ThemeProvider } from 'styled-components';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import theme from '../styles/theme';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>MITRA - Empowering Rural Communities</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main style={{ paddingTop: '80px' }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default MyApp;