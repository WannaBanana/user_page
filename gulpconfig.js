var dir = {
        src: './source',
        dest: './public'
    },
    paths = {
        style: {
            src: dir.src + '/**/*.css'
        },
        script: {
            src: dir.src + '/**/*.js'
        },
        img: {
            src: dir.src + '/**/*'
        },
        html: {
            src: dir.src + '/**/*.html'
        }
    };

module.exports = {
    dir,
    paths
}