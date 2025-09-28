// Import Plugins / Libraries
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
//const { client } = require("./config/mongo");
const movieRoutes = require("./routes/movies");


// Setup 
dotenv.config();            // Load .env
const app = express();      // Init Express
const prisma = new PrismaClient();

// Middleware
app.use(express.json());    // Parse JSON body
app.use(cors());            // Allow cross-origin requests
app.use(morgan("dev"));     // Log HTTP requests
app.use(helmet());          // Security headers

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ error: "Something went wrong, please try again later" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


// === Routes ===

// Route Alert
app.get("/", (req, res) => {
  res.send("🚀 Wireless IFE Web API (SQLite mode) is running!");
});

// Routes user
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

// SQLite (via Prisma)
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({ data: { name, email } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }});
  app.use("/movies", movieRoutes);

// MongoDB
app.get("/logs", async (req, res) => {
  try {
    await client.connect(); // penting: connect sebelum query
    const logs = await client
      .db("mydb")
      .collection("logs")
      .find()
      .toArray();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close(); // tutup koneksi biar gak leak
  }
});

// response backend running
app.get("/", (req, res) => {
  res.send("🚀 Wireless IFE Web API is running!");
});

// Export App
module.exports = app;
// === End of File ===