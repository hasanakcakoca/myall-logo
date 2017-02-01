process.once('loaded', () => {
  const sql = require('mssql');
  const lodash = require('lodash');
  const Promise = require('bluebird');
  const electron = require('electron');
  const jetpack = require('fs-jetpack');
  const storage = require('electron-json-storage');
  const encryptor = require('simple-encryptor')(process.env.PRIVATE_KEY);

  const _session = electron.remote.session;

  global.sql = sql;
  global._ = lodash;
  global.process = process;
  global.jetpack = jetpack;
  global.encryptor = encryptor;
  global.ipcRenderer = electron.ipcRenderer;
  global.storage = Promise.promisifyAll(storage);
  global.session = _session.fromPartition('persist:name');

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
