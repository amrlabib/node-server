const axios = require('axios');
const Log = require('./log.js');
const config = require('../config');

class Request {
  static call(url, method, reqHeaders, data) {
    const headers = {
      ...config.requestHeaders,
      ...reqHeaders,
    };

    const reqObj = {
      method,
      url,
      headers,
      data,
    };

    Log.data('Sending Request with data:');
    Log.data(reqObj);

    return axios(reqObj)
      .then(res =>
        // Apply any data global data formatting here
        Promise.resolve(res.data))
      .catch((error) => {
        const responseError = new Error();
        responseError.code = 500;
        responseError.message = 'Something went wrong';

        if (error.response) {
          const errMessage = error.response.data.message;
          responseError.code = error.response.status;
          if (errMessage) {
            responseError.message = errMessage;
          }
        } else if (error.request) {
          // console.log(error.request);
        } else if (error.message) {
          responseError.message = error.message;
        }
        return Promise.reject(responseError);
      });
  }

  static get(url, reqHeader) {
    return Request.call(url, 'GET', reqHeader);
  }

  static post(url, reqBody, reqHeader) {
    return Request.call(url, 'POST', reqHeader, reqBody);
  }

  static put(url, reqBody, reqHeader) {
    return Request.call(url, 'PUT', reqHeader, reqBody);
  }

  static delete(url, reqHeader) {
    return Request.call(url, 'DELETE', reqHeader);
  }

  static sendResponse(res, data, error) {
    const finalResponse = {
      status: 'success',
      message: '',
      data: data || {},
    };

    if (error) {
      finalResponse.status = 'error';
      finalResponse.message = error.message;
      res.status(error.code || 500).send(finalResponse);
    } else {
      Log.success(finalResponse);
      res.send(finalResponse);
    }
  }
}

module.exports = Request;
