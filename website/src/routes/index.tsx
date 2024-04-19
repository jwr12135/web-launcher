import {Component} from 'solid-js';
import {A} from 'solid-start';
import Features from '~/app/components/Features.mdx';
import Screenshots from '~/app/components/Screenshots';
import ChromeIcon from '~icons/simple-icons/googlechrome';
import EdgeIcon from '~icons/simple-icons/microsoftedge';
import FirefoxIcon from '~icons/simple-icons/firefoxbrowser';

const Home: Component = () => {
  return (
    <>
      <h1 class='font-bold p-5 text-center'>Sourcetab: New Tab Dashboard</h1>
      <p class='text-xl p-2 text-center'>
        An open-source dashboard for your browser&apos;s new tab page,
        customizable with a variety of widgets and settings.
      </p>
      <hr />
      <div class='text-center'>Install on Chrome, Edge, or Firefox:</div>
      <div class='flex flex-row justify-center gap-3 my-5'>
        <A
          class='w-11 h-12 p-1 text-[#0F9D58] text-opacity-70 hover:text-opacity-100'
          href='https://chrome.sourcetab.org'
          target='_blank'
        >
          <ChromeIcon height='100%' width='100%' />
        </A>
        <A
          class='w-11 h-12 p-1 text-[#0078D7] text-opacity-70 hover:text-opacity-100'
          href='https://edge.sourcetab.org'
          target='_blank'
        >
          <EdgeIcon height='100%' width='100%' />
        </A>
        <A
          class='w-11 h-12 p-1 text-[#FF7139] text-opacity-70 hover:text-opacity-100'
          href='https://firefox.sourcetab.org'
          target='_blank'
        >
          <FirefoxIcon height='100%' width='100%' />
        </A>
      </div>
      <div class='flex flex-row justify-center gap-3 my-3'>
        <A
          class='btn-secondary'
          href='https://web.sourcetab.org'
          target='_blank'
        >
          View Demo
        </A>
      </div>
      <Features />
      <Screenshots />
    </>
  );
};

export default Home;
