const express = require("express");

const app = express();

const userRoutes = require("./routes/user");
const sequelize = require("./utils/database");

app.use(express.json());

app.use("/", userRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server running in port 3000");
  });
});
