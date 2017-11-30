//This file automatically reloads the page when a change is made in specific files.
//To use it, install the Grunt CLI then run 'grunt' in the root directory of this project.
//Files being watched for changes can be seen in 'watch.all.files' below.

module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			all: {
				options: { livereload: true },
				files: ['public/index.html', 'public/css/main.css', 'public/js/index.js']
			}
		}
	})
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.registerTask('default', ["watch"]);
}