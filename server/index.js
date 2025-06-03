const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pasta estática para servir imagens
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/auth', authRoutes);
app.use('/menu', menuRoutes);
app.use('/orders', ordersRoutes);

// Sincroniza modelos e inicia servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com SQLite bem-sucedida.');
    // Passar { force: true } só se quiser recriar as tabelas a cada restart
    await sequelize.sync();
    console.log('Tabelas sincronizadas.');

    app.listen(PORT, () => {
      console.log(`Servidor KiTempero rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao conectar ou sincronizar banco:', err);
  }
})();
