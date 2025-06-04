const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.findAll();
    const host = req.get("host");
    const protocol = req.protocol;
    const itemsWithUrl = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: `${protocol}://${host}/uploads/${item.image}`,
    }));
    return res.status(200).json(itemsWithUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao buscar cardápio" });
  }
});

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !price || !req.file) {
    return res.status(400).json({ message: "Campos obrigatórios: name, price e image" });
  }
  try {
    const menuItem = await MenuItem.create({
      name,
      description,
      price: parseFloat(price),
      image: req.file.filename,
    });
    return res.status(201).json({ message: "Item criado com sucesso", id: menuItem.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao criar item" });
  }
});

router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  const itemId = req.params.id;
  try {
    const item = await MenuItem.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item não encontrado" });
    }
    const { name, description, price } = req.body;
    if (name) item.name = name;
    if (description !== undefined) item.description = description;
    if (price) item.price = parseFloat(price);

    if (req.file) {
      const oldImagePath = path.join(__dirname, "../uploads", item.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      item.image = req.file.filename;
    }

    await item.save();
    return res.status(200).json({ message: "Item atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao atualizar item" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const itemId = req.params.id;
  try {
    const item = await MenuItem.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item não encontrado" });
    }
    const imagePath = path.join(__dirname, "../uploads", item.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    await item.destroy();
    return res.status(200).json({ message: "Item deletado com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao deletar item" });
  }
});

module.exports = router;
