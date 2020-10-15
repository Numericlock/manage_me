const electron = require('electron');

process.once('loaded', () => {
    global.app = electron.remote.app;
    global.Datastore = require('nedb');
    global.fs = require('fs');
});