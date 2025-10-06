const app = require("./app.js");  // karena app.js ada di folder src
const { connectMongo } = require("./config/mongo.js");
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    console.log("✅ MongoDB connected successfully!");

    // 🧹 Auto clean expired blacklist tokens setiap 6 jam
    setInterval(async () => {
      const result = await BlacklistToken.deleteMany({
        expiredAt: { $lt: new Date() },
      });
      if (result.deletedCount > 0) {
        console.log(`🧹 Cleared ${result.deletedCount} expired blacklist tokens`);
      }
    }, 1000 * 60 * 60 * 6);

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Server startup failed:", err);
  }
})();