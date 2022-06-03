import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import usePermission from '../../../hooks/usePermission';
import { PROFILE_VIEW_MODE } from '../../../utils/constants';
import HowItWorks from './HowItWorks';
import * as analytics from '../../../utils/analytics';
import OrganizationReposList from '../../../components/organizationReposList';

const openGithub = () => {
  analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.ESR_CLICKED_START_REVIEWING_CODE_ON_GITHUB, {});
};

const EmptyRepo = () => {
  const [isRepoListOpen, setRepoListOpen] = useState(false);
  const { isOrganizationAdmin } = usePermission();
  const {
    organizationsNewState: { organizations: organizations },
    authState: { profileViewMode },
  } = useSelector((state) => state);
  const isOrganizationView = profileViewMode === PROFILE_VIEW_MODE.ORGANIZATION_VIEW;
  const isAddRepoEnable = isOrganizationView && isOrganizationAdmin && organizations.length;

  return (
    <div className="container">
      {isAddRepoEnable && (
        <OrganizationReposList
          onClose={() => setRepoListOpen(false)}
          isActive={isRepoListOpen}
        />
      )}
      <div className="has-text-centered py-50 is-flex is-flex-direction-column">
        <p className="has-text-weight-semibold is-size-5">No Repos Yet!</p>
        <p className="mt-15 mb-15">
          {!isOrganizationView ?
            <>
              <span>Make some code reviews on GitHub with the Sema Plugin installed</span>
              <br/>
              <span>and your Repos will appear here automatically.</span>
            </>
            : 'Add repos to your organization in order to start collaborating together.'
          }
        </p>
        <div className="mx-auto">
          {isAddRepoEnable && (
            <button
              type="button"
              className="button is-primary has-text-weight-semibold is-fullwidth"
              onClick={() => setRepoListOpen(true)}
            >
              Add a Repo to Organization
            </button>
          )}
          {!isOrganizationView && <a href="https://github.com" target="_blank">
            <button
              type="button"
              className="button is-primary has-text-weight-semibold is-fullwidth"
              onClick={openGithub}
            >
              Start reviewing code on GitHub
            </button>
          </a>}
        </div>
      </div>
      <HowItWorks />
    </div>
  );
};

export default EmptyRepo;
