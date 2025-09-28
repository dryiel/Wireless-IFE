// import Plugins / Libraries
const { MongoClient } = require("mongodb");

// connect to MongoDB
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";
const client = new MongoClient(uri);
module.exports = { client: null, connectMongo: async () => {} };

// connect function
async function connectMongo() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
  }
}

// export client
module.exports = { client, connectMongo };
// === End of File ===