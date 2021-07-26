let startTime;
let endTime;
let domain;

let whenClose = function() {
    endTime = checkTime(new Date().getHours()) + ':' +  checkTime(new Date().getMinutes()) + ':' + checkTime(new Date().getSeconds());
    console.log(JSONobject());

}

window.onload = function(event){
    startTime =checkTime(new Date().getHours()) + ':' +  checkTime(new Date().getMinutes()) + ':' + checkTime(new Date().getSeconds());
    domain = window.location.href.split('/');
    domain = domain[domain.length -1];
    
}


document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden"){
      whenClose();
    }
    else{
        startTime = checkTime(new Date().getHours()) + ':' +  checkTime(new Date().getMinutes()) + ':' + checkTime(new Date().getSeconds());
    }
});


function JSONobject() {

    return {
        'Page Name' : domain,
        'Start Time' : startTime,
        'End Time' : endTime,
        'User ID' : null,
        'SSOID' : null,
        'Source' : 'coreV4'
    };
}

function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
// {
//     Page_name: string
//     Time_from: string
//     Time_until: string
//     userID: string
//     SSOID: string
//  }