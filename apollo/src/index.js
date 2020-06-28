import auth from './auth';
import credentials from './credentials';
import users from './users';
import github from './identity/github';

function attachRoutes(app, passport) {
  auth(app, passport);
  credentials(app, passport);
  users(app, passport);
  github(app);
}

module.exports.attachRoutes = attachRoutes;
