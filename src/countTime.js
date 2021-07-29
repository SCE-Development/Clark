let startTime;
let endTime;
let domain;

export function checkTime(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

export function JSONobject() {
  return {
    'Page Name' : domain,
    'Start Time' : startTime,
    'End Time' : endTime,
    'User ID' : null,
    'SSOID' : null
  };
}

export function whenClose(){
  let date = new Date();
  /* eslint-disable-next-line */
  endTime = `${checkTime(date.getHours())}:${checkTime(date.getMinutes())}:${checkTime(date.getSeconds())}`;
}

export function onLoad(){
  let date = new Date();
  /* eslint-disable-next-line */
  startTime = `${checkTime(date.getHours())}:${checkTime(date.getMinutes())}:${checkTime(date.getSeconds())}`;
  domain = window.location.href.split('/'); domain = domain[domain.length -1];
}

export function visibiltyChange(){
  if(document.visibilityState == 'hidden'){
    alert('Closed');
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
