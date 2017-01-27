'use strict';

const electron = require('electron');

const app = electron.app;
const ipcMain = electron.ipcMain;

let mainWindow;

function onClosed() {
	mainWindow = null;
}

function createMainWindow() {
	const options = {
		width: 800,
		height: 600,
		resizable:  false,
		minimizable: false,
		maximizable: false,
		frame: false,
		title: 'i-Mutabakat Resmi Logo Aktarım Aracı',
		icon: './app/img/logo-96.png'
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

	if (process.env.NODE_ENV === 'development') {
    require('electron-connect').client.create(mainWindow);
    require('electron-debug')();
	}
});

ipcMain.on('close-main-window', () => {
	mainWindow.close()
});
