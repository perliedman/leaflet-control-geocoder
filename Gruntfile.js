module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			control: {
				src: ['src/control.js'],
				dest: 'dist/leaflet-control-geocoder.js',
				options: {
					browserifyOptions: {
						standalone: 'L.Control.Geocoder'
					}
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
			},
			build: {
				src: 'dist/leaflet-control-geocoder.js',
				dest: 'dist/leaflet-control-geocoder.min.js'
			}
		},
		copy: {
			vendor: {
				cwd: 'css',
				src: ['**'],
				dest: 'dist/',
				expand: true
			}
		},
		'gh-pages': {
			options: {
				add: true
			},
			src: ['dist/**']
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.registerTask('default', ['browserify', 'uglify', 'copy']);
};
