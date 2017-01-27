process.once('loaded', () => {
  const electron = require('electron');

  global.process = process;
  global.ipcRenderer = electron.ipcRenderer;
});
