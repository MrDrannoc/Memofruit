const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.db');

// Créer la tables "scores" dans la base de données   
db.serialize(() => {
    db.run("DROP TABLE scores");
    db.run("CREATE TABLE IF NOT EXISTS scores([Id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,[Score] INTEGER)");
    db.run("INSERT INTO scores (score) VALUES  (100), (200), (300)");
});

module.exports = db;