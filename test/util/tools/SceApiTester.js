process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

/**
 * Handles any POST and GET request made during API testing.
 */
class SceApiTester{
  constructor(app){
    this.app = app;
  }

  /**
   * Creates a chai POST request to test an API route.
   * @param {String} endpoint contains the path of the route being tested.
   * @param {Object} params the parameters specified for the test.
   * @returns {Promise} the outcome of the API call.
   */
  async sendPostRequest(endpoint, params){
    let response = null;
    await chai
      .request(this.app)
      .post(endpoint)
      .send(params)
      .then(function(res) {
        response = res;
      })
      .catch(err =>{
        throw err;
      });
    return response;
  }

  /**
   * Creates a chai POST request with an access token to test an API route.
   * @param {Object} token the access token for the API call
   * @param {String} endpoint contains the path of the route being tested.
   * @param {Object} params the parameters specified for the test.
   * @returns {Promise} the outcome of the API call.
   */
  async sendPostRequestWithToken(token, endpoint, params){
    let response = null;
    await chai
      .request(this.app)
      .post(endpoint)
      .send({ token, ...params })
      .then(function(res) {
        response = res;
      })
      .catch(err =>{
        throw err;
      });
    return response;
  }

  /**
   * Creates a chai GET request to test an API route.
   * @param {String} endpoint contains the path of the route being tested.
   * @returns {Promise} the outcome of the API call.
   */
  async sendGetRequest(endpoint){
    let response = null;
    await chai
      .request(this.app)
      .get(endpoint)
      .then(function(res) {
        response = res;
      })
      .catch(err =>{
        throw err;
      });
    return response;
  }

  async sendGetRequestWithToken(token, endpoint) {
    let response = null;
    await chai
      .request(this.app)
      .get(endpoint)
      .send({token : token})
      .then(function(res) {
        response = res;
      })
      .catch(err =>{
        throw err;
      });
    return response;
  }
}

module.exports = SceApiTester;
