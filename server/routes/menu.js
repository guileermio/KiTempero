const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração Multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    // Garante que a pasta exista
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Nome único: timestamp + nome original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Rota para listar todos os itens do cardápio (pública)
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.findAll();
    // Adiciona URL completa da imagem
    const host = req.get('host');
    const protocol = req.protocol;
    const itemsWithUrl = items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: `${protocol}://${host}/uploads/${item.image}`
    }));
    return res.status(200).json(itemsWithUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar cardápio' });
  }
});

// Rota para criar novo item de cardápio (protegida)
// Espera: multipart/form-data com campos: name, description, price e file "image"
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !price || !req.file) {
    return res.status(400).json({ message: 'Campos obrigatórios: name, price e image' });
  }
  try {
    const menuItem = await MenuItem.create({
      name,
      description,
      price: parseFloat(price),
      image: req.file.filename
    });
    return res.status(201).json({ message: 'Item criado com sucesso', id: menuItem.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar item' });
  }
});

module.exports = router;
