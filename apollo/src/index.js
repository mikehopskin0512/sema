// This is a proxy function for the individual route handler files.
import auth from './auth';
import credentials from './credentials';
import users from './users';

function attachRoutes(app, passport) {
  auth(app, passport);
  credentials(app, passport);
  users(app, passport);
}

module.exports.attachRoutes = attachRoutes;
