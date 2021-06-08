import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({ color, label }) => (
  <div
    className={`is-inline-block py-5 px-20 has-text-centered has-text-${color}-dark has-background-${color}-light`}
    style={{ borderRadius: 20 }}
  >
    {label}
  </div>
);

Badge.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Badge;
