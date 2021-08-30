import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
const {Lambda} = require('@aws-sdk/client-lambda');

async function passClick(clickData){
  // alert(clickData);
  const lambdaClient = new Lambda({region: 'us-west-1',
    credentials: {
      accessKeyId: 'nothing to see here',
      secretAccessKey: 'also nothing to see here'
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
