const PATHS = require("./config/paths");
const path = require("path");
const gulp = require("gulp");
const ts = require("gulp-typescript");
const less = require("gulp-less");
const browserify = require('gulp-browserify');
const merge = require("merge2");
const rename = require('gulp-rename');
const clean = require("gulp-clean");

const BROWSERIFY_ENTRY = path.join(PATHS.PUBLIC_JS_DIR, "index.js");
const BROWSERIFY_OUTPUT = "bundle.js";


function pathRecursive(path){
    return path + "/**/*";
}
function gulpSrcRecursive(path, opt){
    let oopt = opt || {};
    let ending = oopt["ending"] || "";
    return gulp.src(pathRecursive(path) + ending, oopt);
}


gulp.task("build:css", function() {
    return gulpSrcRecursive(PATHS.LESS_DIR)
    .pipe(less({
        paths: [PATHS.LESS_DIR]
    }))
    .pipe(gulp.dest(PATHS.CSS_DIR));
});
gulp.task("build:publicjs", function() {
    const ts_project = ts.createProject("tsconfig.json");
    let proj = gulpSrcRecursive(PATHS.PUBLIC_TS_DIR).pipe(ts_project());
    return merge([
        proj.js.pipe(gulp.dest(PATHS.PUBLIC_JS_DIR)),
        proj.dts.pipe(gulp.dest(PATHS.DEFINITIONS_DIR))
    ]);
});
gulp.task("minifyjs", ["build:publicjs"], function(){
    // Single entry point to browserify
    let browserified = gulp.src(BROWSERIFY_ENTRY)
        .pipe(browserify({
            insertGlobals : true
        }));
    // Clear the single *.js files
    //let clearjs = gulpSrcRecursive(PATHS.PUBLIC_JS_DIR, {read: false, ending: ".js"})
    //    .pipe(clean());

    // Output the bundled js file
    return merge([browserified])
        .pipe(rename(BROWSERIFY_OUTPUT))
        .pipe(gulp.dest(PATHS.PUBLIC_JS_DIR));
});
gulp.task("build:serverjs", function() {
    const ts_project = ts.createProject("tsconfig.json");
    let proj = gulpSrcRecursive(PATHS.SERVER_TS_DIR).pipe(ts_project());
    return merge([
        proj.js.pipe(gulp.dest(PATHS.SERVER_JS_DIR)),
        proj.dts.pipe(gulp.dest(PATHS.DEFINITIONS_DIR))
    ]);
});
gulp.task("build:js", ["minifyjs", "build:serverjs"]);
gulp.task("build", ["clear", "build:js", "build:css"]);


gulp.task("watch:less", function(){
    gulp.watch(pathRecursive(PATHS.LESS_DIR), ["build:css"]);
});
gulp.task("watch:publicts", function(){
    gulp.watch(pathRecursive(PATHS.PUBLIC_TS_DIR), ["minifyjs"]);
});
gulp.task("watch:serverts", function(){
    gulp.watch(pathRecursive(PATHS.SERVER_TS_DIR), ["build:serverjs"]);
});
gulp.task("watch:ts", ["watch:publicts", "watch:serverts"]);
gulp.task("watch", ["watch:ts", "watch:less"]);


gulp.task("clear:definitions", function(){
    return gulpSrcRecursive(PATHS.DEFINITIONS_DIR, {read: false}).pipe(clean());
});
gulp.task("clear:css", function(){
    return gulpSrcRecursive(PATHS.CSS_DIR, {read: false, ending: ".css"}).pipe(clean());
});
gulp.task("clear:publicjs", function(){
    return gulpSrcRecursive(PATHS.PUBLIC_JS_DIR, {read: false, ending: ".js"}).pipe(clean());
});
gulp.task("clear:serverjs", function(){
    return gulpSrcRecursive(PATHS.SERVER_JS_DIR, {read: false, ending: ".js"}).pipe(clean());
});
gulp.task("clear:js", ["clear:publicjs", "clear:serverjs"]);
gulp.task("clear", ["clear:definitions", "clear:css", "clear:js"]);


gulp.task("default", ["build", "watch"]);
