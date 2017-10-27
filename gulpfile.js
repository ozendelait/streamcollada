const PATHS = require("./config/paths");
const gulp = require("gulp");
const ts = require("gulp-typescript");
const less = require("gulp-less");
const browserify = require('gulp-browserify');
const merge = require("merge2");
const rename = require('gulp-rename');
const clean = require("gulp-clean");

const ts_project = ts.createProject("tsconfig.json");

gulp.task("typescript", function() {
    let proj = ts_project.src().pipe(ts_project());
    return merge([
        proj.js.pipe(gulp.dest(PATHS.JS_DIR)),
        proj.dts.pipe(gulp.dest(PATHS.DEFINITIONS_DIR))
    ]);
});

/*
gulp.task("watch", function(){
    gulp.watch(ts_project.src(), ["typescript", "browserify"]);
});

gulp.task('browserify', function(){
    // Single entry point to browserify
    gulp.src(path.join(TS_DEST_DIR, "index.js"))
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(rename("bundle.js"))
        .pipe(gulp.dest("."));
});
*/

// Clear compiled css and js files
gulp.task("clear", function(){
   return merge([
       gulp.src(PATHS.DEFINITIONS_DIR + "/**/*", {read: false}),
       gulp.src(PATHS.CSS_DIR + "/**/*", {read: false}),
       gulp.src(PATHS.JS_DIR + "/**/*", {read: false})
   ]).pipe(clean());
});

gulp.task('less', function () {
    return gulp.src(PATHS.LESS_DIR + "/**/*")
        .pipe(less({
            paths: [PATHS.LESS_DIR]
        }))
        .pipe(gulp.dest(PATHS.CSS_DIR));
});

//gulp.task("default", ["typescript", "browserify"]);