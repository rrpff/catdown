var gulp = require("gulp"),
	es = require("event-stream"),
	concat = require("gulp-concat"),
	stylus = require("gulp-stylus"),
	Path = require("path");

// Define all task paths
var tasks = {
	styles: {
		src: ["./styles/src/catdown.styl"],
		dest: "./styles/dist/",
		concat: "./styles/src/codemirror.css"
	}
}

// Start all tasks
gulp.task("default", Object.keys(tasks));

// Watch all task source files
gulp.task("watch", ["default"], function(){
	for(var task in tasks)
		gulp.watch(tasks[task].src, [task]);
});

// Compile Stylus files and concat each to codemirror basic styles
gulp.task("styles", function(){
	// Create and merge streams
	var file = tasks.styles.src,
		styl = gulp.src(file).pipe(stylus()),
		css = gulp.src(tasks.styles.concat),
		merged = es.merge(css, styl),
		fpath = Path.basename(file, ".styl") + ".css";

	// Concatenate and save
	merged.pipe(concat(fpath))
		.pipe(gulp.dest(tasks.styles.dest));
});