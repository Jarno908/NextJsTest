import App from 'next/app';
import { AppProps, AppContext } from 'next/app';
import { SessionProvider, getSession, useSession } from 'next-auth/react';
import { useState } from 'react';
import { getCookie, setCookies } from 'cookies-next';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';

const MyApp = (props: AppProps & { colorScheme: ColorScheme, pathName: string }) => {
  const { Component, pageProps : { session, ...pageProps} } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 400 });
  }

  return (
    <SessionProvider session={session}>
      {/* <Auth pathName={props.pathName}> */}
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS >
            <Component {...pageProps} />
          </MantineProvider>
        </ColorSchemeProvider>
      {/* </Auth> */}
    </SessionProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)
  const colorScheme = getCookie('mantine-color-scheme', appContext.ctx) || 'light';
  const pathName = appContext.router.pathname;
  return { ...appProps, colorScheme, pathName }
};

function Auth({children, pathName}: {children: JSX.Element, pathName: string}) {
  if(pathName && pathName.startsWith("/auth/")) return children

  const { status } = useSession({ required: true })

  if (status === 'loading') {
    return <div>Loading...</div>
  }
  
  return children
}

export default MyApp;
