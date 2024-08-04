const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(express.json());
app.use(cors());

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Blog application!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
