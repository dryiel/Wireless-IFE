const app = require("./app.js");  // karena app.js ada di folder src
const { connectMongo } = require("./config/mongo.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  //await connectMongo();
});


