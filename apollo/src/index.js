import analysis from './analysis';
import auth from './auth';
import collections from './comments/collections';
import smartComments from './comments/smartComments';
import suggestedComments from './comments/suggestedComments';
import tags from './comments/tags';
import credentials from './credentials';
import github from './identity/github';
import health from './shared/health';
import invitations from './invitations';
import organizations from './organizations';
import reports from './reports';
import repositories from './repositories';
import sources from './sources';
import users from './users';
import adminUsers from './admin/users';
import searchQueries from './admin/searchQueries';
import support from './support';

function attachRoutes(app, passport) {
  analysis(app, passport);
  auth(app, passport);
  collections(app, passport);
  smartComments(app, passport);
  suggestedComments(app, passport);
  tags(app, passport);
  credentials(app, passport);
  github(app);
  health(app);
  invitations(app, passport);
  organizations(app, passport);
  reports(app, passport);
  repositories(app, passport);
  sources(app, passport);
  users(app, passport);
  adminUsers(app, passport);
  searchQueries(app, passport);
  support(app, passport);
}

module.exports.attachRoutes = attachRoutes;
