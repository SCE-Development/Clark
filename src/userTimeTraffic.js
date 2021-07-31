const aws = require('aws-sdk');
let startTime;
let endTime;
let domain;

function checkTime(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

export function JSONobject() {
  return {
    PageName : domain,
    StartTime : startTime,
    EndTime : endTime,
    UserID : null,
    SSOID : null
  };
}

function whenClose(){
  let date = new Date();
  /* eslint-disable-next-line */
  endTime = `${checkTime(date.getHours())}:${checkTime(date.getMinutes())}:${checkTime(date.getSeconds())}`;
  /* eslint-disable-next-line */
  console.log(JSON.stringify(JSONobject()));
}

export function onLoad(){
  let date = new Date();
  /* eslint-disable-next-line */
  startTime = `${checkTime(date.getHours())}:${checkTime(date.getMinutes())}:${checkTime(date.getSeconds())}`;
  domain = window.location.href.split('/'); domain = domain[domain.length -1];
}

export function visibiltyChange(){
  if(document.visibilityState == 'hidden'){
    /* eslint-disable-next-line */
    console.log('Closed');
    whenClose();
  } else{
    onLoad();
  }
}


// {
//     Page_name: string,
//     Time_from: string,
//     Time_until: string,
//     userID: string,
//     SSOID: string
//  }
