const sqlite3 = require('sqlite3').verbose();
const db_file_location = './db_data.db';
const notifier = require('node-notifier');

let _db = null;


function open_db(file_name) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(file_name, (err) => {
        if (err) {
          console.log(`Failed to connect to ${file_name}`);
          reject(err);
        } else {
          console.log(`Successfully connected to ${file_name}`);
          resolve(db);
        }
      });
    });
  }


  assignDataBase = async () => {
    try {
    _db = await open_db('db_data.db');
    } catch(err) {
        notifyError(err);
    }
  };

  
    
  doAll = async () => {
    debugger;
    await assignDataBase();
    let dbnames = await getAllDataBasesNames();

    //let query1 = `SELECT * FROM ${dbnames[0]}`;
    let tableNamesQuery = "SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%'";
    let allTablesNames = await get_all(_db, tableNamesQuery);

    for(let tableName of allTablesNames) {
        let oneTable = await get_all(_db, `SELECT * FROM ${tableName['name']}`);    
        console.log(`-= The current table: ${tableName['name']} =-`);
        for(let one of oneTable) {
            console.table(one);
        }
        console.log('-----------------------------------');

    }
  };
  doAll();

function get_all(db, query) {
  return new Promise((resolve, reject) => {
    //const all_books = "SELECT * FROM BOOKS";
    db.all(query, function (err, rows) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(rows);
    });
  });
};

getAllDataBasesNames = async () => {
    let query1 = "SELECT * FROM pragma_database_list";
    let dbnames = [];
    let allDbsData = await get_all(_db, query1);
    for(let one of allDbsData) {
        for(let x in one) {
            if(x === 'name')
                dbnames.push(one[x]);
        }
    }
    return dbnames; 
};

  notifyError = (err) => {
    if(err.message) {
        notifier.notify({
            title: err.message,
            message: err.stack
        });
    }
  };


  


  /**function get_all(db, query) {
    return new Promise((resolve, reject) => {
      //const all_books = "SELECT * FROM BOOKS";
      db.all(query, function (err, rows) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(rows);
      });
    });
  }*/