import crypto from 'crypto';

export const handle = (promise) => promise
  .then((data) => ([data, undefined]))
  .catch((error) => Promise.resolve([undefined, error]));

export const delay = async (ms) => {
  // return await for better async stack trace support in case of errors.
  await new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateToken = () => new Promise((resolve, reject) => {
  crypto.randomBytes(20, (ex, buffer) => {
    if (ex) {
      reject();
    }
    const token = crypto
      .createHash('sha1')
      .update(buffer)
      .digest('hex');
    resolve(token);
  });
});
