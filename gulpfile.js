'use strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const connect = require('electron-connect');
const jetpack = require('fs-jetpack');
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');

const projectDir = jetpack;
const destDir = projectDir.cwd('./build');

const electron = connect.server.create({
	stopOnClose: true,
	spawnOpt: {
		env: {
			NODE_ENV: 'development'
		}
	}
});

const callback = (electronProcState) => {
	console.log('Electron process state: ' + electronProcState);

	if (electronProcState === 'stopped') {
		process.exit(callback);
	}
};

gulp.task('clean', () => {
  return destDir.dirAsync('.', {empty: true});
});

gulp.task('copy', ['clean'], () => {
  return projectDir.copyAsync('./', destDir.path(), {
    overwrite: true,
    matching: [
      './main.js',
      './package.json',
      './app/assets/fonts/*',
      './app/assets/images/*',
      './app/**/*.html'
    ]
  });
});

gulp.task('symlink', ['copy'], (cb) => {
  return fs.symlink(path.resolve('./node_modules'), './build/node_modules', 'dir', cb);
});

gulp.task('build', ['symlink'], () => {
  return gulp.src('./app/index.html')
    .pipe(usemin({
      js: [uglify()]
    }))
    .pipe(gulp.dest('build/app/'));
});

gulp.task('serve', () => {
	electron.start(callback);

	gulp.watch(['app.js', './app/**/*.js'], ['restart:browser']);
	gulp.watch(['./app/**/*.html', './app/**/*.css'], ['reload:renderer']);
});

gulp.task('restart:browser', done => {
	electron.restart(callback);
	done();
});

gulp.task('reload:renderer', done => {
	electron.reload(callback);

	setTimeout(function () {
		electron.broadcast('Sayfa güncellendi.');
		done();
	});
});

gulp.task('default', ['serve']);
