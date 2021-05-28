import React from 'react';

const WaitlistCard = () => (
  <>
    <div className="pb-80">
      <p className="title is-size-3 has-text-weight-semibold has-text-centered has-text-black">You&apos;re on the list!</p>
      <div className="is-divider is-primary mx-90" />
      <p className="has-text-centered is-size-6 has-text-black mb-50 has-text-weight-medium">
        Thanks for your interest. We&apos;ve added you on the list. We&apos;ll
        email as soon as a slot opens up in the private beta
      </p>
    </div>
    <p className="is-size-6 has-text-black-bis has-text-weight-semibold has-text-centered mb-10">
      Skip the line
    </p>
    <p className="has-text-centered is-size-6 has-text-black mb-50 has-text-weight-medium">
      A few people have the ability to invite others.
      <p>
        Keep an eye out for our early testers.
      </p>
    </p>
  </>
);

export default WaitlistCard;
