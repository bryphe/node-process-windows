var gulp = require("gulp");
var msbuild = require("gulp-msbuild");
var path = require("path");

gulp.task("build", () => {
    return gulp.src(path.join(__dirname, "windows-console-app", "windows-console-app.sln"))
            .pipe(msbuild());
});

gulp.task("default", gulp.series("build"));
