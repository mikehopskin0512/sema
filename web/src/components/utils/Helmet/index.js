import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const HelmetComponent = ({ title, description }) => (
  <Helmet>
    <title>{title}</title>
    { description && <meta name="description" content={description} /> }
  </Helmet>
);

HelmetComponent.defaultProps = {
  description: null,
};

HelmetComponent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default HelmetComponent;
