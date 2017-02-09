'use strict';

const fs = require('fs');
const gulp = require('gulp');
const babel  = require('gulp-babel');
const jetpack = require('fs-jetpack');
const usemin = require('gulp-usemin');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const pkg = require('./package.json');
const connect = require('electron-connect');

const dir = {
  build: jetpack.cwd('./build'),
  dist: jetpack.cwd('./dist'),
  release: jetpack.cwd('./release'),
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
      './.env',
      './main.js',
      './package.json',
      './app/index.html',
      './app/i18n/**/*',
      './app/queries/**/*',
      './app/assets/images/*',
      './app/scripts/preload.js',
      './installers/win/setup-events.win.js',
    ]
  });
});

gulp.task('symlink', ['copy'], done =>
  fs.symlink(
    dir.module.path(),
    './build/node_modules', 'dir', done
  )
);

gulp.task('build:templates', ['symlink'], () =>
  gulp.src('./app/templates/*')
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true
    }))
    .pipe(gulp.dest('./build/app/templates'))
);

gulp.task('build', ['build:templates'], () =>
  gulp.src('./app/index.html')
    .pipe(usemin({
      'app': [babel({presets: ['es2015']}), uglify()],
      'vendor': [uglify()],
      'css': [cleanCSS()],
      'html': [htmlmin({collapseWhitespace: true})]
    }))
    .pipe(gulp.dest('./build/app'))
);

gulp.task('serve', () => {
  electron.start(cbProcess);

  gulp.watch(
    ['main.js'],
    ['restart:browser']
  );

  gulp.watch(
    [
      './app/**/*.html',
      './app/**/*.js',
      './app/**/*.css',
      './app/**/*.sql'
    ],
    ['reload:renderer']
  );
});

gulp.task('restart:browser', done => {
  electron.restart(cbProcess);
  done();
});

gulp.task('reload:renderer', done => {
  electron.reload(cbProcess);

  setTimeout(() => {
    electron.broadcast('Rendered.');
    done();
  });
});

gulp.task('default', ['serve']);
