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
let {
  SceSqsApiHandler
} = proxyquire(
  '../../api/peripheral_api/util/SceSqsApiHandler.js', {
    'aws-sdk': awsStub
  }
);

// Import the class again, but this time mocking out the
// config.json it imports. We are doing this because
// we have logic in the pushMessageToQueue where if
// the account id or queue name has a value of NOT_SET
// we resolve true and don't bother writing to the queue.
// NOT_SET is the default value of a lot of our keys in
// config.json. We resolve true because in case someone
// is running the backend and doesn't care for SQS logic,
// we avoid uncecesarry errors.

let {
  SceSqsApiHandler: SceSqsApiHandlerWithNoKeys
} = proxyquire(
  '../../api/peripheral_api/util/SceSqsApiHandler.js', {
    'aws-sdk': awsStub,
    '../../../api/config/config.json': {
      Queue: {
        ACCOUNT_ID: 'NOT_SET'
      }
    }
  }
);

describe('SceSqsApiHandler', () => {
  describe('pushMessageToQueue', () => {
    it('Should return data from SQS if successful', async () => {
      sqsStub.sendMessage.yields(false, 'hello from sqs');
      sqsHandler = new SceSqsApiHandler();
      let result = await sqsHandler.pushMessageToQueue({
        name: 'mr krabs'
      });
      expect(result).to.be.eql('hello from sqs');
    });
    it('Should return error if unsuccessful', async () => {
      sqsStub.sendMessage.yields(true, 'rip');
      sqsHandler = new SceSqsApiHandler();
      let result = await sqsHandler.pushMessageToQueue({});
      expect(result).to.be.false;
    });
    it('Should return true even if queue url is NOT_SET', async () => {
      sqsStub.sendMessage.yields(false, 'rip');
      sqsHandler = new SceSqsApiHandler('NOT_SET');
      let result = await sqsHandler.pushMessageToQueue({});
      expect(result).to.be.true;
      sqsStub.sendMessage.yields(true, 'rip');
      result = await sqsHandler.pushMessageToQueue({});
      expect(result).to.be.true;
    });
    it('Should return true even if account ID is NOT_SET', async () => {
      sqsStub.sendMessage.yields(false, 'rip');
      sqsHandler = new SceSqsApiHandlerWithNoKeys();
      let result = await sqsHandler.pushMessageToQueue({});
      expect(result).to.be.true;
      sqsStub.sendMessage.yields(true, 'rip');
      result = await sqsHandler.pushMessageToQueue({});
      expect(result).to.be.true;
    });
  });
});
