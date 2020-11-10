const app = window.app;
var Datastore = require('nedb');
var path = require('path');
export default new Datastore({
    filename: path.join(app.getPath('userData'), '/alarm.db'),
    autoload: true
});