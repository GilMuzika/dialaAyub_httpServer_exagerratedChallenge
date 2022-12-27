const sqlite3 = require('sqlite3').verbose();
const db_file_loc = './db_data.db';
const fs = require('fs');
const { dirname } = require('path');

function open_db(file_name) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(file_name, (err) => {
            if (err) {
                console.log(`Failed to connect to ${file_name}`);
                reject(err)
            }
            else {
                console.log(`Successfully connected to ${file_name}`);
                resolve(db)
            }
        })
    })
};

function get_all(db, query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(rows)
            }
        });
    });
};

function close_db(db) {
    return new Promise((resolve, reject) => {
        db.close(err => {
            if (err) {
                console.log(err.message);
                reject(err.message)
            }
            else {
                console.log('Database connection closed!');
                resolve()
            }
        })
    })
};

function readfileasync(path_to_file) {
    return new Promise((resolv, reject) => {
        fs.readFile(path_to_file, (err, data) => {
            if (!err) {
                resolv(data)
            }
            else {
                reject(err)
            }
        })
    })
}


getAllBooks = async () => {
    const db = await open_db(db_file_loc);
    let books = await get_all(db, 'SELECT * FROM BOOKS');
    await close_db(db);
    return books;
};

exports.getBooks = async () => {
    let replacingString = '';
    let allBooks = await getAllBooks();
    for(let one of allBooks) {
        replacingString += 
        '<tr>\n' + 
            `<td>${one['ID']}</td>\n` + 
            `<td>${one['TITLE']}</td>\n` +
            `<td>${one['AUTHOR']}</td>\n` +
            `<td>${one['PUBLISH_YEAR']}</td>\n` +
            `<td>${one['PRICE']}</td>` +
            `<td>${one['LEFT_IN_STOCK']}</td>\n` +
            `<td>${one['BOOK_IMAGE_SRC']}</td>\n` +
        '</tr>\n'
    }



     fileBuffer = await readfileasync(`${__dirname}/htmlTemplate.html`);
     return fileBuffer.toString().replace('{{{replace_this}}}', replacingString);
};


