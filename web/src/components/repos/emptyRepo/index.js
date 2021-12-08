import React, { useState } from 'react';
import Link from 'next/link';
import HowItWorks from './HowItWorks';

const EmptyRepo = () => {
  return (
    <div className="container">
      <div className="has-text-centered py-50">
        <p className="has-text-weight-semibold is-size-5">No Repos Yet!</p>
        <p className="mt-15 mb-15">Make some code reviews on GitHub with the Sema Plugin installed <br/>and your Repos will appear here.</p>
        <Link href="https://github.com">
          <button type="button" className="button is-primary mb-20 has-text-weight-semibold">Start reviewing code on GitHub</button>
        </Link>
      </div>
      <HowItWorks />
    </div>
  )
};

export default EmptyRepo;
