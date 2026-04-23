const mongoose = require("mongoose");

const certSchema = new mongoose.Schema({
  name: String,
  course: String,
  txHash: String,
  date: String,
});

module.exports = mongoose.model("Certificate", certSchema);