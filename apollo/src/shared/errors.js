const util = require('util');
const HTTPStatus = require('http-status');

function HTTPError(...args) {
  Error.call(this, args);
}

util.inherits(HTTPError, Error);

function buildError(obj, message, code) {
  HTTPError.call(obj);
  /* eslint-disable no-param-reassign */
  obj.statusCode = code;
  obj.message = message.message || message;
  obj.name = HTTPStatus[obj.statusCode];
  if (message.stack) obj.stack = message.stack;
  /* eslint-enable no-param-reassign */
}

function BadRequest(message) {
  buildError(this, message, 400);
}

function Unauthorized(message) {
  buildError(this, message, 401);
}

function Forbidden(message) {
  buildError(this, message, 403);
}

function NotFound(message) {
  buildError(this, message, 404);
}

function Conflict(message) {
  buildError(this, message, 409);
}

function UnprocessableEntity(message) {
  buildError(this, message, 422);
}

function InternalServer(err) {
  buildError(this, err || 'Undefined error', err.status || 500);
}

util.inherits(NotFound, HTTPError);
util.inherits(UnprocessableEntity, HTTPError);
util.inherits(InternalServer, HTTPError);
util.inherits(Unauthorized, HTTPError);
util.inherits(Forbidden, HTTPError);
util.inherits(BadRequest, HTTPError);
util.inherits(Conflict, HTTPError);

module.exports = {
  HTTPError,
  InternalServer,
  Unauthorized,
  Forbidden,
  BadRequest,
  NotFound,
  UnprocessableEntity,
  Conflict,
};
