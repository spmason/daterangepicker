module.exports = function(config) {
    config.set({

        browsers: ['PhantomJS'],
        frameworks: ['mocha'],

        files: [
            require.resolve('expectations'),
            // all files ending in "_test"
            'test/*.tests.js'
            // each file acts as entry point for the webpack configuration
        ],

        preprocessors: {
            // add webpack as preprocessor
            'test/*.tests.js': ['webpack'],
            'test/**/*.tests.js': ['webpack']
        },

        mocha: {
            // change Karma's debug.html to the mocha web reporter
            reporter: 'html',

            // require specific files after Mocha is initialized
            require: [require.resolve('expectations')]
        },

        webpack: {
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i.e.
            noInfo: true,
            // and use stats to turn off verbose output
            stats: {
                // options i.e.
                chunks: false
            }
        },

        plugins: [
            require("karma-webpack"),
            'karma-mocha',
            'karma-phantomjs-launcher'
        ],
        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: true
        }

    });
};
