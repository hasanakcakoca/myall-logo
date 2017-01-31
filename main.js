'use strict';

const electron = require('electron');

const app = electron.app;
const ipcMain = electron.ipcMain;

const env = process.env.NODE_ENV;
const appDir = `${__dirname}/app`;

let mainWindow;

require('electron-debug')();
require('dotenv').config();

function onClosed() {
	mainWindow = null;
}

function createMainWindow() {
	const options = {
		width: 850,
    height: 650,
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      devTools: env === 'development',
      preload: `${appDir}/scripts/preload.js`
    }
	};

	const win = new electron.BrowserWindow(options);

	win.loadURL(`file://${appDir}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();

	mainWindow.show();

	if (env === 'development') {
    require('electron-connect').client.create(mainWindow);
	}
});

ipcMain.on('close', () => {
  mainWindow.close();
});
