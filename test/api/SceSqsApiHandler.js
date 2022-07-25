/* global describe it before after afterEach */

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const proxyquire = require('proxyquire');

let sqsHanlder = null;

// define a stub that we will use to mock AWS SQS's
// sendMessage function
let sqsStub = {
  sendMessage: sinon.stub()
};

// Create the replacement that proxyquire will use so
// we can stub SQS functions. Since SQS is a class, the
// constructor we return has to be the stub we created above.
let awsStub = {
  SQS: class {
    constructor() {
      return sqsStub;
    }
  }
};

// Import the class from the path it is defined in. We are
// using proxyquire instead of the default node "require"
// so we can replace the aws-sdk import with our mock
// stuff above. By doing so we can explicitly define the
// behavior of aws-sdk, specifically SQS for testing.
function getSqsApiHandler(awsStub, awsEnabled, queueName) {
  let {
    SceSqsApiHandler
  } = proxyquire(
    '../../api/peripheral_api/util/SceSqsApiHandler.js', {
      'aws-sdk': awsStub,
      '../../../api/config/config.json': {
        AWS: {
          ENABLED: awsEnabled
        }
      }
    }
  );
  return new SceSqsApiHandler(queueName);
}

describe('SceSqsApiHandler', () => {
  describe('pushMessageToQueue', () => {
    it('Should return data from SQS if successful', async () => {
      sqsStub.sendMessage.yields(false, 'hello from sqs');
      sqsHandler = getSqsApiHandler(awsStub, true, '');
      let result = await sqsHandler.pushMessageToQueue({
        name: 'mr krabs'
      });
      expect(result).to.be.eql('hello from sqs');
    });
    it('Should return error if unsuccessful', async () => {
      sqsStub.sendMessage.yields(true, 'rip');
      sqsHandler = getSqsApiHandler(awsStub, true, '');
      let result = await sqsHandler.pushMessageToQueue({});
      expect(result).to.be.false;
    });
    it('Should return true even if the config disables AWS', async () => {
      sqsStub.sendMessage.yields(false, true);
      sqsHandler = getSqsApiHandler(awsStub, false, '');
      let result = await sqsHandler.pushMessageToQueue({});
      expect(result).to.be.true;
    });
  });
});
