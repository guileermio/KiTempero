const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Criar pedido (apenas usuário autenticado)
router.post('/', authMiddleware, async (req, res) => {
  const { menuItemId, quantity } = req.body;
  if (!menuItemId) {
    return res.status(400).json({ message: 'menuItemId é obrigatório' });
  }
  try {
    // Verifica se o item existe
    const item = await MenuItem.findByPk(menuItemId);
    if (!item) {
      return res.status(404).json({ message: 'Item do cardápio não encontrado' });
    }
    const order = await Order.create({
      userId: req.user.id,
      menuItemId,
      quantity: quantity ? parseInt(quantity) : 1
    });
    return res.status(201).json({ message: 'Pedido criado com sucesso', orderId: order.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar pedido' });
  }
});

// Listar pedidos do usuário autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { model: MenuItem, attributes: ['name', 'price', 'image'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    const host = req.get('host');
    const protocol = req.protocol;
    const formatted = orders.map(o => ({
      id: o.id,
      quantity: o.quantity,
      createdAt: o.createdAt,
      menuItem: {
        id: o.MenuItem.id,
        name: o.MenuItem.name,
        price: o.MenuItem.price,
        imageUrl: `${protocol}://${host}/uploads/${o.MenuItem.image}`
      }
    }));
    return res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar pedidos' });
  }
});

module.exports = router;
