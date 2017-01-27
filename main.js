'use strict';

const electron = require('electron');

const app = electron.app;
const ipcMain = electron.ipcMain;

const env = process.env.NODE_ENV;

let mainWindow;

require('electron-debug')();

function onClosed() {
	mainWindow = null;
}

function createMainWindow() {
	const options = {
		width: 850,
    height: 650,
    frame: false,
    transparent: true,
    webPreferences: {
      devTools: env === 'development',
      preload: `${__dirname}/app/scripts/preload.js`
    }
	};

	const win = new electron.BrowserWindow(options);

	win.setMenu(null);
	win.loadURL(`file://${__dirname}/app/index.html`);
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

	if (env === 'development') {
    require('electron-connect').client.create(mainWindow);
	}
});

ipcMain.on('close', () => {
  mainWindow.close();
});
