import React, { useState } from 'react';
import Link from 'next/link';
import usePermission from '../../../hooks/usePermission';
import HowItWorks from './HowItWorks';
import * as analytics from '../../../utils/analytics';
import TeamReposList from '../../../components/teamReposList';

const openGithub = () => {
  analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.ESR_CLICKED_START_REVIEWING_CODE_ON_GITHUB, {});
};

const EmptyRepo = () => {
  const [isRepoListOpen, setRepoListOpen] = useState(false);
  const { isTeamAdmin } = usePermission();
  return (
    <div className="container">
      {isTeamAdmin && (
        <TeamReposList
          onClose={() => setRepoListOpen(false)}
          isActive={isRepoListOpen}
        />
      )}
      <div className="has-text-centered py-50 is-flex is-flex-direction-column">
        <p className="has-text-weight-semibold is-size-5">No Repos Yet!</p>
        <p className="mt-15 mb-15">Make some code reviews on GitHub with the Sema Plugin installed <br/>and your Repos will appear here.</p>
        <div className="mx-auto">
          {isTeamAdmin && (
            <button
              type="button"
              className="button is-primary mb-20 has-text-weight-semibold is-fullwidth"
              onClick={() => setRepoListOpen(true)}
            >
              Add a Repo to Team
            </button>
          )}
          <Link href="https://github.com">
            <button
              type="button"
              className="button is-outlined is-primary has-text-weight-semibold is-fullwidth"
              onClick={openGithub}
            >
              Start reviewing code on GitHub
            </button>
          </Link>
        </div>
      </div>
      <HowItWorks />
    </div>
  );
};

export default EmptyRepo;
