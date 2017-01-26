'use strict';

const gulp = require('gulp');
const connect = require('electron-connect');

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

gulp.task('serve', function () {
	electron.start(callback);

	gulp.watch(['*.js', './app/**/*.js'], ['restart:browser']);
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
