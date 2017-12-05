var app = angular.module('skillshare', []).controller("MyController", MyController)
                                .controller("My2ndController", My2ndController);
                                //.controller('My3rdController', My3rdController);
                            

  //= {{MyController.name}}
    //    {{MyController.username}}
        
function MyController($scope) {
  
    $scope.name = "Pranav"; // Make this equal to whatever you want to display as the name of the person.
    $scope.username = "Username"; // Make this equal to whatever you want to display as the username of the person.
}

function My2ndController($scope) {
    /*
    var x = 20;
    var array = [20];
    var y = "";
    y = document.getElementById("#skill");
    //var b = myUL;
      
        for (var i = array.length - 1; i >= 0; i--) {
            array[i]
        }

        array.push(value);
        console.log(array);
        
    //array.push(y);
    */

    //console.log(array);

    app.controller("My2ndController", function($scope, $http) {
        $http.post("/skillmatch").then(function(request) {
            $scope.skills = [];
            $scope.classes = [];
            }, function(response) {
           //Second function handles error
                $scope.skills = "Something went wrong";
            });
    });
       
    $("#myUL").click(function(){    
     
        alert("Clicked!");      
 
    })

}
 
function My3rdController($scope) { 
    //the ng-controller for this is hooked up to the div of the results section. 
       
    app.controller("My3rdController", function($scope, $http) {
        $http.post("/skillmatch").then(function(request) {    
            $scope.first_name = response.data;
            $scope.last_name = response.data;
            $scope.username = response.data;    
            $scope.skills = response.data;
            $scope.classes = response.data;
            $scope.major = response.data;
            //Match score is missing;
            $scope.grad = response.data;
            
            }, function(response) {
           //Second function handles error
                $scope.skills = "Something went wrong";
            });
    });
}   

if(typeof jQuery == "undefined"){
    
    alert("Contact Pranav!");
    
}
else{
    
    alert("Welcome to SkillShare!");    
    
}






/*
document.getElementById("skill").onclick = function() {
    alert("Clicked!");
}   

document.getElementById("skill").onclick function(){

    var a = document.getElementsByTagName("li");
    console.log(a);
    //document.getElementById("wow").innerHTML = a;


}


$("ul").innerHTML(function(){
    
});
*/

/*

    KEEP A COPY:
     <li> <a id="skill" href="#">EE97/EE98</a> </li>
                <li> <a id="skill" href="#">CMPE30</a> </li>
                <li> <a id="skill" href="#">CMPE50</a> </li>
                <li> <a id="skill" href="#">CMPE102</a> </li>
                <li> <a id="skill" href="#">CMPE110</a> </li>
                <li> <a id="skill" href="#">CMPE124</a> </li>
                <li> <a id="skill" href="#">CMPE125</a> </li>
                <li> <a id="skill" href="#">CMPE126</a> </li>
                <li> <a id="skill" href="#">CMPE130</a> </li>
                <li> <a id="skill" href="#">CMPE131</a> </li>
                <li> <a id="skill" href="#">CMPE140</a> </li>
                <li> <a id="skill" href="#">CMPE142</a> </li>
                <li> <a id="skill" href="#">CMPE148</a> </li>
                <li> <a id="skill" href="#">CMPE195A</a> </li>
                <li> <a id="skill" href="#">CMPE195B</a> </li>
                <li> <a id="skill" href="#">Javascript</a> </li> 
                <li> <a id="skill" href="#">Java</a> </li> 
                <li> <a id="skill" href="#">C++</a> </li> 
                <li> <a id="skill" href="#">Python</a> </li> 
                <li> <a id="skill" href="#">Git</a> </li> 
                <li> <a id="skill" href="#">Agile Development</a> </li> 
                <li> <a id="skill" href="#">React</a> </li> 
                <li> <a id="skill" href="#">Angular</a> </li> 
                <li> <a id="skill" href="#">Node</a> </li> 
                <li> <a id="skill" href="#">Shell Scripting</a> </li> 
                <li> <a id="skill" href="#">Computer Vision</a> </li> 
                <li> <a id="skill" href="#">Ruby</a> </li> 
                <li> <a id="skill" href="#">Perl</a> </li> 
                <li> <a id="skill" href="#">PHP</a> </li> 
                <li> <a id="skill" href="#">Computer Networking</a> </li> 


*/

/*
function myFunction(){

    var input, filter, ul, li, a, i;
    input = document.getElementById('myInput');



}
*/
/*
function myFunction() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = $('#myInput').val();
    filter = input.toUpperCase();
    ul = $("#myUL");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}


*/