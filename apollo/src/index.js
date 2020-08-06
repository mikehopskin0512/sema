import auth from './auth';
import credentials from './credentials';
import github from './identity/github';
import organizations from './organizations';
import reports from './reports';
import users from './users';

function attachRoutes(app, passport) {
  auth(app, passport);
  credentials(app, passport);
  github(app);
  organizations(app, passport);
  reports(app, passport);
  users(app, passport);
}

module.exports.attachRoutes = attachRoutes;
