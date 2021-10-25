import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

export {
  DashboardHelmet,
  LoginHelmet,
  RegisterHelmet,
  InvitesHelmet,
  UserManagementHelmet,
  SuggestedCommentsHelmet,
  ActivityLogHelmet,
  CommentCollectionsHelmet,
  ProfileHelmet,
  RepoStatsHelmet,
  HelpSupportHelmet,
  PersonalInsightsHelmet,
  TeamCreateHelmet,
  TeamManagementHelmet,
} from './values';

const HelmetComponent = ({ title, description, children }) => (
  <Helmet>
    <title>{title}</title>
    { description && <meta name="description" content={description} /> }
    {children}
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
