import React from 'react';
import { PlusIcon } from '@/components/Icons';
import { useRouter } from 'next/router';
import usePermission from '../../hooks/usePermission';
import { PATHS, SEMA_CORPORATE_TEAM_ID } from '../../utils/constants';

const PageHeader = () => {
  const router = useRouter();
  const { checkAccess } = usePermission();

  const goToInvitePage = () => {
    router.push(PATHS.TEAM_INVITE);
  };

  return (
    <div className="content-container px-20 mb-25">
      <p className="has-text-weight-semibold has-text-black-950 is-size-4 mb-20">
        Team management
      </p>

      <div className="is-flex is-justify-content-space-between mb-25">
        <div className="is-flex is-align-items-center">
          <img src="/img/logo.png" alt="logo" />
          <p className="has-text-weight-semibold has-text-black-950 is-size-5 ml-15">
            Sema Corporate
          </p>
        </div>
  
        {checkAccess(SEMA_CORPORATE_TEAM_ID, 'canEditUsers') && (
          <button
            className="button is-small is-primary border-radius-4px"
            type="button"
            onClick={goToInvitePage}
          >
            <PlusIcon size="small" />
            <span className="ml-10">Invite new members</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
