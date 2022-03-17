import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({ color, label }) => (
  <div
    className={`py-5 px-20 is-whitespace-nowrap has-text-centered has-text-${color}-dark has-background-${color}-light`}
    style={{ display: 'inline-block', borderRadius: 20 }}
  >
    {label}
  </div>
);

Badge.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Badge;
