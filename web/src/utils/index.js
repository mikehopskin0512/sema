import jwtDecode from 'jwt-decode';

export const upsert = (arr, key, newval) => {
  const match = arr.find((item) => item._id === key);
  if (match) {
    const index = arr.findIndex(arr.find((item) => item._id === key));
    arr.splice(index, 1, newval);
  } else {
    arr.push(newval);
  }

  return arr;
};

export const fullName = (user) => {
  if (!user) return '';

  const { firstName, lastName } = user;

  return `${firstName} ${lastName}`;
};

export const dummy = () => {};

export const isTokenExpired = (token) => {
  const { exp } = jwtDecode(token);
  const expirationTime = new Date(exp * 1000).getTime();
  const currentTime = new Date().getTime();
  return (currentTime > expirationTime) ? true : false;
};
