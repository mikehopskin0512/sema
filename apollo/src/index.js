import auth from './auth';
import credentials from './credentials';
import organizations from './organizations';
import reports from './reports';
import users from './users';
import github from './identity/github';

function attachRoutes(app, passport) {
  auth(app, passport);
  credentials(app, passport);
  organizations(app, passport);
  reports(app, passport);
  users(app, passport);
  github(app);
}

module.exports.attachRoutes = attachRoutes;
