const app = window.app;
var Datastore = require('nedb');
var path = require('path');
console.log("しね");
export default new Datastore({
    filename: path.join(app.getPath('userData'), '/alarm.db'),
    autoload: true
});