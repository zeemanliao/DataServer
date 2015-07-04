
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    var src = ['test/lib/*.js'];
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout: 3000,
                    require: 'coverage/blanket'
                },
                src: src
            },
            DBStorage: {
                options: {
                    reporter: 'spec',
                    timeout: 3000,
                    require: 'coverage/blanket'
                },
                src: ['test/lib/DBStorage.js']
            },
            GameStorage: {
                options: {
                    reporter: 'spec',
                    timeout: 3000,
                    require: 'coverage/blanket'
                },
                src: ['test/lib/GameStorage.js']
            },
            coverage: {
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'coverage.html',
                    encoding: 'UTF-8'
                },
                src: src
            }
        },
        clean: {
            "coverage.html": {
                src: ['coverage.html']
            }
        },
        jshint: {
            all: ['lib/*']
        }
    });
    // Default task.
    grunt.registerTask('default', ['clean', 'mochaTest', 'jshint']);
};
