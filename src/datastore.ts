declare global { 
    interface Window { app: any } 
}
window.app = window.app || {};
const app = window.app;
//const Datastore = require('nedb');
import Datastore from 'nedb';
import path from 'path';
//import { AsyncNeDBDataStore } from './nedb_async';
//export default new AsyncNeDBDataStore({
export default new Datastore({
    filename: path.join(app.getPath('userData'), '/alarm.db'),
    autoload: true
});