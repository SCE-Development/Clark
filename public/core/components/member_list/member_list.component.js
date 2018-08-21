//	PROJECT: 		Core-v4
// 	Name: 			R. Javier
// 	File: 			member_list.component.js
// 	Date Created: 	August 20, 2018
// 	Last Modified: 	August 20, 2018
// 	Details:
// 					This file contains the AngularJS component that provides officer administrative features
// 	Dependencies:
// 					AngularJS v1.6.x

angular.module("memberlist").component("memberlist", {
	"templateUrl": "components/member_list/member_list.template.html",	// relative to dashboard.html file
	"bindings": {
		// TBD
	},
	"controller": function ($rootScope, $scope, $http, $window) {
		var ctl = this;
		var dbgMode = true;
		var hostname = (dbgMode) ? "localhost:8080" : "sce.engr.sjsu.edu";
		var urls = {};



		// BEGIN Model Data
		// END Model Data



		// BEGIN Main Controllers
		this.$onInit = function () {
			// runs only once, when the module is fully loaded
			// var triggerElementShow = "#" + ctl.triggerShow;
			// var triggerElementHide = "#" + ctl.triggerHide;
			// console.log(`INIT member_list:`, triggerElementShow, triggerElementHide);

			// console.log(
			// 	$(triggerElementShow).parent().children()[2].childNodes,
			// 	$(triggerElementHide).parent().children()[2].childNodes[2]
			// );

			// // Bind click event listner for showing the memberlist
			// $(triggerElementShow).on("click", function() {

			// 	// On click of the button, show this element's collapsible
			// 	$(triggerElementShow).parent().children()[2].childNodes[2].collapse("show");
			// });

			// Bind click event listener for hiding the memberlist
			// $(triggerElementHide).on("click", function () {
			// 	$(triggerElementHide).parent().children()[2].childNodes[2].collapse("hide");
			// });

			// Initially hide the collapsible, if not already hidden
			// $(triggerElementShow).parent().children()[2].childNodes[2].collapse("hide");
		};
		this.$onChanges = function () {
			console.log(this.bindings);
		};
		$rootScope.$on("showMemberListComponent", function (event, args) {
			// console.log(`Showing member list...`, args);
			console.log(`Showing member list...`);

			// Show the memberlist by revealing the collapsible
			$("#" + args.memberListID + " > .collapse").collapse("show");
		});
		$rootScope.$on("hideMemberListComponent", function (event, args) {
			console.log(`Hiding member list...`);

			// Hide the memberlist by collapsing the collapsible
			$("#" + args.memberListID + " > .collapse").collapse("hide");
		});
		// END Main Controllers



		// BEGIN Utility Controllers
		// END Utility Controllers
	}
});

// END member_list.component.js
