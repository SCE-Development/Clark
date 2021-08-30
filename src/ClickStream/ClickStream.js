import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } =
  require('../config/config.json');
const {Lambda} = require('@aws-sdk/client-lambda');

async function passClick(clickData){
  // alert(clickData);
  const lambdaClient = new Lambda({region: 'us-west-1',
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }});
  const params = {
    FunctionName: 'arn:aws:lambda:us-west-1:075245485931:function:DataShredder',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(clickData)
  };
  const command = new InvokeCommand(params);
  // async/await.
  try {
    // alert('try block');
    const response = await lambdaClient.send(command);
    // process data.
    // alert(JSON.stringify(response));
  } catch (error) {
    // error handling.
    alert('error');
  } finally {
    // finally.
  }
}
export default passClick;
