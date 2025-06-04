const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/database");
const User = require("./models/User");
const MenuItem = require("./models/MenuItem");
const Order = require("./models/Order");

const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const ordersRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", ordersRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com SQLite bem-sucedida.");
    await sequelize.sync();
    console.log("Tabelas sincronizadas.");

    app.listen(PORT, () => {
      console.log(`Servidor KiTempero rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao conectar ou sincronizar banco:", err);
  }
})();
