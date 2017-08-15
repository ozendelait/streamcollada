let path = require("path");
let gulp = require("gulp");
let ts = require("gulp-typescript");
let browserify = require('gulp-browserify');
let merge = require("merge2");
let rename = require('gulp-rename');


let ts_server_config = ts.createProject("tsconfig.json");
let ts_public_config = ts.createProject("tsconfig.json");
const TS_SERVER_SRC = "src/**/*.ts";
const TS_SERVER_DEST = "build/";
const TS_PUBLIC_SRC = "public/src/**/*.ts";
const TS_PUBLIC_DEST = "build/js/";

gulp.task("typescript", () => {
    let ts_server = gulp.src(TS_SERVER_SRC).pipe(ts_server_config());
    let ts_public = gulp.src(TS_PUBLIC_SRC).pipe(ts_public_config());

    return merge([
        ts_server.dts.pipe(gulp.dest(path.join(TS_SERVER_DEST, "definitions"))),
        ts_server.js.pipe(gulp.dest(TS_SERVER_DEST)),
        ts_public.js.pipe(gulp.dest(TS_PUBLIC_DEST))
    ]);
});

gulp.task("watch", () => {
    gulp.watch("./src/**/*.ts", ["typescript"]);
});

gulp.task('browserify', function() {
    // Single entry point to browserify
    gulp.src('build/js/index.js')
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(rename("bundle.js"))
        .pipe(gulp.dest('public/js'));
});

gulp.task("default", ["typescript"]);