const gulp = require('gulp');
const gulpIf = require('gulp-if');

const eslint = require('gulp-eslint');

const files = require('./config').files;
const htmlbeautify = require('gulp-html-beautify');

function isFixed(file) {
	return file.eslint != null && file.eslint.fixed;
}

function lintHtml() {
	var options = {
		indentSize: 4,
		end_with_newline: true
	};
	return gulp.src('app/*/*.html')
		.pipe(htmlbeautify(options))
		.pipe(gulp.dest('app'))
}

function lint() {
  // Note: To have the process exit with an error code (1) on lint error, return the stream and pipe to failOnError last.
  return gulp.src([files.moduleScripts, files.scripts, `!${files.tests}`, `!${files.bowerComponents}`, `!${files.tmp}`])
    .pipe(eslint({
      configFile: ".eslintrc.js",
      fix: true,
    }))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest('app')))
    .pipe(eslint.failAfterError())
}
lint.description = 'Ensures scripts (.js files in app directory) follow the style standards set in the .eslintrc file';

function cilint() {
  const reporter = require('../eslint/reports/teamcity-lite-reporter');
  // Note: To have the process exit with an error code (1) on lint error, return the stream and pipe to failOnError last.
  return gulp.src([files.moduleScripts, files.scripts, `!${files.tests}`, `!${files.bowerComponents}`, `!${files.tmp}`])
    .pipe(eslint({ rulePaths: ['eslint/rules/'] }))
    .pipe(eslint.format(reporter, (results) => { }))
    //.pipe(eslint.failAfterError());
}
cilint.description = 'Ensures scripts (.js files in app directory) follow the style standards set in the .eslintrc file';

module.exports = {
  lint,
  cilint,
	lintHtml,
};
