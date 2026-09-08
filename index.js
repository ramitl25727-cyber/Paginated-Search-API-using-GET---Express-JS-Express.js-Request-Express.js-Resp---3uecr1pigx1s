const express = require("express");
const fs = require("fs");

const app = express();

// Load data from db.json
const allArticles = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

app.get("/search", (req, res) => {
  const { name, limit = 5, page = 1 } = req.query;

  // Validate name parameter
  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Search name parameter is required." });
  }

  const searchTerm = name.toLowerCase();
  const limitNum = parseInt(limit);
  const pageNum = parseInt(page);

  // Filter articles by title (case-insensitive)
  const filtered = allArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm)
  );

  const totalResults = filtered.length;
  const totalPages = Math.ceil(totalResults / limitNum);

  // Paginate results
  const startIndex = (pageNum - 1) * limitNum;
  const articles = filtered.slice(startIndex, startIndex + limitNum);

  res.status(200).json({
    currentPage: pageNum,
    totalPages,
    totalResults,
    articles,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
