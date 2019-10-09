'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		openui5_preload: {
			component: {
				options: {
					resources: {
						cwd: 'webapp',
						prefix: 'TechSite',
						src: [
							'**/*.js',
							'**/*.fragment.html',
							'**/*.fragment.json',
							'**/*.fragment.xml',
							'**/*.view.html',
							'**/*.view.json',
							'**/*.view.xml',
							'**/*.properties',
							'manifest.json',
							'!test/**'
						]
					},
					dest: './dist/webapp'
				},
				components: true
			}
		},
		clean : {
			dist : './dist/'
		},
		copy: {
			main: {
			  files: [
				// includes files within path
				{expand: true, cwd: './webapp/', src:['**'], dest: './dist/webapp'},
				{expand: true, cwd: './', src:['index.html','sw.js','favicon.ico'], dest: './dist/'}

			  ],
			},
		  },

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('build', ['clean:dist', 'openui5_preload', 'copy']);
	grunt.registerTask('default', ['clean', 'build']);

};
