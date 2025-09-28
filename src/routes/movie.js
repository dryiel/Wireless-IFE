const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// GET /movies
router.get("/", async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /movies
router.post("/", async (req, res) => {
  const { title, description, duration } = req.body;

  if (!title || !duration) {
    return res.status(400).json({ error: "Title and duration are required" });
  }

  try {
    const movie = await prisma.movie.create({
      data: { title, description, duration }
    });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
