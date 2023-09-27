var gulp = require("gulp");
var scss = require("gulp-sass")(require("sass"));
var sourcemaps = require("gulp-sourcemaps");
var browserSync = require("browser-sync").create();
var fileinclude = require("gulp-file-include");
var del = require("del");

// build directory clear
gulp.task("clean", async function () {
  return new Promise((resolve) => {
    del.sync("dist");
    resolve();
  });
});

// scss to css
gulp.task("scssCompile", function () {
  var options = {
    outputStyle: "expanded", // nested(deprecated), compact, expanded, compressed
    indentType: "space", // space, tab
    precision: 8,
    sourceComments: true // 주석제거 여부
  };
  return new Promise((resolve) => {
    gulp
      .src("src/assets/css/*.scss")
      .pipe(sourcemaps.init())
      .pipe(scss(options))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("dist/assets/css"))
      .pipe(browserSync.reload({ stream: true }));
    resolve();
  });
});

// image copy
gulp.task("imagesCopy", function () {
  return new Promise((resolve) => {
    gulp.src("src/assets/images/**/*.*").pipe(gulp.dest("dist/assets/images"));
    resolve();
  });
});

// file copy
gulp.task("filesCopy", function () {
  return new Promise((resolve) => {
    gulp.src("src/assets/files/**/*.*").pipe(gulp.dest("dist/assets/files"));
    resolve();
  });
});

// script copy
gulp.task("scriptCopy", function () {
  return new Promise((resolve) => {
    gulp.src("src/assets/js/**/*.*").pipe(gulp.dest("dist/assets/js"));
    resolve();
  });
});

// html
gulp.task("htmlIndex", function () {
  return new Promise((resolve) => {
    gulp
      .src("src/views/*.html")
      .pipe(gulp.dest("dist"))
      .pipe(
        browserSync.reload({
          stream: true
        })
      );
    resolve();
  });
});
gulp.task("html", function () {
  return new Promise((resolve) => {
    gulp
      .src("src/views/**/*.html")
      .pipe(gulp.dest("dist"))
      .pipe(
        browserSync.reload({
          stream: true
        })
      );
    resolve();
  });
});

// file include
gulp.task("fileinclude", function () {
  return new Promise((resolve) => {
    gulp
      .src(["src/views/**/*.html", "src/views/common"])
      .pipe(fileinclude({ prefix: "@@", basepath: "@file" }))
      .pipe(gulp.dest("dist"));
    resolve();
  });
});

// watch file change
gulp.task("watch", function () {
  return new Promise((resolve) => {
    gulp
      .watch("src/views/*")
      .on("change", gulp.series("htmlIndex", "fileinclude"));
    gulp
      .watch("src/views/**/*.html")
      .on(
        "change",
        gulp.series("html", "scssCompile", "fileinclude", "scriptCopy")
      );
    gulp
      .watch("src/assets/css/*.scss")
      .on("change", gulp.series("scssCompile", "fileinclude"));
    gulp.watch("src/assets/js/*.js").on("change", gulp.series("scriptCopy"));
    resolve();
  });
});

// browser refresh
gulp.task("browserSync", function () {
  return new Promise((resolve) => {
    browserSync.init({
      server: {
        baseDir: "dist"
      }
    });
    resolve();
  });
});

// run gulp
gulp.task(
  "default",
  gulp.series([
    "clean",
    "scssCompile",
    "htmlIndex",
    "html",
    "fileinclude",
    "filesCopy",
    "imagesCopy",
    "scriptCopy",
    "browserSync",
    "watch"
  ])
);
