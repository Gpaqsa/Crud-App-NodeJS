const sqlite3 = require("sqlite3").verbose();
// Connect to the database
const db = new sqlite3.Database("./Database/blog.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// მომხმარებლების ცხრილის შექმნა
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email Text UNIQUE,
    password TEXT
  )
`);

// პოსტების ცხრილის შექმნა
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

// კომენტარების ცხრილის შექმნა
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

const insertUser = (username, email, password) => {
  const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
  db.run(sql, [username, email, password], function (err) {
    if (err) {
      console.error("Error inserting user:", err.message);
    } else {
      console.log(`User added with ID ${this.lastID}`);
    }
  });
};

const insertPost = (title, content, userId) => {
  const sql = `INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)`;
  db.run(sql, [title, content, userId], function (err) {
    if (err) {
      console.error("Error inserting post:", err.message);
    } else {
      console.log(`Post added with ID ${this.lastID}`);
    }
  });
};

const insertComment = (content, postId, userId) => {
  const sql = `INSERT INTO comments (content, postId, userId) VALUES (?, ?, ?)`;
  db.run(sql, [content, postId, userId], function (err) {
    if (err) {
      console.error("Error inserting comment:", err.message);
    } else {
      console.log(`Comment added with ID ${this.lastID}`);
    }
  });
};

// Example usage
insertUser("new_user", "new_user@example.com", "newpassword");
insertPost("New Post Title", "Content of the new post", 1);
insertComment("This is a comment", 1, 2);

// Close the database connection when done
const closeConnection = () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });
};

module.exports = {
  db,
  insertUser,
  insertPost,
  insertComment,
  closeConnection,
};
