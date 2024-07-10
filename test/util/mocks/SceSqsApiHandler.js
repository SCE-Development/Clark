const sinon = require('sinon');
const { SceSqsApiHandler } = require(
  '../../../api/main_endpoints/util/SceSqsApiHandler.js');


let sqsHandlerConstructorMock = null;
let pushMessageToQueueMock = null;
/**
   * Initialize the stub to be used
   */
function initializeSqsMock() {
  sqsHandlerConstructorMock = sinon.stub(SceSqsApiHandler.prototype,
    'constructor').returnsThis();
  pushMessageToQueueMock = sinon.stub(SceSqsApiHandler.prototype,
    'pushMessageToQueue');
}

/**
 * Restore sinon's stub, function returned to its original state
 */
function restoreSqsMock() {
  sqsHandlerConstructorMock.restore();
  pushMessageToQueueMock.restore();
}

/**
 * Reset sinon-stub's call, reset onCall-function back to the beginning
 */
function resetSqsMock() {
  sqsHandlerConstructorMock.reset();
  pushMessageToQueueMock.reset();
}

/**
 * Set the values
 * @param {Boolean} returnValue: value to be return back
 *                           by the function 'pushMessageToQueue'
 */
function setSqsResponse(returnValue) {
  pushMessageToQueueMock.resolves(returnValue);
}

module.exports = {
  initializeSqsMock,
  restoreSqsMock,
  resetSqsMock,
  setSqsResponse
};
