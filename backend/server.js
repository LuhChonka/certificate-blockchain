require("./db");
const express = require("express");
const cors = require("cors");
const certRoutes = require("./routes/cert");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/cert", certRoutes);

app.listen(5000, () => console.log("Server running on 5000"));