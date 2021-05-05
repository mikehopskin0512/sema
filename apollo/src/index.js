import analysis from './analysis';
import auth from './auth';
import smartComments from './comments/smartComments';
import suggestedComments from './comments/suggestedComments';
import credentials from './credentials';
import github from './identity/github';
import health from './shared/health';
import invitations from './invitations';
import organizations from './organizations';
import reports from './reports';
import repositories from './repositories';
import sources from './sources';
import users from './users';

function attachRoutes(app, passport) {
  analysis(app, passport);
  auth(app, passport);
  smartComments(app, passport);
  suggestedComments(app, passport);
  credentials(app, passport);
  github(app);
  health(app);
  invitations(app, passport);
  organizations(app, passport);
  reports(app, passport);
  repositories(app, passport);
  sources(app, passport);
  users(app, passport);

}

module.exports.attachRoutes = attachRoutes;
