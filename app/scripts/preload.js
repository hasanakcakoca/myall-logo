process.once('loaded', () => {
  const env = process.env.NODE_ENV; 

  const fs = require('fs');
  const lodash = require('lodash');
  const Promise = require('bluebird');
  const log = require('electron-log');
  const electron = require('electron');
  const storage = require('electron-json-storage'); 
  const encryptor = require('simple-encryptor')(process.env.PRIVATE_KEY);
 
  const {remote} = electron;
  const {app} = remote;
  const _session = remote.session;

  const updater = remote.require('electron-simple-updater'); 

  global.fs = fs;
  global.app = app;
  global.log = log;
  global._ = lodash;
  global.process = process;
  global.remote = remote;
  global.updater = updater;  
  global.encryptor = encryptor;
  global.ipcRenderer = electron.ipcRenderer;
  global.storage = Promise.promisifyAll(storage);
  global.session = _session.fromPartition('persist:name');

  global.env = env;
  global.isDevelopment = env === 'development';

  global.cookies = {
    getCookie: function (name) {
      return new Promise((resolve, reject) =>
        session.cookies.get({name}, (error, cookies) =>
          error ?
            reject(error) :
            resolve(cookies[0].value)
        )
      );
    },
    setCookie: function (name, value, hours) {
      const url = process.env.DOMAIN;

      let expiration = new Date();
      let hour = expiration.getHours();

      hour = hour + hours || 24 * 30;
      expiration.setHours(hour);

      let expirationDate = expiration.getTime();

      session.cookies.set({
        url,
        name,
        value,
        expirationDate
      }, console.log);
    }
  }
});
