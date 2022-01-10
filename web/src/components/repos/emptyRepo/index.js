import React, { useState } from 'react';
import Link from 'next/link';
import HowItWorks from './HowItWorks';
import * as analytics from '../../../utils/analytics';

const openGithub = () => {
  analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.ESR_CLICKED_START_REVIEWING_CODE_ON_GITHUB, {});
};

const EmptyRepo = () => {
  return (
    <div className="container">
      <div className="has-text-centered py-50">
        <p className="has-text-weight-semibold is-size-5">No Repos Yet!</p>
        <p className="mt-15 mb-15">Make some code reviews on GitHub with the Sema Plugin installed <br/>and your Repos will appear here.</p>
        <Link href="https://github.com">
          <button 
            type="button" 
            className="button is-primary mb-20 has-text-weight-semibold"
            onClick={openGithub}
          >
            Start reviewing code on GitHub
          </button>
        </Link>
      </div>
      <HowItWorks />
    </div>
  )
};

export default EmptyRepo;
