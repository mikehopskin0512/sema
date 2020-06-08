// This is a proxy function for the individual route handler files.
import credentials from './credentialService';
import users from './userService';

function attachRoutes(app, passport) {
  credentials(app, passport);
  users(app, passport);
}

module.exports.attachRoutes = attachRoutes;
