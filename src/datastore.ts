declare global { 
    interface Window { app: any } 
}
window.app = window.app || {};
const app = window.app;
//const Datastore = require('nedb');
import Datastore from 'nedb';
import path from 'path';
export default new Datastore({
    filename: path.join(app.getPath('userData'), '/alarm.db'),
    autoload: true
});