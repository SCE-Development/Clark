//	PROJECT: 		Core-v4
// 	Name: 			R. Javier
// 	File: 			officer_tools.component.js
// 	Date Created: 	May 3, 2018
// 	Last Modified: 	May 3, 2018
// 	Details:
// 					This file contains the AngularJS component that provides officer administrative features
// 	Dependencies:
// 					AngularJS v1.6.x

angular.module("officertools").component("officertools", {
	"templateUrl": "components/officer_tools/officer_tools.template.html",	// relative to dashboard.html file
	"bindings": {
		"currentuser": "<currentuser"
	},
	"controller": function ($http) {
		var ctl = this;
		var dbgMode = true;
		var hostname = (dbgMode) ? "localhost:8080" : "sce.engr.sjsu.edu";
		var urls = {
		};



		// BEGIN Model Data
		// END Model Data



		// BEGIN Main Controllers
		this.$onInit = function () {
			ctl.loadData();
		};
		this.$onChanges = function () {
			ctl.loadData();
		};
		this.loadData = function () {
			console.log(`Officer Tools Current User: ${ctl.currentuser}`);
		};
	}
});

// END officer_tools.component.js