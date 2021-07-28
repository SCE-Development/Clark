let startTime;
let endTime;
let domain;

function checkTime(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

function JSONobject() {
  return {
    'Page Name' : domain,
    'Start Time' : startTime,
    'End Time' : endTime,
    'User ID' : null,
    'SSOID' : null
  };
}

function onLoad(){
  let date = new Date();
  startTime = `${checkTime(date.getHours())}:
              +${checkTime(date.getMinutes())}:
              +${checkTime(date.getSeconds())}`;
  domain = window.location.href.split('/'); domain = domain[domain.length -1];
}

function whenClose(){
  let date = new Date();
  endTime = `${checkTime(date.getHours())}:
            +${checkTime(date.getMinutes())}:
            +${checkTime(date.getSeconds())}`;
  JSONobject();
}

function visibiltyChange(){
  if(document.visibilityState == 'hidden'){
    whenClose();
  } else{
    onLoad();
  }
}


// {
//     Page_name: string
//     Time_from: string
//     Time_until: string
//     userID: string
//     SSOID: string
//  }
