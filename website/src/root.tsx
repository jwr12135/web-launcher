// @refresh reload
import {Component, Suspense} from 'solid-js';
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start';
import '@fontsource-variable/nunito';
import Header from '~/app/components/Header';
import './root.css';

const Root: Component = () => {
  return (
    <Html lang='en'>
      <Head>
        <Title>Sourcetab: New Tab Dashboard</Title>
        <Meta charset='utf-8' />
        <Meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta
          name='description'
          content="An open-source dashboard for your browser's new tab page, customizable with a variety of widgets and settings."
        />
        <Meta name='theme-color' content='#2196F3' />
        <Link rel='icon' type='image/png' href='/favicon.png' />
      </Head>
      <Body>
        <ErrorBoundary>
          <Header />
          <Suspense>
            <main class='m-auto px-5 py-3 max-w-3xl'>
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </Suspense>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
};

export default Root;
