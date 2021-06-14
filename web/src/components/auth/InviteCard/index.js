import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

const InviteCard = ({ invitation }) => {
  const { data: { senderName = '', token } } = invitation;
  return (
    <>
      <p className="title is-size-3 has-text-weight-semibold has-text-centered has-text-black">Welcome to Sema</p>
      <div className="is-divider is-primary mx-90" />
      <p className="has-text-centered is-size-6 has-text-black mb-60 has-text-weight-medium">
        <strong>{isEmpty(senderName) ? 'Your colleague' : senderName }</strong> would love for you to join them.
      </p>
      <span className="is-size-8 has-text-gray-dark">By joining, you are agreeing to Sema’s <a href="https://semasoftware.com/terms-and-conditions/">Terms & Conditions</a></span>
      <a
        type="button"
        className="button p-25 is-primary is-outlined mt-15"
        href={`/api/identities/github?token=${token}`}
      >
        <span className="icon is-large mr-20">
          <FontAwesomeIcon
            icon={['fab', 'github']}
            size="2x"
          />
        </span>
        <span>Sign in with Github</span>
      </a>
    </>
  );
};

InviteCard.propTypes = {
  invitation: PropTypes.object.isRequired,
};

export default InviteCard;
