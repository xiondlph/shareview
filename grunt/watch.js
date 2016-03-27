module.exports = {
    scripts: {
        files: [
            'Gruntfile.js',
            'exception.js',
            'server.js',
            'app.js',
            'db.js',
            'model/**/*.js',
            'hosts/base/index.js',
            'hosts/base/controller/**/*.js',
            'hosts/base/model/**/*.js',
            'hosts/base/static/js/**/*.js'
        ],
        tasks: ['jslint'],
        options: {
            interrupt: true
        }
    },

    css: {
        files: [
            'hosts/base/static/less/**/*.less'
        ],
        tasks: ['less']
    }
};