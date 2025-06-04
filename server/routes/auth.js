const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username e senha são obrigatórios" });
  }
  try {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(409).json({ message: "Usuário já existe" });
    }
    const user = await User.create({ username, password });
    return res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username e senha são obrigatórios" });
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const valid = await user.validPassword(password);
    if (!valid) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

module.exports = router;
