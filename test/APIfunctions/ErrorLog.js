process.env.NODE_ENV = 'test';
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const axios = require('axios');
import { getAllErrorLogs } from '../../src/APIFunctions/ErrorLog';
const babelCoreRegister = require("babel-core/register");
const babelPolyfill = require("babel-polyfill");

describe('ErrorLog', () => {
  let stub = null;
  const res = new Promise(
    (resolve) => resolve({ data: ERROR_LOGS })
  );

  before(done => {
    stub = sinon.stub(axios, 'get');
    stub.returns(res);
    done();
  });

  // afterEach(done => {
  //   stub.restore();
  //   done();
  // });

  const ERROR_LOGS = [
    {
      userEmail: 'fun@gmail.com',
      errorTime: new Date('01/01/2001'),
      apiEndpoint: 'san francisco',
      errorDescription: 'sce is cold'
    },
    {
      userEmail: 'fun@gmail.com',
      errorTime: new Date('01/01/2002'),
      apiEndpoint: 'san francisco',
      errorDescription: 'sce is stuffy'
    }
  ];
  const INVALID_ERROR_LOG = {
    userEmail: 'fun@gmail.com'
  };

  const VALID_ERROR_LOG = {
    userEmail: 'fun@gmail.com',
    errorTime: new Date('01/01/2001'),
    apiEndpoint: 'san francisco',
    errorDescription: 'sce is cold'
  };

    it('Should return 400 if the request is invalid', () => {
      getAllErrorLogs()
      .then(response => {
        expect(response).to.have.status(400);
        done();
      })
      .catch(err => {
        throw err;
      })
    });
  //describe('/GET getAllErrorLogs', () => {
    // it('Should return 400 when required fields are not filled in ', done => {
    //   getAllErrorLogs()
    //     .then((value) => {
    //       console.log(value);
    //     })
    //     .catch(err => {
    //       throw err;
    //     })
    //   done();
    // });
    // const res2 = new Promise(
    //   (resolve) => resolve({ data: ERROR_LOGS })
    // );
    // it('Should return statusCode 200 when all required ' +
    //   'fields are filled in ', done => {
    //     getAllErrorLogs()
    //       .then((value) => {
    //         console.log(value);
    //       })
    //       .catch(err => {
    //         throw err;
    //       })
    //       done();
    //   });
  //});
});