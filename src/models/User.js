const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
}, { timestamps: true });

//user refesh token
({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  refreshToken: { type: String, default: null } 
});

// ✅ Cegah OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
