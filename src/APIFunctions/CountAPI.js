import {LambdaClient, InvokeCommand} from '@aws-sdk/client-lambda';
const {Lambda} = require('@aws-sdk/client-lambda');

/**
 * Used to process data from APIs to count and send to skylab pipeline
 * Creates a JSON object when an API endpoint is called
 * @param {string} name the name of the API that was called
 * @param {bool} err whether the API caused an error or not
 * @param {string} ID the ID of the user that called the function
 * @returns {object} a json object containing all the relevant raw data
*/
export async function dataAPI(name, err){
  // formatting for object
  let formatDay = new Date();
  let APIdate = formatDay.getFullYear()+'-'
      +(formatDay.getMonth()+1)+'-'+formatDay.getDate();

  let APItime = formatDay.getHours() + ':'
      + formatDay.getMinutes() + ':' + formatDay.getSeconds();

  // object to be sent to the shredder
  const apiCountObj = {
    apiName: name,
    Error: err,
    date: APIdate,
    time: APItime,
    // userID: ID,
    description: name, // set to name to start
    Source: 'CountAPI'
  };

  // Accessing Lambda to send to Data Shredder
  const lambdaClient = new Lambda ({region: 'us-west-1',
    credentials: {
      accessKeyID: 'xxxxxxxxxxxxxxxxxxxx',
      secretAccessKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    }});
  const params = {
    FunctionName: 'arn:aws:lambda:us-west-1:075245485931:function:DataShredder',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(apiCountObj) // test if this is inputted correctly
  };

  const command = new InvokeCommand(params); 

  try {
    alert('try block');
    const response = await lambdaClient.send(command);
    //process data
    alert(JSON.stringify(response));
  } catch (error) {
    //error handling
    alert('error');
  } finally {
    //try block completed
    alert('finally');
  } 

  return apiCountObj; //Should anything be returned?
}

export default dataAPI;
