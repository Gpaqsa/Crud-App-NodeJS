const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./blog.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// მომხმარებლების ცხრილის შექმნა (ამოვაცილეთ თუ უკვე არსებობს)
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )
`);

// პოსტების ცხრილის შექმნა (ამოვაცილეთ თუ უკვე არსებობს)
db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    userId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  )
`);

// კომენტარების ცხრილის შექმნა (ამოვაცილეთ თუ უკვე არსებობს)
db.run(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    postId INTEGER,
    userId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(postId) REFERENCES posts(id),
    FOREIGN KEY(userId) REFERENCES users(id)
  )
`);

module.exports = db;
