import axios from 'axios';

// const isBrowser = typeof window !== 'undefined';
const baseUrl = process !== 'undefined' ? process.env.BASE_URL : null;

const api = (function () {
  const _get = function (url, data, token) {
    const payload = {
      method: 'get',
      params: data,
      url: baseUrl + url,
    };

    if (token) {
      payload.headers = {
        Authorization: `Bearer ${token}`,
        Pragma: 'no-cache',
      };
    }

    return new Promise(function GETPromise(resolve, reject) {
      axios(payload)
        .then(function(resp) {
          resolve(resp.data);
        })
        .catch(function(errResp) {
          reject(errResp);
        });
    });
  };

  const _post = function (url, data, token) {
    const payload = {
      method: 'post',
      data,
      url: baseUrl + url,
    };
    if (token) {
      payload.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    return new Promise(function POSTPromise(resolve, reject) {
      axios(payload)
        .then(function(resp) {
          resolve(resp.data);
        })
        .catch(function(errResp) {
          reject(errResp);
        });
    });
  };

  const _put = function (url, data, token) {
    const payload = {
      method: 'put',
      data,
      url: baseUrl + url,
    };
    if (token) {
      payload.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    return new Promise(function PUTPromise(resolve, reject) {
      axios(payload)
        .then(function(resp) {
          resolve(resp.data)
        })
        .catch(function(errResp) {
          reject(errResp)
        });
    });
  };

  const _delete = function (url, data, token) {
    const payload = {
      method: 'delete',
      data,
      url: baseUrl + url,
    };

    if (token) {
      payload.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    return new Promise(function DELETEPromise(resolve, reject) {
      axios(payload)
        .then(function (resp) {
          resolve(resp.data);
        })
        .catch(function (errResp) {
          reject(errResp);
        });
    });
  };

  return {
    get: _get,
    post: _post,
    put: _put,
    delete: _delete,
  };
}());

export default api;
