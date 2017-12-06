const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const bundle = require('gulp-bundle-assets');
const source = require('vinyl-source-stream');
const gulpSequence = require('gulp-sequence');
const inject = require('gulp-inject');
const templateCache = require('gulp-angular-templatecache');

gulp.task('bundle', assets);
gulp.task('templates', templates);
gulp.task('injectDeeps', ['templates'], injectDeeps);

gulp.task('build',gulpSequence(['bundle', 'injectDeeps']));

const config = {
    mainJsSrc: './src/app.js',
    buildSrc: './bundle',
    componentsTemplateSrc: './src/components/**/*.html'
};

function assets(){
    return browserify(config.mainJsSrc)
        .transform(babelify.configure({
            presets : ["es2015"]
        }))
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest(config.buildSrc));
}

function injectDeeps(){
    return gulp.src('index.html')
        .pipe(inject(gulp.src([
            config.buildSrc+'/index.js',
            config.buildSrc+'/templates.js',
            config.buildSrc+'/style.css']), {relative: 'true'}))
        .pipe(gulp.dest('./'));
}

function templates(){
    return gulp.src([config.componentsTemplateSrc])
        .pipe(templateCache({module: 'templatesCache', standalone:true}))
        .pipe(gulp.dest(config.buildSrc));
}