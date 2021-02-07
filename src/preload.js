const electron = require('electron');
var log = require('electron-log');

process.on('uncaughtException', function(err) {
  log.error('electron:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
  app.quit();
});
process.once('loaded', () => {
    global.app = electron.remote.app;
    global.Datastore = require('nedb');
    global.fs = require('fs');
    global.path = require('path');
});