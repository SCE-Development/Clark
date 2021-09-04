import {getUserID} from './APIFunctions/User.js';
const {LambdaClient, InvokeCommand} = require('@aws-sdk/client-lambda');
const {Lambda} = require('@aws-sdk/client-lambda');
const credentials = require('./config/config.json');

let startTime, endTime, domain, userID, SSOID;

async function sendData(data){
  const lambdaClient = new Lambda({
    region: 'us-west-1',
    credentials: {
      accessKeyId: credentials.aws_access_key_id,
      secretAccessKey: credentials.aws_secret_access_key
    }
  });

  const params = {
    FunctionName: credentials.aws_function_name,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(data)
  };

  const command = new InvokeCommand(params);
  try {
    const response = await lambdaClient.send(command);
    /* eslint-disable-next-line */
    // console.log(JSON.stringify(response));
  } catch (err) {
    /* eslint-disable-next-line */
    console.log(err);
  }
}


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
  UserID : userID,
  SSOID : SSOID,
  Source: 'Core-v4'
};

function whenClose(){
  let date = new Date();
  /* eslint-disable-next-line */
  endTime = `${checkTime(date.getHours())}:${checkTime(date.getMinutes())}:${checkTime(date.getSeconds())}`;
  CoreV4Data = {
    PageName : domain,
    StartTime : startTime,
    EndTime : endTime,
    UserID : userID,
    SSOID : SSOID,
    Source: 'Core-v4'
  };
  sendData(CoreV4Data);
}

export function onLoad(){
  let date = new Date();
  /* eslint-disable-next-line */
  startTime = `${checkTime(date.getHours())}:${checkTime(date.getMinutes())}:${checkTime(date.getSeconds())}`;
  domain = window.location.href.split('/'); domain = domain[domain.length -1];
  if(domain === '') {
    domain = 'home';
  }
}

export function visibilityChange() {
  if(document.visibilityState == 'hidden'){
    whenClose();
  } else{
    onLoad();
  }
}
/* eslint-disable-next-line */
export async function getUserID_SSOID(param) {
  userID = await getUserID(param.user.email);
  if(userID.error){
    userID = null;
  } else{
    userID = userID.responseData.userID;
  }
  SSOID = param.user.token;
}
