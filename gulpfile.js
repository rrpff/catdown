var gulp = require("gulp"),
    es = require("event-stream"),
    concat = require("gulp-concat"),
    stylus = require("gulp-stylus"),
    browserify = require("gulp-browserify"),
    livereload = require("gulp-livereload"),
    Path = require("path");

// Define all task paths
var tasks = {
    styles: {
        src: ["./src/styles/global.styl"],
        css: ["./src/styles/**.css", "./node_modules/catdown/styles/dist/catdown.css"],
        dest: "./public/styles/",
        fname: "global.css"
    },
    scripts: {
        src: ["./src/scripts/index.js"],
        dest: "./public/scripts/"
    }
}

// Start all tasks
gulp.task("default", Object.keys(tasks));

// Watch all task source files
gulp.task("watch", ["default"], function(){
    livereload.listen();
    for(var task in tasks)
        gulp.watch(tasks[task].src, [task])
            .on("change", livereload.changed);
});

// Compile Stylus files and concat each to codemirror basic styles
gulp.task("styles", function(){
    // Create and merge streams
    var styl = gulp.src(tasks.styles.src).pipe(stylus()),
        css = gulp.src(tasks.styles.css),
        merged = es.merge(css, styl);

    // Concatenate and save
    merged.pipe(concat(tasks.styles.fname))
        .pipe(gulp.dest(tasks.styles.dest));
});

gulp.task("scripts", function(){
    gulp.src(tasks.scripts.src)
        .pipe(browserify())
        .pipe(gulp.dest(tasks.scripts.dest));
});