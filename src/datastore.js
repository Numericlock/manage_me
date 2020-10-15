const app = window.app;
const Datastore = window.Datastore;
console.log("しね");
const db = new Datastore({ 
    filename: app.getPath('userData')+'/data.db',
    autoload: true
});
    import dbData from '../namelist.json';
    db.insert(dbData);
    db.insert(dbData, (error, newDoc) => {
      if(error !== null){
        console.error(error);
      }
      // newDocにはアルファベット16文字の値を持つ_idフィールドが追加される
      console.log(newDoc);
    });