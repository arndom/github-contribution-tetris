import { useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../theme';
import createEmotionCache from '../utils/createEmotionCache';
import Layout from '../components/Layout';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';

import GlobalStyling from '../globalStyles';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      NProgress.start();
    });
    router.events.on('routeChangeError', () => {
      NProgress.done();
    });
    router.events.on('routeChangeComplete', () => {
      NProgress.done();
    });
  }, [router]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>GH Tetris</title>
        <meta name='description' content='Generated game of tetris from your github contributions' />
        <link rel='canonical' href='https://gh-tetris.vercel.app/' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <meta name='theme-color' content='#00040B' />

        <meta
          name='keywords'
          content='
            github,
            github contributions,
            github contribution graph,
            github contributions graph,
            github contribution chart,
            github contributions chart,
            tetris,
            hackathon,
            vercel,
            dev.to,
            arndom
          '
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://gh-tetris.vercel.app/' />
        <meta property='og:title' content='GH Tetris' />
        <meta property='og:description' content='Generated game of tetris from your github contributions' />
        <meta property='og:image' content='/banner.png' />

        {/* <!-- Twitter --> */}
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content='https://gh-tetris.vercel.app/' />
        <meta property='twitter:title' content='GH Tetris' />
        <meta property='twitter:description' content='Generated game of tetris from your github contributions' />
        <meta property='twitter:image' content='/banner.png' />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={() => GlobalStyling(theme)} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}
