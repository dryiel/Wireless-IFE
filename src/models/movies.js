const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    genre: {
      type: String,
    },
    releaseYear: {
      type: Number,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
