// import {LambdaClient, InvokeCommand} from '@aws-sdk/client-lambda';
// const {Lambda} = require('@aws-sdk/client-lambda');

let startTime, endTime, domain;
/* eslint-disable */
async function sendData(data){
  const lambdaClient = new Lambda({
    region: 'us-west-1',
    credentials: {
      accessKeyId: 'xxx',
      secretAccessKey: 'xxxxxx'
    }
  });
  const params = {
    FunctionName: 'arn:aws:lambda:us-west-1:075245485931:function:DataShredder',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(data)
  };
  const command = new InvokeCommand(params);
  try {
    const response = await lambdaClient.send(command);
    /* eslint-disable-next-line */
    console.log(JSON.stringify(response));
  } catch (err) {
    /* eslint-disable-next-line */
    console.log(err);
  } finally {
    // ...
  }
}
/* eslint-enable */

function checkTime(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

let CoreV4Data = {
  PageName : domain,
  StartTime : startTime,
  EndTime : endTime,
  UserID : null,
  SSOID : null
};

function whenClose(){
  let date = new Date();
  /* eslint-disable-next-line */
  endTime = `${checkTime(date.getHours())}:${checkTime(date.getMinutes())}:${checkTime(date.getSeconds())}`;
  CoreV4Data = {
    PageName : domain,
    StartTime : startTime,
    EndTime : endTime,
    UserID : null,
    SSOID : null
  };
  /* eslint-disable */
  // sendData(CoreV4Data);
  console.log(JSON.stringify(CoreV4Data));
  console.log('USER TIME TERMINATED');
  /* eslint-enable */
}

export function onLoad(){
  let date = new Date();
  /* eslint-disable-next-line */
  startTime = `${checkTime(date.getHours())}:${checkTime(date.getMinutes())}:${checkTime(date.getSeconds())}`;
  domain = window.location.href.split('/'); domain = domain[domain.length -1];
  if(domain === '') {
    domain = 'home';
  }
  /* eslint-disable-next-line */
  console.log('USER TIME INITIALIZED');
}

export function visibilityChange(){
  if(document.visibilityState == 'hidden'){
    whenClose();
  } else{
    onLoad();
  }
}
