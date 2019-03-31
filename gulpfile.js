const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const browserify = require('gulp-browserify');
const concat = require('gulp-concat');

gulp.task('minify', done => {
    gulp.src(['./public/js/main.js','public/js/init.js',  'public/js/socket.js'])
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('public/js/build'));
    done()
});

gulp.task('css', function () {
    return gulp.src(['./node_modules/materialize-css/dist/css/*.css'])
        .pipe(concat('styles.css'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('icons', function () {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'));
});