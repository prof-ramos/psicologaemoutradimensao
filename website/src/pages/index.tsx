import React, { type ReactElement } from 'react';
import Head from '@docusaurus/Head';
import Loader from '@site/src/components/Loader';
import '../css/ComingSoon.css';

export default function Home(): ReactElement {
  return (
    <>
      <Head>
        <title>Psicóloga em outra dimensão</title>
        <meta name="description" content="Psicóloga em outra dimensão - Em Breve" />
      </Head>
      <main className="coming-soon-container">
        <Loader />
      </main>
              <footer className="footer-memory">
                <em>In Loving Memory of Hashtag</em>
              </footer>    </>
  );
}
