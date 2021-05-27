import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InviteCard = ({ invitation }) => (
  <>
    <h1 className="title has-text-centered mb-20">Welcome to Sema</h1>
    <div className="is-divider is-info mx-90" />
    <h2 className="subtitle has-text-centered is-size-6 has-text-black mt-20 mb-90">
      <strong>{invitation.data.senderName}</strong> would love for you to join them.
    </h2>
    <a
      type="button"
      className="button p-25 is-info is-outlined"
      href={`/api/identities/github?token=${invitation.data.token}`}
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

export default InviteCard;
