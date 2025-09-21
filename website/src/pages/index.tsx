import React from 'react';
import Head from '@docusaurus/Head';
import ComingSoonButton from '@site/src/components/ComingSoonButton';
import '../css/ComingSoon.css';

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Em Breve</title>
        <meta name="description" content="Em Breve" />
      </Head>
      <div className="coming-soon-container">
        <ComingSoonButton />
      </div>
    </>
  );
}
