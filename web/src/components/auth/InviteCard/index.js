import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { PATHS } from '../../../utils/constants';

const InviteCard = ({ invitation }) => {
  const { data: { senderName = '', token } } = invitation;
  return (
    <>
      <p className="title is-size-3 has-text-weight-semibold has-text-centered has-text-black">Welcome to Sema</p>
      <div className="is-divider is-primary mx-90" />
      <p className="has-text-centered is-size-6 has-text-black mb-60 has-text-weight-medium">
        <strong>{isEmpty(senderName) ? 'Your colleague' : senderName }</strong> would love for you to join them.
      </p>
      <div>
        <span className="is-size-8 has-text-gray-500">By joining, you are agreeing to Sema’s <a href="https://www.semasoftware.com/legal/terms-conditions">Terms & Conditions</a></span>
      </div>
      <a
        type="button"
        className="button p-25 is-primary is-outlined mt-15"
        href={`${PATHS.IDENTITIES}?token=${token}`}
      >
        <span className="icon is-large mr-20">
          <FontAwesomeIcon
            icon={['fab', 'github']}
            size="2x"
          />
        </span>
        <span>Sign in with GitHub</span>
      </a>
    </>
  );
};

InviteCard.propTypes = {
  invitation: PropTypes.object.isRequired,
};

export default InviteCard;
