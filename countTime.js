let startTime;
let endTime;
let domain;

let whenClose = function() {
    endTime = new Date().getHours() + ':' +  new Date().getMinutes() + ':' + new Date().getSeconds();
    console.log(JSONobject());

}

window.onload = function(event){
    startTime = new Date().getHours() + ':' +  new Date().getMinutes() + ':' + new Date().getSeconds();
    domain = window.location.href.split('/');
    domain = domain[domain.length -1];
    
}


document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden"){
      whenClose();
    }
    else{
        startTime = new Date().getHours() + ':' +  new Date().getMinutes() + ':' + new Date().getSeconds();
    }
});


function JSONobject() {

    return {
        'Page Name' : domain,
        'Start Time' : startTime,
        'End Time' : endTime,
        'User ID' : null,
        'SSOID' : null
    };
}
// {
//     Page_name: string
//     Time_from: string
//     Time_until: string
//     userID: string
//     SSOID: string
//  }