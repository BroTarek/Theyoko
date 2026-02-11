const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'backend', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Querying submissions for "Mohamed Tarek"...');
db.all('SELECT * FROM submissions WHERE full_name LIKE "%Mohamed Tarek%"', [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(JSON.stringify(rows, null, 2));
    db.close();
});
