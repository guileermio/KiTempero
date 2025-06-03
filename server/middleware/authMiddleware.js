const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Buscar usuário no banco só para validar existência
    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não existe' });
    }
    req.user = { id: user.id, username: user.username };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expirado ou inválido' });
  }
};

module.exports = authMiddleware;
