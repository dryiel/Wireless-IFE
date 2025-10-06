const express = require("express");
const verifyAccessToken = require("../middleware/verifyAccessToken");
const Movie = require("../models/movies");

const router = express.Router();

// 🧠 Semua user login bisa lihat movie
router.get("/", verifyAccessToken, async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

// 🧠 Hanya admin bisa nambah movie
router.post("/", verifyAccessToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Forbidden: admin only" });

  const { title, genre, rating } = req.body;
  const newMovie = new Movie({ title, genre, rating });
  await newMovie.save();
  res.json({ message: "Movie added!", newMovie });
});

module.exports = router;
