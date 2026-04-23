
const mongoose = require("mongoose");

mongoose.connect("mongodb://shyamak:shyamak@ac-xtipslo-shard-00-00.titlxqb.mongodb.net:27017,ac-xtipslo-shard-00-01.titlxqb.mongodb.net:27017,ac-xtipslo-shard-00-02.titlxqb.mongodb.net:27017/certificates?ssl=true&replicaSet=atlas-ekyes5-shard-0&authSource=admin&appName=Cluster0");

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});