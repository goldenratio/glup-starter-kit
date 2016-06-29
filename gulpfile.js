var gulp = require("gulp"),
    clean = require('gulp-clean'),
    es = require('event-stream'),
    concat = require("gulp-concat"),
    path = require('path'),
    jshint = require('gulp-jshint');

const BIN_DIR = "bin";
const TARGET_DIR = "target";
const RES_DIR = "res";


gulp.task("default", ["package"]);

gulp.task("package", ["clean", "compile-copy"]);


gulp.task("concat-and-validate-js", ["clean"], function() {

    return gulp.src("res/js/*.js-builder")
        .pipe(es.mapSync(function (file) {

            var contents = JSON.parse(file.contents.toString("utf8"));

            var destinationJSFileName = path.basename(file.path);
            destinationJSFileName = "js/" + destinationJSFileName.split(".js-builder").join(".js");

            var sourceList = contents["files"];
            if(sourceList)
            {
                gulp.src(sourceList)
                    .pipe(concat(destinationJSFileName))
                    .pipe(jshint('.jshintrc'))
                    .pipe(jshint.reporter('default'))
                    .pipe(gulp.dest(BIN_DIR));
            }
            else
            {
                console.error("error! in js-builder file " + destinationJSFileName);
            }
        }));
});


gulp.task("copy-res-and-bin", ["concat-and-validate-js"], function() {

    return gulp.src([RES_DIR + "/**/*.*", "!" + RES_DIR + "/**/*.js-builder", BIN_DIR + "/**/*.*"])
        .pipe(gulp.dest(TARGET_DIR));

});


gulp.task("compile-copy", ["concat-and-validate-js"], function() {
    gulp.start("copy-res-and-bin");
});



gulp.task("clean", function() {
    return gulp.src([BIN_DIR, TARGET_DIR], {read: false})
        .pipe(clean());
});