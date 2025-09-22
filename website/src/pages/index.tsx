import React from 'react';
import Head from '@docusaurus/Head';
import Loader from '@site/src/components/Loader';
import '../css/ComingSoon.css';

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Em Breve</title>
        <meta name="description" content="Em Breve" />
      </Head>
      <div className="coming-soon-container">
        <Loader />
      </div>
      <footer className="footer-memory">
        <em>In Loving Memory of Hashtag</em>
      </footer>
    </>
  );
}
