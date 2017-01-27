'use strict';

const fs = require('fs');
const gulp = require('gulp');
const jetpack = require('fs-jetpack');
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const connect = require('electron-connect');

const dir = {
  build: jetpack.cwd('./build'),
  module: jetpack.cwd('./node_modules')
};

const electron = connect.server.create({
  stopOnClose: true,
  spawnOpt: {
    env: {
      NODE_ENV: 'development'
    }
  }
});

function cbProcess(processState) {
  console.log(`Electron process state: ${processState}`);

  if (processState === 'stopped') {
    process.exit(cbProcess);
  }
}

gulp.task('clean', () => {
  return dir.build.dirAsync('.', {empty: true});
});

gulp.task('copy', ['clean'], () => {
  return jetpack.copyAsync('.', dir.build.path(), {
    overwrite: true,
    matching: [
      './main.js',
      './package.json',
      './app/**/*.html',
      './app/assets/fonts/*',
      './app/assets/images/*',
      './app/scripts/preload.js'
    ]
  });
});

gulp.task('symlink', ['copy'], (done) => {
  return fs.symlink(
    dir.module.path(),
    './build/node_modules', 'dir', done
  );
});

gulp.task('build', ['symlink'], () => {
  return gulp.src('./app/index.html')
    .pipe(usemin({js: [uglify()]}))
    .pipe(gulp.dest('./build/app'));
});

gulp.task('serve', () => {
  electron.start(cbProcess);

  gulp.watch(['main.js', './app/**/*.js'], ['restart:browser']);
  gulp.watch(['./app/**/*.html', './app/**/*.css'], ['reload:renderer']);
});

gulp.task('restart:browser', (done) => {
  electron.restart(cbProcess);
  done();
});

gulp.task('reload:renderer', (done) => {
  electron.reload(cbProcess);

  setTimeout(function () {
    electron.broadcast('Rendered.');
    done();
  });
});

gulp.task('default', ['serve']);
