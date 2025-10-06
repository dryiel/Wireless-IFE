const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const User = require("../models/user");
const BlacklistToken = require("../models/BlacklistToken");

const router = express.Router();
router.use(cookieParser(process.env.COOKIE_SECRET));

// 🧠 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: "user" });
    await user.save();
    res.json({ message: "✅ User registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔑 LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  // 🧁 Simpan refreshToken di cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // aktif kalau deploy HTTPS
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  });

  res.json({ message: "✅ Login successful", accessToken });
});

// 🔁 REFRESH TOKEN (pakai cookie)
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "No token" });

    // 🚫 Cek apakah token sudah diblacklist
    const blacklisted = await BlacklistToken.findOne({ token: refreshToken });
    if (blacklisted) return res.status(403).json({ error: "Token revoked" });

    // Kalau belum diblacklist → verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});

// 🚪 LOGOUT

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken)
      return res.status(400).json({ error: "No refresh token provided" });

    // Decode token buat dapet expired date
    const decoded = jwt.decode(refreshToken);
    const expiredAt = new Date(decoded.exp * 1000);

    // Simpan ke blacklist
    await BlacklistToken.create({ token: refreshToken, expiredAt });

    // Hapus cookie
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.json({ message: "✅ Logged out & token blacklisted" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
});

module.exports = router;
