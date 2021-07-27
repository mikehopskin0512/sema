import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export {
  DashboardHelmet,
  LoginHelmet,
  RegisterHelmet,
  InvitesHelmet,
  UserManagementHelmet,
  ProfileHelmet,
  SuggestedCommentsHelmet,
} from './values';

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
