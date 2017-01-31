process.once('loaded', () => {
  const sql = require('mssql');
  const lodash = require('lodash');
  const Promise = require('bluebird');
  const electron = require('electron');
  const storage = require('electron-json-storage');
  const encryptor = require('simple-encryptor')(process.env.PRIVATE_KEY);

  global._ = lodash;
  global.sql = sql;
  global.process = process;
  global.encryptor = encryptor;
  global.ipcRenderer = electron.ipcRenderer;
  global.storage = Promise.promisifyAll(storage);
});
