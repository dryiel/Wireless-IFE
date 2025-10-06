const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiredAt: { type: Date, required: true }, // kapan token ini kadaluarsa
});


module.exports = mongoose.model("BlacklistToken", blacklistTokenSchema);
