
(function() {
	angular.module('app', []).controller("home_page", function($scope) {
		$scope.name = "user"
	 	$scope.possible_skills = ['Javascript', 'Java', 'C++', 'Python', 'Git', 'Agile Development', 'React', 'Angular', 'Node', 'Shell Scripting', 'Computer Vision', 'Ruby', 'Perl', 'PHP', 'Computer Networking']
		$scope.desired_skills = []

		$scope.toggleButton = function(event) {
			$(event.target).toggleClass('active')
			var skill = event.currentTarget.innerText
			var skill_index = $scope.desired_skills.indexOf(skill)
			if (skill_index != -1) {
				$scope.desired_skills.splice(skill_index, 1)
			} else {
				$scope.desired_skills.push(skill)
			}
		}
		$.ajax({
			url: "/getUsername",
			method: "GET",
			dataType: "json",
			success: function(response) {
				$scope.name = response.username
				$scope.$apply()
			},
			error: function(err) { 
				console.log("Error!")
			}
		})
	})
})()

